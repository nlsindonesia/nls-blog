Start-Sleep -Seconds 4
$adminUrl = "https://nls-blog-plum.vercel.app/nlsadmin"
$pengajarUrl = "https://nls-blog-plum.vercel.app/pengajar"

$adminRes = Invoke-RestMethod -Uri $adminUrl -Method Get -Headers @{ "Cache-Control" = "no-cache" }
$pengajarRes = Invoke-RestMethod -Uri $pengajarUrl -Method Get -Headers @{ "Cache-Control" = "no-cache" }

Write-Host "=== VERIFYING LIVE TEACHER VERIFICATION DEPLOYMENT ==="
Write-Host "Admin contains Teacher Verification Submenu:" ($adminRes.Contains("Teacher Verification"))
Write-Host "Admin contains acceptTeacherApplication method:" ($adminRes.Contains("acceptTeacherApplication"))
Write-Host "Admin contains pengajarView === 'verification':" ($adminRes.Contains("pengajarView === 'verification'"))
Write-Host "Pengajar page contains recruitment modal trigger:" ($pengajarRes.Contains("gabungPengajar.modalOpen"))
