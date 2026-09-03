const fs = require('fs');
let content = fs.readFileSync('api/pg-lms.js', 'utf8');

const anchor = "if (action === 'admin_get_quiz_results') {";
const newAction = `
        // --- ADMIN: UPDATE QUIZ RESULT (GRADING) ---
        if (action === 'admin_update_quiz_result') {
            const { resultId, newScore, updatedAnswers } = request.body;
            if (!resultId || newScore === undefined) return response.status(400).json({ success: false, message: 'Missing parameters.' });
            
            try {
                await sql\`
                    UPDATE lms_quiz_results 
                    SET score = \${newScore}, answers_json = \${JSON.stringify(updatedAnswers || {})}
                    WHERE id = \${resultId}
                \`;
                return response.status(200).json({ success: true, message: 'Result updated successfully.' });
            } catch (err) {
                console.error(err);
                return response.status(500).json({ success: false, message: 'Database error.', error: err.message });
            }
        }
        
        `;

content = content.replace(anchor, newAction + anchor);
fs.writeFileSync('api/pg-lms.js', content, 'utf8');
console.log('Added admin_update_quiz_result');
