const fs = require('fs');

function testDecode(file) {
    let str = fs.readFileSync(file, 'utf8');
    try {
        let fixed = Buffer.from(str, 'latin1').toString('utf8');
        
        // Let's see if the fixed version still has mojibake
        const matches = fixed.match(/(?:ðŸ|âš|Ã°Å|Ã¢Å)[^\s<>'\"`]+|â€¢|âœ[^\s<>'\"`]+/g);
        console.log(file, 'remaining mojibake:', matches ? matches.length : 0);
        
        // Also let's check a known string to make sure we didn't corrupt normal text
        if (fixed.includes("Tempat Sampah")) {
            console.log(file, 'ASCII text preserved!');
        }
        
    } catch(e) {
        console.log(file, 'failed', e.message);
    }
}

testDecode('nlsadmin/lms-builder.html');
testDecode('nlsadmin/index.html');
