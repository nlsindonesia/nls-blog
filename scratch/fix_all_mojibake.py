import os

ROOT_DIR = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"
EXTS = ('.html', '.js', '.css', '.md')

MOJIBAKE_MAP = {
    'â€¢': '•',
    'âœ“': '✓',
    'âœ”': '✔',
    'â€“': '–',
    'â€”': '—',
    'â€˜': "'",
    'â€™': "'",
    'â€œ': '"',
    'â€\x9d': '"',
    'â€': '"',
    'â€¦': '...',
    'Ã—': '×',
    'â–¼': '▼',
    'â–²': '▲',
    'â†’': '→',
    'â†\x90': '←',
}

fixed_count = 0

for root, dirs, files in os.walk(ROOT_DIR):
    if '.git' in root or 'node_modules' in root:
        continue
    for fname in files:
        if fname.endswith(EXTS):
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                continue

            orig = content
            for bad, good in MOJIBAKE_MAP.items():
                if bad in content:
                    content = content.replace(bad, good)

            if content != orig:
                with open(fpath, 'w', encoding='utf-8') as f:
                    f.write(content)
                rel = os.path.relpath(fpath, ROOT_DIR)
                print(f"Fixed: {rel}")
                fixed_count += 1

print(f"\nFinished. Total cleaned files: {fixed_count}")
