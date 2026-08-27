$adminPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\nlsadmin\index.html"
$content = [System.IO.File]::ReadAllText($adminPath, [System.Text.Encoding]::UTF8)

# Check for presence of all new methods
$checks = @(
    "openTeacherVerificationView",
    "teacherApplications",
    "acceptTeacherApplication",
    "rejectTeacherApplication",
    "deleteTeacherApplication",
    "contactApplicantWA",
    "addSampleApplicant",
    "pengajarView === 'verification'"
)

foreach ($c in $checks) {
    if ($content.Contains($c)) {
        Write-Host "[OK] Found $c in nlsadmin/index.html"
    } else {
        Write-Host "[MISSING] $c NOT found!"
    }
}
