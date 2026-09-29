Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('d:\Server\site\templates\tibiacom\images\custom\setas.gif')
Write-Host "Width: $($img.Width)"
Write-Host "Height: $($img.Height)"
