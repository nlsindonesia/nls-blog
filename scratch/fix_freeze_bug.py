import re

file_path = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix double single-quotes in Alpine directives
content = content.replace("activeTab === ''kalender''", "activeTab === 'kalender'")
content = content.replace("activeTab === ''berita''", "activeTab === 'berita'")
content = content.replace("activeTab === ''pengajar''", "activeTab === 'pengajar'")
content = content.replace("kalenderView === ''create''", "kalenderView === 'create'")
content = content.replace("kalenderView === ''present''", "kalenderView === 'present'")

# Fix encoding glitch characters
content = content.replace("â€¢", "•")
content = content.replace("âœ“", "✓")

# Replace inline highlights split in x-for with getPreviewHighlights()
old_hl_for = '<template x-for="(hl, hlIdx) in (eventForm.highlightsRaw ? eventForm.highlightsRaw.split(\'\\n\').filter(Boolean) : [\'Sistem Penilaian IRT\', \'Webinar Live Pembahasan\'])" :key="hlIdx">'
new_hl_for = '<template x-for="(hl, hlIdx) in getPreviewHighlights()" :key="hlIdx">'
content = content.replace(old_hl_for, new_hl_for)

# Also check for single-escaped version
old_hl_for_2 = '<template x-for="(hl, hlIdx) in (eventForm.highlightsRaw ? eventForm.highlightsRaw.split(\'\n\').filter(Boolean) : [\'Sistem Penilaian IRT\', \'Webinar Live Pembahasan\'])" :key="hlIdx">'
content = content.replace(old_hl_for_2, new_hl_for)

# Ensure getPreviewHighlights() is added to superAdminApp methods
if "getPreviewHighlights()" not in content:
    content = content.replace(
        "// KALENDER METHODS",
        "// KALENDER METHODS\n                getPreviewHighlights() {\n                    if (!this.eventForm || !this.eventForm.highlightsRaw) {\n                        return ['Sistem Penilaian IRT Standar Nasional', 'Webinar Live Pembahasan Soal & Bedah Trik'];\n                    }\n                    return this.eventForm.highlightsRaw.split('\\n').map(s => s.trim()).filter(Boolean);\n                },"
    )

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS: Fixed Alpine syntax errors, double quotes, and highlights reactivity loop!")
