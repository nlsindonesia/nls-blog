const fs = require('fs');
let content = fs.readFileSync('nlsadmin/index.html', 'utf8');

// The file has literal mojibake like ðŸ“š which is UTF-8 interpreted as cp1252/latin1.
// We need to find all occurrences of mojibake and fix them.
// Instead of trying to parse the entire file (which might break other valid chars),
// let's manually map the bad emojis that appear in the file.

const map = {
    "ðŸ“š": "📚",
    "ðŸ“–": "📖",
    "ðŸ“¥": "📥",
    "âœ¡": "✡",
    "ðŸ”„": "🔄",
    "âœ…": "✅",
    "âš™ï¸\x8f": "⚙️",
    "ðŸ“…": "📅",
    "ðŸ“°": "📰",
    "ðŸ‘¨‍🏫": "👨‍🏫",
    "ðŸ‘©‍🏫": "👩‍🏫",
    "ðŸ›¡ï¸\x8f": "🛡️", // Some might be complex
    "Ã°Å¸â€œÂ¡": "📚", // In case it's double mojibake!
    "Ã°Å¸â€œâ€“": "📖",
    "Ã°Å¸â€œÂ¥": "📥",
    "Ã¢Å“Â¡": "✡",
    "A,?o": "📚"
};

// Wait, the user screenshot literally shows: 
// Ã°Å¸â€œÂ¡
// Ã°Å¸â€œâ€“
// Ã°Å¸â€œÂ¥
// Ã¢Å“Â¡
// Let's just fix it globally by using Buffer latin1 encoding trick on the entire file!
// BUT if we do that, we might break actual UTF-8 that IS valid.
// So let's use replace.

const repairs = [
    [/Ã°Å¸â€œÂ¡/g, "📚"],
    [/Ã°Å¸â€œâ€“/g, "📖"],
    [/Ã°Å¸â€œÂ¥/g, "📥"],
    [/Ã¢Å“Â¡/g, "✡"],
    [/ðŸ“š/g, "📚"],
    [/ðŸ“–/g, "📖"],
    [/ðŸ“¥/g, "📥"],
    [/âœ¡/g, "✡"],
    [/ðŸ”„/g, "🔄"],
    [/A,\?o/g, "📚"] // This one appeared in my console earlier
];

let changed = false;
for (const [bad, good] of repairs) {
    if (bad.test(content)) {
        content = content.replace(bad, good);
        changed = true;
    }
}

if (changed) {
    fs.writeFileSync('nlsadmin/index.html', content, 'utf8');
    console.log("Fixed emojis in index.html");
} else {
    console.log("No bad emojis found in index.html with manual replace.");
}

