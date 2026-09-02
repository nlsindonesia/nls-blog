function fixMojibakeString(str) {
    return str.replace(/(?:ðŸ|âš|Ã°Å|Ã¢Å|â€¢|âœ|ðŸ\x8F|ðŸ‡)[^\s<>'\"`]+/g, (match) => {
        return Buffer.from(match, 'latin1').toString('utf8');
    });
}

const test = "Here is some text with ðŸ“š and ðŸ“‘ and âš¡ and normal 📚";
console.log("Original:", test);
console.log("Fixed:   ", fixMojibakeString(test));
