const str = "This is a book 📚 and some mojibake ðŸ“š";
try {
    const fixed = Buffer.from(str, 'latin1').toString('utf8');
    console.log(fixed);
} catch (e) {
    console.log("Error:", e.message);
}
