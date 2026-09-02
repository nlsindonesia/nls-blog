
        function lmsPlayer() {
            return {
                sidebarOpen: false,
                courseData: null,
                babs: [],
                activeNode: null,
                completedNodes: [],
                quizAnswers: {},
                quizState: { submitted: false, score: 0, correct: 0, total: 0 },
                
                // YouTube Interactive API state
                ytPlayer: null,
                ytPollInterval: null,
                interactiveQuiz: {
                    active: false,
                    currentQ: null,
                    answer: null,
                    answeredQs: []
                },
                
                async init() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const courseId = urlParams.get('course');
                    
                    if (courseId) {
                        try {
                            const res = await fetch('/api/pg-lms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'get_courses' })
                            });
                            const data = await res.json();
                            if (data.success && data.data) {
                                const course = data.data.find(c => c.id === courseId);
                                if (course) {
                                    this.courseData = course;
                                    let rawBabs = (course.babs && course.babs.length > 0) ? course.babs : 
                                                  ((course.content && course.content.length > 0) ? course.content : (course.modules || []));
                                    if (rawBabs.length > 0 && rawBabs[0].subBabs === undefined) {
                                        this.babs = [{ id: 'b1', title: 'Bab 1 (Semua Modul)', expanded: true, subBabs: rawBabs }];
                                    } else {
                                        this.babs = rawBabs;
                                    }
                                } else {
                                    this.tryLoadDraft();
                                }
                            } else {
                                this.tryLoadDraft();
                            }
                        } catch(e) {
                            this.tryLoadDraft();
                        }
                    } else {
                        this.tryLoadDraft();
                    }
                    
                    // Fetch completed modules from server if available (mocked for now since it needs user data)
                    this.loadProgress();

                    // Load YT Iframe API
                    if (!window.YT) {
                        const tag = document.createElement('script');
                        tag.src = "https://www.youtube.com/iframe_api";
                        const firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    }
                    
                    // Auto open first node
                    if (this.babs.length > 0 && this.babs[0].subBabs && this.babs[0].subBabs.length > 0) {
                        this.openNode(this.babs[0].subBabs[0]);
                    }
                },

                tryLoadDraft() {
                    const saved = localStorage.getItem('lms_builder_draft');
                    if (saved) {
                        try {
                            this.babs = JSON.parse(saved);
                        } catch(e) { console.error('Gagal meload data', e); }
                    }
                },

                async loadProgress() {
                    try {
                        const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                        if (sessionRaw && this.courseData) {
                            const session = JSON.parse(sessionRaw);
                            if (session.id) {
                                const res = await fetch('/api/pg-lms', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'get_lms_data', userId: session.id })
                                });
                                const data = await res.json();
                                if (data.success && data.lmsData && data.lmsData.progressMap) {
                                    const courseProgress = data.lmsData.progressMap[this.courseData.id];
                                    if (courseProgress && courseProgress.completedModules) {
                                        this.completedNodes = courseProgress.completedModules;
                                    }
                                }
                            }
                        }
                    } catch(e) {
                        console.log('Failed to load progress', e);
                    }
                },

                initYoutubePlayer() {
                    if (this.ytPlayer) {
                        this.ytPlayer.destroy();
                        this.ytPlayer = null;
                    }
                    if (this.ytPollInterval) {
                        clearInterval(this.ytPollInterval);
                    }
                    
                    this.interactiveQuiz.active = false;
                    this.interactiveQuiz.answeredQs = [];
                    
                    if (!this.activeNode || this.activeNode.type !== 'video' || !this.activeNode.videoUrl) return;
                    
                    const videoId = this.extractYoutubeId(this.activeNode.videoUrl);
                    if (!videoId) return;

                    const setupPlayer = () => {
                        this.ytPlayer = new YT.Player('yt-player-container', {
                            videoId: videoId,
                            playerVars: { 'playsinline': 1 },
                            events: {
                                'onStateChange': this.onPlayerStateChange.bind(this)
                            }
                        });
                    };

                    if (window.YT && window.YT.Player) {
                        setupPlayer();
                    } else {
                        window.onYouTubeIframeAPIReady = () => {
                            setupPlayer();
                        };
                    }
                },

                onPlayerStateChange(event) {
                    if (event.data == YT.PlayerState.PLAYING) {
                        this.ytPollInterval = setInterval(() => this.checkInteractiveQuizzes(), 1000);
                    } else {
                        clearInterval(this.ytPollInterval);
                    }
                    
                    // Mark video as completed if it ends
                    if (event.data == YT.PlayerState.ENDED) {
                        this.markAsCompleted(this.activeNode.id);
                    }
                },

                checkInteractiveQuizzes() {
                    if (!this.ytPlayer || !this.activeNode || !this.activeNode.questions) return;
                    
                    const currentTime = this.ytPlayer.getCurrentTime();
                    
                    // Find a question that should trigger now
                    const qToTrigger = this.activeNode.questions.find(q => 
                        q.videoTimestamp && 
                        parseInt(q.videoTimestamp) <= currentTime && 
                        !this.interactiveQuiz.answeredQs.includes(q.id)
                    );

                    if (qToTrigger) {
                        this.ytPlayer.pauseVideo();
                        this.interactiveQuiz.currentQ = qToTrigger;
                        this.interactiveQuiz.answer = null;
                        this.interactiveQuiz.active = true;
                    }
                },
                
                skipInteractiveQuiz() {
                    this.interactiveQuiz.answeredQs.push(this.interactiveQuiz.currentQ.id);
                    this.interactiveQuiz.active = false;
                    if (this.ytPlayer) this.ytPlayer.playVideo();
                },

                submitInteractiveQuiz() {
                    if (this.interactiveQuiz.answer === null) {
                        alert('Silakan pilih jawaban terlebih dahulu!');
                        return;
                    }
                    
                    const q = this.interactiveQuiz.currentQ;
                    if (this.interactiveQuiz.answer == q.correctAnswers) {
                        // Show toast or something for correct answer
                        // alert('Benar!');
                    } else {
                        // alert('Salah, tapi Anda bisa lanjut menonton.');
                    }
                    
                    this.skipInteractiveQuiz(); // Resumes video and marks as answered
                },

                openNode(node) {
                    if (this.ytPlayer) {
                        this.ytPlayer.destroy();
                        this.ytPlayer = null;
                    }
                    if (this.ytPollInterval) clearInterval(this.ytPollInterval);
                    
                    this.activeNode = node;
                    this.sidebarOpen = false;
                    this.quizState.submitted = false;
                    this.quizAnswers = {};
                    
                    // Allow Alpine to update DOM, then init player if video
                    this.$nextTick(() => {
                        if (this.activeNode.type === 'video') {
                            this.initYoutubePlayer();
                        }
                    });
                },


                isCompleted(id) {
                    return this.completedNodes.includes(id);
                },

                markAsCompleted(id) {
                    if (!this.completedNodes.includes(id)) {
                        this.completedNodes.push(id);
                        
                        // Sync to database
                        try {
                            const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                            if (sessionRaw && this.courseData) {
                                const session = JSON.parse(sessionRaw);
                                if (session.id) {
                                    fetch('/api/pg-lms', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            action: 'update_progress',
                                            userId: session.id,
                                            courseId: this.courseData.id,
                                            progress: this.getProgress(),
                                            completedModules: this.completedNodes
                                        })
                                    }).catch(e => {});
                                }
                            }
                        } catch(e) {}
                    }
                },

                getProgress() {
                    let totalNodes = 0;
                    this.babs.forEach(b => totalNodes += (b.subBabs ? b.subBabs.length : 0));
                    if (totalNodes === 0) return 0;
                    return Math.round((this.completedNodes.length / totalNodes) * 100);
                },

                extractYoutubeId(url) {
                    if (!url) return '';
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : null;
                },

                submitQuiz() {
                    if (!this.activeNode || !this.activeNode.questions) return;
                    
                    let correct = 0;
                    let totalGradable = 0;
                    
                    this.activeNode.questions.forEach(q => {
                        if (q.type === 'essai') return; // Skip auto-grading for essay
                        
                        totalGradable++;
                        const ans = this.quizAnswers[q.id];
                        
                        if (q.type === 'pg') {
                            if (ans == q.correctAnswers) correct++;
                        } 
                        else if (q.type === 'pg_kompleks') {
                            const correctArr = q.correctAnswersArray || [];
                            const userArr = ans || [];
                            if (correctArr.length === userArr.length && correctArr.every(val => userArr.includes(val))) {
                                correct++;
                            }
                        }
                        else if (q.type === 'pg_majemuk') {
                            let allMatch = true;
                            const userObj = ans || {};
                            q.statements.forEach((stmt, sIdx) => {
                                if (userObj[sIdx] !== stmt.isCorrect) allMatch = false;
                            });
                            if (allMatch && q.statements.length > 0) correct++;
                        }
                        else if (q.type === 'jodoh') {
                            let allMatch = true;
                            const userObj = ans || {};
                            q.pairs.forEach((pair, pIdx) => {
                                if (userObj[pIdx] !== pair.right) allMatch = false;
                            });
                            if (allMatch && q.pairs.length > 0) correct++;
                        }
                        else if (q.type === 'isian') {
                            if (!q.shortAnswerKeys) return;
                            const keys = q.shortAnswerKeys.toLowerCase().split(',').map(k => k.trim());
                            if (ans && keys.includes(ans.toString().toLowerCase().trim())) correct++;
                        }
                    });

                    this.quizState.total = totalGradable;
                    this.quizState.correct = correct;
                    this.quizState.score = totalGradable > 0 ? Math.round((correct / totalGradable) * 100) : 100;
                    this.quizState.submitted = true;
                    this.markAsCompleted(this.activeNode.id);
                } else if (q.type === 'isian') {
                            const keys = q.shortAnswerKeys.toLowerCase().split(',').map(k => k.trim());
                            if (ans && keys.includes(ans.toLowerCase().trim())) correct++;
                        }
                        // Other types logic goes here for future implementation
                    });

                    this.quizState.total = total;
                    this.quizState.correct = correct;
                    this.quizState.score = total > 0 ? Math.round((correct / total) * 100) : 0;
                    this.quizState.submitted = true;
                    this.markAsCompleted(this.activeNode.id);
                }
            }
        }
    