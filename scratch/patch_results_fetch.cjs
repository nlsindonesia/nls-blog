const fs = require('fs');
let content = fs.readFileSync('nlsadmin/lms-results.html', 'utf8');

const fetchCoursesCode = `
                coursesData: {},
                async fetchCourses() {
                    try {
                        const res = await fetch('/api/pg-lms', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'admin_get_courses' })
                        });
                        const data = await res.json();
                        if (data.success && data.data) {
                            data.data.forEach(course => {
                                this.coursesData[course.id] = course;
                            });
                        }
                    } catch(e) { console.error(e); }
                },
`;
content = content.replace('results: [],', fetchCoursesCode + '                results: [],');
content = content.replace('this.fetchResults();', 'this.fetchCourses();\n                    this.fetchResults();');

fs.writeFileSync('nlsadmin/lms-results.html', content, 'utf8');
console.log('Added fetchCourses');
