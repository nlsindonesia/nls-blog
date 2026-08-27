$res = Invoke-WebRequest -Uri "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js" -Method Head
Write-Host "CKEditor 4 Full-All status code:" $res.StatusCode
