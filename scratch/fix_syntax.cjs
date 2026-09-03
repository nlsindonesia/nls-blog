const fs = require('fs');
let content = fs.readFileSync('belajar/lms-player.html', 'utf8');

const regex = /                    \}\);\r?\n                \},\r?\n\r?\n                async submitCoursePassword\(\) \{[\s\S]*?this\.isUnlocking = false;\r?\n                \},\r?\n\r?\n                \/\/ Load YT Iframe API\r?\n                    if \(!window\.YT\) \{[\s\S]*?this\.setupBeacon\(\);\r?\n                \},/;

if (regex.test(content)) {
    const match = content.match(regex)[0];
    
    // Extract the submitCoursePassword block
    const submitBlockMatch = match.match(/                async submitCoursePassword\(\) \{[\s\S]*?this\.isUnlocking = false;\r?\n                \},/);
    const submitBlock = submitBlockMatch[0];
    
    // Extract the init ending block
    const initEndBlock = match.match(/                \/\/ Load YT Iframe API\r?\n                    if \(!window\.YT\) \{[\s\S]*?this\.setupBeacon\(\);\r?\n                \},/)[0];
    
    // Construct the new string
    const newString = `                    });

${initEndBlock}

${submitBlock}`;
    
    content = content.replace(regex, newString);
    fs.writeFileSync('belajar/lms-player.html', content, 'utf8');
    console.log('Successfully fixed syntax in lms-player.html');
} else {
    console.log('Regex did not match!');
}
