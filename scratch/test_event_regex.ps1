$evtPath = "c:\Users\vc\Documents\nls-blog-hame\nls-blog-hame\kalender\default-events.js"
$content = [System.IO.File]::ReadAllText($evtPath, [System.Text.Encoding]::UTF8)

# Match each object { id: '...', ... }
# Or parse using regex for each field
$eventBlocks = [regex]::Matches($content, '(?s)\{\s*id:\s*[\x27"](?<id>[^\x27"]+)[\x27"]\s*,\s*date:\s*[\x27"](?<date>[^\x27"]+)[\x27"]\s*,\s*(endDate:\s*[\x27"](?<endDate>[^\x27"]*)[\x27"]\s*,\s*)?title:\s*[\x27"](?<title>[^\x27"]+)[\x27"]\s*,\s*category:\s*[\x27"](?<category>[^\x27"]+)[\x27"]\s*,\s*jenjang:\s*[\x27"](?<jenjang>[^\x27"]+)[\x27"]\s*,\s*jenjangLabel:\s*[\x27"](?<jenjangLabel>[^\x27"]+)[\x27"]\s*,\s*time:\s*[\x27"](?<time>[^\x27"]+)[\x27"]\s*,\s*mode:\s*[\x27"](?<mode>[^\x27"]+)[\x27"]\s*,\s*location:\s*[\x27"](?<location>[^\x27"]+)[\x27"]\s*,\s*badgeText:\s*[\x27"](?<badgeText>[^\x27"]+)[\x27"]\s*,\s*description:\s*[\x27"](?<description>[^\x27"]+)[\x27"]\s*,\s*highlights:\s*\[(?<highlights>.*?)\]\s*,\s*whatsappMessage:\s*[\x27"](?<whatsappMessage>[^\x27"]+)[\x27"]')

Write-Host "Matched events count:" $eventBlocks.Count
