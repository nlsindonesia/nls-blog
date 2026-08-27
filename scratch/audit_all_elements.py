import os
import re

root_dir = r"c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame"

html_files = []
for dirpath, dirnames, filenames in os.walk(root_dir):
    if '.git' in dirpath or 'brain' in dirpath or 'scratch' in dirpath:
        continue
    for f in filenames:
        if f.endswith('.html'):
            html_files.append(os.path.join(dirpath, f))

print(f"Auditing {len(html_files)} HTML files for white text / white logo on light background...")

issues = []

for file_path in html_files:
    rel_path = os.path.relpath(file_path, root_dir)
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    for idx, line in enumerate(lines):
        line_num = idx + 1
        line_clean = line.strip()
        
        # 1. Direct text-white with light background classes on same line
        if 'text-white' in line_clean and 'dark:text-white' not in line_clean:
            # check if line has light bg without dark: or solid color
            has_light_bg = any(k in line_clean for k in ['bg-white', 'bg-slate-50', 'bg-slate-100', 'bg-gray-50', 'bg-surface-bright', 'bg-surface-container-lowest'])
            has_solid_bg = any(k in line_clean for k in ['bg-sky-', 'bg-blue-', 'bg-primary', 'bg-indigo-', 'bg-emerald-', 'bg-rose-', 'bg-amber-', 'bg-slate-800', 'bg-slate-900', 'bg-black', 'bg-[#FF8A00]', 'bg-[#0284c7]', 'bg-[#131D38]', 'from-', 'bg-gradient', 'bg-secondary'])
            
            if has_light_bg and not has_solid_bg:
                issues.append((rel_path, line_num, "TEXT_WHITE_ON_LIGHT", line_clean))
                
        # 2. White logo/icon on light background
        if ('logo' in line_clean.lower() or 'icon' in line_clean.lower()) and ('text-white' in line_clean or 'stroke-white' in line_clean or 'fill-white' in line_clean):
            if 'bg-white' in line_clean and 'dark:' not in line_clean:
                issues.append((rel_path, line_num, "WHITE_ICON_ON_WHITE", line_clean))

print(f"Total potential issues found: {len(issues)}")
for path, line_no, issue_type, snippet in issues:
    print(f"[{path}:{line_no}] {issue_type}: {snippet[:130]}")
