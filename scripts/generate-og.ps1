# Generates the 1200x630 social preview image (public/og.png) for link unfurls.
# Uses Windows GDI+ (System.Drawing) so it needs no fonts download or npm deps.
# Run from the repo root:  pwsh -File scripts/generate-og.ps1
Add-Type -AssemblyName System.Drawing

$W = 1200
$H = 630
$out = Join-Path $PSScriptRoot '..\public\og.png'

$ink   = [System.Drawing.ColorTranslator]::FromHtml('#0a0a0a')
$paper = [System.Drawing.ColorTranslator]::FromHtml('#f5f5f0')
$cyan  = [System.Drawing.ColorTranslator]::FromHtml('#22d3ee')
$grid  = [System.Drawing.ColorTranslator]::FromHtml('#161616')
$muted = [System.Drawing.ColorTranslator]::FromHtml('#8a8a8a')

$bmp = New-Object System.Drawing.Bitmap $W, $H
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background + faint grid (echoes the site's paper-grid backdrop).
$g.Clear($ink)
$gridPen = New-Object System.Drawing.Pen $grid, 1
for ($x = 0; $x -lt $W; $x += 60) { $g.DrawLine($gridPen, $x, 0, $x, $H) }
for ($y = 0; $y -lt $H; $y += 60) { $g.DrawLine($gridPen, 0, $y, $W, $y) }

# Cyan trim border.
$borderPen = New-Object System.Drawing.Pen $cyan, 3
$g.DrawRectangle($borderPen, 28, 28, ($W - 56), ($H - 56))

$typo = [System.Drawing.StringFormat]::GenericTypographic
$nameFamily = New-Object System.Drawing.FontFamily 'Arial Black'

# Display name: SACHIN filled, SHARMA stroked (mirrors the hero).
$p1 = New-Object System.Drawing.Drawing2D.GraphicsPath
$p1.AddString('SACHIN', $nameFamily, 0, 168, (New-Object System.Drawing.PointF 60, 150), $typo)
$g.FillPath((New-Object System.Drawing.SolidBrush $paper), $p1)

$p2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$p2.AddString('SHARMA', $nameFamily, 0, 168, (New-Object System.Drawing.PointF 60, 320), $typo)
$g.DrawPath((New-Object System.Drawing.Pen $cyan, 2.5), $p2)

# Top mono label (left) + URL (right).
$labelFont = New-Object System.Drawing.Font 'Consolas', 19, ([System.Drawing.FontStyle]::Bold)
$g.DrawString('// PORTFOLIO', $labelFont, (New-Object System.Drawing.SolidBrush $cyan), 64, 72)
$urlText = 'sachin-sharma32.github.io/portfolio'
$urlSize = $g.MeasureString($urlText, $labelFont)
$g.DrawString($urlText, $labelFont, (New-Object System.Drawing.SolidBrush $muted), ($W - 64 - $urlSize.Width), 72)

# Role + stack (bottom-left). ASCII separators only — PS 5.1 mangles non-ASCII.
$roleFont = New-Object System.Drawing.Font 'Consolas', 26, ([System.Drawing.FontStyle]::Bold)
$g.DrawString('FULL-STACK DEVELOPER', $roleFont, (New-Object System.Drawing.SolidBrush $paper), 64, 518)
$stackFont = New-Object System.Drawing.Font 'Consolas', 20, ([System.Drawing.FontStyle]::Regular)
$g.DrawString('React / TypeScript / Node.js / MongoDB / AWS', $stackFont, (New-Object System.Drawing.SolidBrush $muted), 66, 556)

$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bmp.Dispose()
Write-Output "Wrote $out ($W x $H)"
