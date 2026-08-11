[CmdletBinding()]
param(
  [string]$Action = 'master',
  [ValidateSet('include', 'exclude')]
  [string]$Companion = 'exclude',
  [switch]$List
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$identity = Join-Path $root 'assets\identity'
$master = Join-Path $identity 'muzi-crayon-master.png'
$fullBodyStyle = Join-Path $identity 'muzi-crayon-fullbody-style.png'
$libraryPath = Join-Path $root 'assets\action-library.json'
$library = Get-Content -LiteralPath $libraryPath -Raw -Encoding UTF8 | ConvertFrom-Json
$entries = @($library.categories.actions)
$companionEntry = $library.companion

if ($List) {
  $entries | Select-Object id, label, useWhen, file | ConvertTo-Json -Depth 3
  exit 0
}

$isLifestyleAlias = $Action -eq 'lifestyle-cat'
$freeAliases = @('free', 'master', 'lifestyle-cat')
$isFree = $freeAliases -contains $Action
$entry = if ($isFree) { $null } else { $entries | Where-Object id -eq $Action | Select-Object -First 1 }
if (-not $isFree -and -not $entry) {
  $available = @($entries.id) -join ', '
  throw "Unknown Muzi action '$Action'. Available actions: free, $available"
}
$effectiveCompanion = if ($isLifestyleAlias) { 'include' } else { $Companion }
$actionReference = if ($entry) { Join-Path (Join-Path $root 'assets') $entry.file } else { $null }
$companionReference = if ($effectiveCompanion -eq 'include') { Join-Path (Join-Path $root 'assets') $companionEntry.file } else { $null }

foreach ($required in @($master, $fullBodyStyle, $actionReference, $companionReference)) {
  if ($required -and -not (Test-Path -LiteralPath $required -PathType Leaf)) {
    throw "Missing approved Muzi reference: $required"
  }
}

[pscustomobject]@{
  schema = 'creator.muzi-crayon-reference-set/3'
  actionMode = if ($entry) { 'library' } else { 'free' }
  action = if ($entry) { $entry.id } else { $null }
  companionMode = $effectiveCompanion
  companion = if ($companionReference) { $companionEntry.id } else { $null }
  legacyAlias = if ($Action -eq 'master') { 'master' } elseif ($isLifestyleAlias) { 'lifestyle-cat' } else { $null }
  label = if ($entry) { $entry.label } else { '自由姿态' }
  useWhen = if ($entry) { $entry.useWhen } else { '只锁定身份与穿搭，由当次 shot spec 描述动作' }
  master = $master
  fullBodyStyle = $fullBodyStyle
  actionReference = $actionReference
  companionReference = $companionReference
  rule = 'Always use the Muzi identity and full-body style masters; add at most one action reference and add the cat master only when companion mode is include. References never override Muzi identity or composition.'
} | ConvertTo-Json -Depth 3
