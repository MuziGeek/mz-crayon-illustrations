[CmdletBinding()]
param(
  [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$assets = Join-Path $root 'assets'
$manifest = Get-Content -LiteralPath (Join-Path $assets 'action-library.json') -Raw -Encoding UTF8 | ConvertFrom-Json
if (-not $OutputPath) { $OutputPath = Join-Path $assets 'identity\muzi-crayon-action-index.png' }

$columns = 4
$cellWidth = 320
$imageSize = 286
$rowHeight = 380
$topPadding = 54
$canvas = New-Object System.Drawing.Bitmap ($columns * $cellWidth), ($manifest.categories.Count * $rowHeight)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$graphics.Clear([System.Drawing.Color]::FromArgb(250, 247, 238))
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

$navy = [System.Drawing.Color]::FromArgb(10, 46, 82)
$mustard = [System.Drawing.Color]::FromArgb(224, 163, 31)
$fontFamily = New-Object System.Drawing.FontFamily 'Microsoft YaHei'
$categoryFont = New-Object System.Drawing.Font $fontFamily, 17, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
$labelFont = New-Object System.Drawing.Font $fontFamily, 19, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
$navyBrush = New-Object System.Drawing.SolidBrush $navy
$mustardBrush = New-Object System.Drawing.SolidBrush $mustard

try {
  for ($row = 0; $row -lt $manifest.categories.Count; $row += 1) {
    $category = $manifest.categories[$row]
    $rowY = $row * $rowHeight
    $graphics.FillRectangle($mustardBrush, 0, $rowY, 8, $rowHeight - 8)
    $graphics.DrawString($category.label, $categoryFont, $navyBrush, 18, $rowY + 15)
    for ($column = 0; $column -lt $category.actions.Count; $column += 1) {
      $action = $category.actions[$column]
      $sourcePath = Join-Path $assets $action.file
      $source = [System.Drawing.Image]::FromFile($sourcePath)
      try {
        $x = ($column * $cellWidth) + [int](($cellWidth - $imageSize) / 2)
        $y = $rowY + $topPadding
        $graphics.DrawImage($source, $x, $y, $imageSize, $imageSize)
        $label = "$($action.label)  $($action.id)"
        $graphics.DrawString($label, $labelFont, $navyBrush, $x + 4, $y + $imageSize + 7)
      } finally {
        $source.Dispose()
      }
    }
  }
  $canvas.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
  $navyBrush.Dispose()
  $mustardBrush.Dispose()
  $categoryFont.Dispose()
  $labelFont.Dispose()
  $fontFamily.Dispose()
  $graphics.Dispose()
  $canvas.Dispose()
}

Get-Item -LiteralPath $OutputPath | Select-Object FullName, Length
