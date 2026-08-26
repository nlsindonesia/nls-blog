import re

with open(r'c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\build\assets\app-A86YIcNI.css', 'r', encoding='utf-8') as f:
    css = f.read()

icons = sorted(set(re.findall(r'icon-\[[^\]]+\]', css)))
for icon in icons:
    print(icon)
