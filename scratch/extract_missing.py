import subprocess

output = subprocess.check_output(['git', 'show', '7c65782~1:privat/index.html'], encoding='utf-8')

# Find the part from "<!-- Testimoni Siswa -->" up to "<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->"
start_marker = "<!-- Testimoni Siswa -->"
end_marker = "<!-- ===== POP-UP MODAL FORM KEBUTUHAN PRIVAT SESUAI PAKET ===== -->"

start_idx = output.find(start_marker)
end_idx = output.find(end_marker)

print(f"start_idx: {start_idx}, end_idx: {end_idx}")

if start_idx != -1 and end_idx != -1:
    missing_chunk = output[start_idx:end_idx]
    with open("scratch/missing_chunk.html", "w", encoding="utf-8") as f:
        f.write(missing_chunk)
    print("Extracted missing chunk! Length:", len(missing_chunk))
else:
    print("Markers not found!")
