
        function lmsPlayer() {
            return {
                showPasswordPrompt: false,
                coursePassword: '',
                lockedCourseData: null,
                isUnlocking: false,
                sidebarOpen: false,
                courseData: null,
                babs: [],
                activeNode: null,
                completedNodes: [],
                pastScores: {},
                quizAnswers: {},
                quizState: { submitted: false, isSubmitting: false, showDiscussion: false, hasEssay: false, score: 0, correct: 0, total: 0, inProgress: false, currentQIdx: 0, doubtful: [], timeLeft: 0, timerInterval: null, elapsedSeconds: 0, autosaveInterval: null, autosaveTimeout: null, activeQuestions: [], assignedPaket: 1 },
                
                // YouTube Interactive API state
                ytPlayer: null,
                ytPollInterval: null,
                interactiveQuiz: {
                    active: false,
                    currentQ: null,
                    answer: null,
                    answeredQs: []
                },

                formatGdrivePreview(url) {
                    if (!url) return null;
                    if (url.includes('drive.google.com/file/d/')) {
                        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                        if (match && match[1]) {
                            return `https://drive.google.com/file/d/${match[1]}/preview`;
                        }
                    }
                    if (url.includes('drive.google.com/drive/folders/')) {
                        const match = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
                        if (match && match[1]) {
                            let resourceKey = '';
                            if (url.includes('resourcekey=')) {
                                const rkMatch = url.match(/resourcekey=([^&]+)/);
                                if (rkMatch && rkMatch[1]) {
                                    resourceKey = `&resourcekey=${rkMatch[1]}`;
                                }
                            }
                            return `https://drive.google.com/embeddedfolderview?id=${match[1]}${resourceKey}#list`;
                        }
                    }
                    if (url.includes('drive.google.com/open?id=')) {
                        const match = url.match(/id=([a-zA-Z0-9_-]+)/);
                        if (match && match[1]) {
                            return `https://drive.google.com/file/d/${match[1]}/preview`;
                        }
                    }
                    return null;
                },
                
                async init() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const courseId = urlParams.get('course');
                    
                    if (courseId) {
                        try {
                            const savedPassword = localStorage.getItem('unlocked_' + courseId) || '';
                            const res = await fetch('/api/pg-lms', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ action: 'get_courses', targetCourseId: courseId, targetPassword: savedPassword })
                            });
                            const data = await res.json();
                            if (data.success && data.data) {
                                const course = data.data.find(c => c.id === courseId);
                                if (course) {
                                    if (course.isLocked) {
                                        this.lockedCourseData = course;
                                        this.showPasswordPrompt = true;
                                        return; // Wait for password input
                                    }
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
                    
                    await this.loadProgress();

                    window.addEventListener('popstate', (e) => {
                        const params = new URLSearchParams(window.location.search);
                        const nodeId = params.get('node');
                        if (nodeId) {
                            const found = this.findNodeById(nodeId);
                            if (found) {
                                found.bab.expanded = true;
                                this.openNode(found.node, true);
                            }
                        } else {
                            if (this.babs && this.babs.length > 0 && this.babs[0].subBabs && this.babs[0].subBabs.length > 0) {
                                this.openNode(this.babs[0].subBabs[0], true);
                            }
                        }
                    });

                // Load YT Iframe API
                    if (!window.YT) {
                        const tag = document.createElement('script');
                        tag.src = "https://www.youtube.com/iframe_api";
                        const firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                        window.onYouTubeIframeAPIReady = () => {
                            if (this.activeNode && this.activeNode.type === 'video') {
                                this.initYoutubePlayer();
                            }
                        };
                    }

                    this.handleInitialNode();
                    
                    this.setupBeacon();
                },

                async submitCoursePassword() {
                    if (!this.coursePassword) {
                        alert('Silakan masukkan password.');
                        return;
                    }
                    this.isUnlocking = true;
                    try {
                        const courseId = this.lockedCourseData.id;
                        const res = await fetch('/api/pg-lms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'get_courses', targetCourseId: courseId, targetPassword: this.coursePassword })
                        });
                        const data = await res.json();
                        if (data.success && data.data) {
                            const course = data.data.find(c => c.id === courseId);
                            if (course && !course.isLocked) {
                                localStorage.setItem('unlocked_' + courseId, this.coursePassword);
                                this.showPasswordPrompt = false;
                                this.courseData = course;
                                let rawBabs = (course.babs && course.babs.length > 0) ? course.babs : ((course.content && course.content.length > 0) ? course.content : (course.modules || []));
                                if (rawBabs.length > 0 && rawBabs[0].subBabs === undefined) {
                                    this.babs = [{ id: 'b1', title: 'Bab 1 (Semua Modul)', expanded: true, subBabs: rawBabs }];
                                } else {
                                    this.babs = rawBabs;
                                }
                                await this.loadProgress();
                                if (this.babs && this.babs.length > 0 && this.babs[0].subBabs && this.babs[0].subBabs.length > 0) {
                                    this.openNode(this.babs[0].subBabs[0], true);
                                }
                            } else {
                                alert('Password salah. Silakan coba lagi.');
                            }
                        }
                    } catch(e) {
                        alert('Terjadi kesalahan. Periksa koneksi internet.');
                    }
                    this.isUnlocking = false;
                },

                findNodeById(nodeId) {
                    if (!this.babs) return null;
                    for (let bab of this.babs) {
                        if (!bab.subBabs) continue;
                        const found = bab.subBabs.find(s => s.id === nodeId);
                        if (found) return { bab, node: found };
                    }
                    return null;
                },

                handleInitialNode() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const initialNodeId = urlParams.get('node');
                    
                    if (initialNodeId) {
                        const found = this.findNodeById(initialNodeId);
                        if (found) {
                            found.bab.expanded = true;
                            this.openNode(found.node, true);
                            return;
                        }
                    }
                    
                    // Fallback to first node if not found or not specified
                    if (this.babs && this.babs.length > 0 && this.babs[0].subBabs && this.babs[0].subBabs.length > 0) {
                        this.openNode(this.babs[0].subBabs[0], true);
                    }
                },

                tryLoadDraft() {
                    const urlParams = new URLSearchParams(window.location.search);
                    const courseId = urlParams.get('course');
                    if (courseId) {
                        try {
                            const savedCoursesStr = localStorage.getItem('nls_lms_courses_v1');
                            if (savedCoursesStr) {
                                const savedCourses = JSON.parse(savedCoursesStr);
                                const course = savedCourses.find(c => c.id === courseId);
                                if (course) {
                                    this.courseData = course;
                                    let rawBabs = (course.babs && course.babs.length > 0) ? course.babs : 
                                                  ((course.content && course.content.length > 0) ? course.content : (course.modules || []));
                                    if (rawBabs.length > 0 && rawBabs[0].subBabs === undefined) {
                                        this.babs = [{ id: 'b1', title: 'Bab 1 (Semua Modul)', expanded: true, subBabs: rawBabs }];
                                    } else {
                                        this.babs = rawBabs;
                                    }
                                    return; // Successfully loaded from local courses
                                }
                            }
                        } catch(e) {}
                    }

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
                                if (data.success && data.lmsData) {
                                    if (data.lmsData.progressMap) {
                                        const courseProgress = data.lmsData.progressMap[this.courseData.id];
                                        if (courseProgress && courseProgress.completedModules) {
                                            this.completedNodes = courseProgress.completedModules;
                                        }
                                    }
                                    if (data.lmsData.quizResults) {
                                        this.pastScores = {};
                                        data.lmsData.quizResults.forEach(qr => {
                                            if (qr.courseId === this.courseData.id) {
                                                if (!this.pastScores[qr.moduleIndex]) {
                                                    this.pastScores[qr.moduleIndex] = [];
                                                }
                                                this.pastScores[qr.moduleIndex].push(qr);
                                            }
                                        });
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

                openNode(node, skipPush = false) {
                    if (this.ytPlayer) {
                        this.ytPlayer.destroy();
                        this.ytPlayer = null;
                    }
                    if (this.ytPollInterval) clearInterval(this.ytPollInterval);
                    
                    this.activeNode = node;
                    this.sidebarOpen = false;

                    if (!skipPush && node) {
                        const url = new URL(window.location);
                        url.searchParams.set('node', node.id);
                        window.history.pushState({ nodeId: node.id }, '', url);
                    }

                    if (node && node.type === 'kuis' && this.pastScores[node.id] && this.pastScores[node.id].length > 0) {
                        this.quizState.submitted = true;
                        this.quizState.score = this.pastScores[node.id][0].score;
                        this.quizState.total = '?'; // mark as loaded from history
                        this.quizState.hasEssay = node.questions && node.questions.some(q => q.type === 'essai');
                        this.quizState.inProgress = false;
                        
                        this.quizState.assignedPaket = this.pastScores[node.id][0].paket || 1;
                        this.quizState.activeQuestions = node.questions ? node.questions.filter(q => (q.paket || 1) === this.quizState.assignedPaket) : [];
                    } else {
                        this.quizState.submitted = false;
                        this.quizState.inProgress = false;
                        if (this.quizState.timerInterval) clearInterval(this.quizState.timerInterval);
                        if (this.quizState.autosaveInterval) clearInterval(this.quizState.autosaveInterval);
                    }
                    this.quizAnswers = {};
                    
                    // Allow Alpine to update DOM, then init player if video
                    this.$nextTick(() => {
                        if (this.activeNode.type === 'video') {
                            this.initYoutubePlayer();
                        }
                        if (window.MathJax) {
                            MathJax.typesetPromise().catch(err => console.log('MathJax error:', err));
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

                
                async startQuiz() {
                    this.quizState.inProgress = true;
                    this.quizState.currentQIdx = 0;
                    this.quizState.doubtful = [];
                    this.quizAnswers = {};
                    this.quizState.submitted = false;
                    this.quizState.elapsedSeconds = 0;
                    
                    const packages = this.activeNode.quizPackageCount || 1;
                    let storedPaket = localStorage.getItem('nls_paket_' + this.courseData.id + '_' + this.activeNode.id);
                    if (!storedPaket || parseInt(storedPaket) > packages) {
                        storedPaket = Math.floor(Math.random() * packages) + 1;
                        localStorage.setItem('nls_paket_' + this.courseData.id + '_' + this.activeNode.id, storedPaket);
                    }
                    this.quizState.assignedPaket = parseInt(storedPaket);
                    
                    this.quizState.activeQuestions = this.activeNode.questions ? this.activeNode.questions.filter(q => (q.paket || 1) === this.quizState.assignedPaket) : [];
                    
                    // Initialize shuffle indices for all applicable active questions
                    if (this.quizState.activeQuestions) {
                        this.quizState.activeQuestions.forEach(q => {
                            if ((q.type === 'pg' || q.type === 'pg_kompleks') && q.options) {
                                q._shuffledIndices = this.activeNode.quizShuffleOptions !== false 
                                    ? q.options.map((_, i) => i).sort(() => Math.random() - 0.5) 
                                    : q.options.map((_, i) => i);
                            }
                        });
                    }
                    
                    let durationStr = this.activeNode.quizDuration ? this.activeNode.quizDuration.toString() : (this.activeNode.duration || '15');
                    let mins = parseInt(durationStr.replace(/\D/g, ''));
                    if (isNaN(mins) || mins <= 0) mins = 15;
                    this.quizState.timeLeft = mins * 60;
                    
                    // Attempt to fetch saved progress
                    try {
                        const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                        if (sessionRaw && this.courseData) {
                            const session = JSON.parse(sessionRaw);
                            if (session.id) {
                                const res = await fetch('/api/pg-lms', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ action: 'get_quiz_progress', userId: session.id, courseId: this.courseData.id, moduleId: this.activeNode.id })
                                });
                                const data = await res.json();
                                if (data.success && data.attempt && data.attempt.status === 'in_progress') {
                                    let method = this.activeNode.quizTimeMethod || 'pause';
                                    
                                    if (method !== 'reset') {
                                        // Load answers for pause and realtime
                                        if (data.attempt.answers_json) {
                                            this.quizAnswers = typeof data.attempt.answers_json === 'string' ? JSON.parse(data.attempt.answers_json) : data.attempt.answers_json;
                                        }
                                        
                                        if (method === 'realtime') {
                                            const startedAt = new Date(data.attempt.started_at).getTime();
                                            const serverNow = new Date(data.server_now).getTime();
                                            this.quizState.elapsedSeconds = Math.floor((serverNow - startedAt) / 1000);
                                        } else {
                                            // pause
                                            this.quizState.elapsedSeconds = data.attempt.elapsed_seconds || 0;
                                        }
                                        
                                        let remaining = this.quizState.timeLeft - this.quizState.elapsedSeconds;
                                        if (remaining < 0) remaining = 0;
                                        this.quizState.timeLeft = remaining;
                                        
                                        // Auto-submit immediately if realtime time is up
                                        if (this.quizState.timeLeft <= 0) {
                                            this.submitQuiz();
                                            return;
                                        }
                                    } else {
                                        // It's reset method, immediately force save to clear DB
                                        this.triggerAutosave(true);
                                    }
                                }
                            }
                        }
                    } catch(e) {}
                    
                    if (this.quizState.timerInterval) clearInterval(this.quizState.timerInterval);
                    this.quizState.timerInterval = setInterval(() => {
                        this.quizState.timeLeft--;
                        this.quizState.elapsedSeconds++;
                        if (this.quizState.timeLeft <= 0) {
                            clearInterval(this.quizState.timerInterval);
                            this.submitQuiz(); 
                        }
                    }, 1000);
                    
                    if (this.quizState.autosaveInterval) clearInterval(this.quizState.autosaveInterval);
                    this.quizState.autosaveInterval = setInterval(() => {
                        this.triggerAutosave();
                    }, 30000);
                    
                    this.$nextTick(() => { if (window.MathJax) MathJax.typesetPromise(); });
                },
                
                debounceAutosave() {
                    if (this.quizState.autosaveTimeout) clearTimeout(this.quizState.autosaveTimeout);
                    this.quizState.autosaveTimeout = setTimeout(() => {
                        this.triggerAutosave(false);
                    }, 3000);
                },
                
                async triggerAutosave(isReset = false) {
                    if (!this.quizState.inProgress || this.quizState.submitted) return;
                    try {
                        const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                        if (sessionRaw && this.courseData && this.activeNode) {
                            const session = JSON.parse(sessionRaw);
                            if (session.id) {
                                fetch('/api/pg-lms', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        action: 'save_quiz_progress',
                                        userId: session.id,
                                        courseId: this.courseData.id,
                                        moduleId: this.activeNode.id,
                                        elapsedSeconds: this.quizState.elapsedSeconds,
                                        answers: this.quizAnswers,
                                        isReset: isReset
                                    })
                                }).catch(e => {});
                            }
                        }
                    } catch(e) {}
                },
                
                setupBeacon() {
                    const sendBeaconData = () => {
                        if (!this.quizState.inProgress || this.quizState.submitted || !this.courseData || !this.activeNode) return;
                        
                        const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                        if (!sessionRaw) return;
                        const session = JSON.parse(sessionRaw);
                        if (!session.id) return;
                        
                        const url = '/api/pg-lms';
                        const payload = JSON.stringify({
                            action: 'save_quiz_progress',
                            userId: session.id,
                            courseId: this.courseData.id,
                            moduleId: this.activeNode.id,
                            elapsedSeconds: this.quizState.elapsedSeconds,
                            answers: this.quizAnswers
                        });
                        
                        navigator.sendBeacon(url, payload);
                    };
                    
                    window.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'hidden') sendBeaconData();
                    });
                    
                    window.addEventListener('beforeunload', () => sendBeaconData());
                },
                
                formatTime(seconds) {
                    if (seconds < 0) seconds = 0;
                    let h = Math.floor(seconds / 3600);
                    let m = Math.floor((seconds % 3600) / 60);
                    let s = seconds % 60;
                    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                },
                
                toggleDoubtful() {
                    const q = this.quizState.activeQuestions[this.quizState.currentQIdx];
                    if (!q) return;
                    if (this.quizState.doubtful.includes(q.id)) {
                        this.quizState.doubtful = this.quizState.doubtful.filter(id => id !== q.id);
                    } else {
                        this.quizState.doubtful.push(q.id);
                    }
                },
                
                getNavStatus(qId) {
                    if (this.quizState.doubtful.includes(qId)) return 'ragu';
                    const ans = this.quizAnswers[qId];
                    let answered = false;
                    if (ans !== undefined && ans !== null && ans !== '') {
                        if (Array.isArray(ans) && ans.length > 0) answered = true;
                        else if (typeof ans === 'object' && Object.keys(ans).length > 0) answered = true;
                        else if (typeof ans === 'string' && ans.trim() !== '') answered = true;
                        else if (typeof ans === 'number') answered = true;
                    }
                    return answered ? 'terjawab' : 'belum';
                },
                
                goToQuestion(idx) {
                    this.quizState.currentQIdx = idx;
                    this.$nextTick(() => { if (window.MathJax) MathJax.typesetPromise(); });
                },
                
                nextQuestion() {
                    if (this.quizState.currentQIdx < this.quizState.activeQuestions.length - 1) {
                        this.quizState.currentQIdx++;
                        this.$nextTick(() => { if (window.MathJax) MathJax.typesetPromise(); });
                    }
                },
                
                prevQuestion() {
                    if (this.quizState.currentQIdx > 0) {
                        this.quizState.currentQIdx--;
                        this.$nextTick(() => { if (window.MathJax) MathJax.typesetPromise(); });
                    }
                },
                
                async submitQuiz() {
                    if (this.quizState.timerInterval) clearInterval(this.quizState.timerInterval);
                    if (this.quizState.autosaveInterval) clearInterval(this.quizState.autosaveInterval);
                    if (this.quizState.autosaveTimeout) clearTimeout(this.quizState.autosaveTimeout);
                    this.quizState.inProgress = false;
                    if (!this.quizState.activeQuestions || this.quizState.activeQuestions.length === 0) return;
                    
                    let correct = 0;
                    let totalGradable = 0;
                    
                    this.quizState.activeQuestions.forEach(q => {
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
                    this.quizState.hasEssay = this.quizState.activeQuestions.some(q => q.type === 'essai');
                    
                    this.quizState.isSubmitting = true;
                    this.quizState.submitted = false;
                    
                    setTimeout(() => {
                        this.quizState.isSubmitting = false;
                        this.quizState.submitted = true;
                        this.markAsCompleted(this.activeNode.id);
                        
                        // Add to local history for immediate display
                        if (!this.pastScores[this.activeNode.id]) this.pastScores[this.activeNode.id] = [];
                        this.pastScores[this.activeNode.id].unshift({
                            score: this.quizState.score,
                            datetime: new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                            paket: this.quizState.assignedPaket
                        });

                        // Final submit to DB
                        try {
                            const sessionRaw = localStorage.getItem('nls_student_auth_session') || localStorage.getItem('nls_auth_session');
                            if (sessionRaw && this.courseData) {
                                const session = JSON.parse(sessionRaw);
                                if (session.id) {
                                    fetch('/api/pg-lms', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            action: 'submit_quiz',
                                            userId: session.id,
                                            courseId: this.courseData.id,
                                            moduleIndex: this.activeNode.id, // using ID in place of index for generic usage
                                            moduleId: this.activeNode.id,
                                            score: this.quizState.score,
                                            paket: this.quizState.assignedPaket,
                                            answers: this.quizAnswers
                                        })
                                    }).catch(e => {});
                                }
                            }
                        } catch(e) {}
                    }, 2000); // 2 second fake queue loading
                }
            }
        }
    