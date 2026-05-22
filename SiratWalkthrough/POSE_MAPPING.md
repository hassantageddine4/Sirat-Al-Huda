# Pose Asset Mapping — Corrected

This document records the **verified** mapping between the photos you provided
and the pose asset names used in the SwiftUI code. The asset name is what the
code looks up via `UIImage(named:)`, so the file you add to
`Assets.xcassets` should be **renamed** (or aliased) to the asset name.

## ⚠️ Correction notice

A previous version of the SwiftUI mapping had two errors:

- **Ruku** was incorrectly mapped to `F7C97F59...` (which is actually a wudu
  pose — wiping the head). The correct Ruku photo is `F52B6A33...` (bowing
  forward, hands on knees, back parallel).
- **Tashahhud** was incorrectly mapped to `F52B6A33...` (which is Ruku, see
  above). The correct Tashahhud photo is `005DEB16...` (kneeling, hands on
  thighs, head lowered).

Both have been corrected in the table below.

## Corrected mapping

| Asset name (in `Assets.xcassets`) | Source file (rename to asset name) | What the photo shows |
|---|---|---|
| `pose_qiyam_sunni` | `E3866B6F-52F9-4289-8536-F1F177AF1E86.png` | Standing, hands folded at waist |
| `pose_qiyam_shia` | `88DAB0B3-85CB-4889-A776-7F0C4ACA1769.png` | Standing, arms at sides |
| `pose_takbir_sunni` | `F95582EC-7D9E-4167-BA32-3F982FB01018.png` | Both hands raised to shoulders, palms forward |
| `pose_takbir_shia` | `F95582EC-7D9E-4167-BA32-3F982FB01018.png` | (same — Takbir is identical) |
| `pose_ruku_sunni` | `F52B6A33-9A52-45C1-9441-2B755F1BCB31.png` | **Bowing forward, hands on knees, back parallel** |
| `pose_ruku_shia` | `F52B6A33-9A52-45C1-9441-2B755F1BCB31.png` | (same — Ruku is identical) |
| `pose_sujood_sunni` | `BF64254D-D50A-4ADE-AC7D-1A9A01139E47.png` | Full prostration, forehead to ground |
| `pose_sujood_shia` | `BF64254D-D50A-4ADE-AC7D-1A9A01139E47.png` | (same — turbah is added in code as overlay if needed) |
| `pose_tashahhud_sunni` | `005DEB16-1AE4-42BA-B811-AFC7D661BADF.png` | **Kneeling, hands on thighs, head down** |
| `pose_tashahhud_shia` | `005DEB16-1AE4-42BA-B811-AFC7D661BADF.png` | (same — sitting style differs slightly but the photo reads as either) |
| `pose_salam_sunni` | `B05E1D87-70DB-455C-8B2C-F188A1B723A2.png` | Kneeling, head turned right (first salam) |
| `pose_salam_left` | `DD921ABC-BE8A-4B35-964E-0A972C69C36D.png` | Kneeling, head turned left (second salam) |
| `pose_qunut` | `7096E202-1246-4A11-B547-04E6B995C187.png` | Standing, hands raised palms-up at chest (used for Witr qunut, du'a) |

## Photos NOT used in the prayer poses

The remaining 8 photos in your upload set are **wudu (ablution) poses**, not
prayer poses. They'd be perfect for a separate "Wudu Guide" feature later:

| File | Wudu step |
|---|---|
| `22CD27CE...` | Madmadah (rinsing the mouth) |
| `D6A781B7...` | Istinshaq (sniffing water into the nose) |
| `7F6F83E2...` | Washing the face |
| `2720C9C9...` | Washing the hands |
| `7C572C70...` | Washing the right forearm |
| `97B67549...` | Washing the left forearm |
| `F7C97F59...` | Mas-h al-ra's (wiping the head) — **was incorrectly labeled "Ruku"** |
| `C2321541...` | Washing the feet |

## Why this matters

The previous walkthrough preview I rendered used the wrong photo for Ruku,
which would have shipped wudu instructions paired with a wudu image — bad UX
and worse, wrong religious instruction visually. Catching this matters.

If/when you build a Wudu Guide screen, those 8 photos cover the full sequence
in order: niyyah → hands → mouth → nose → face → forearms → head → feet.
That's a separate feature though, not part of the prayer walkthrough.
