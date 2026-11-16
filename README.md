# Bill Book

A billing app for a small shop. It makes a bill, shows a UPI QR code for the exact total, and shares the bill as an image on WhatsApp. It works offline and installs on a phone.

## Files
| File | What it does |
|---|---|
| index.html | The whole app (screens, billing, history, sharing) |
| qr.js | Built-in QR code generator (no internet needed) |
| sw.js | Service worker: saves the app so it works in flight mode |
| manifest.json | Lets the phone install it as an app |
| icon-192.png, icon-512.png | App icons |
| prompts.md | The prompts used to build it, in order |

## Install on a phone
1. Upload all the files to a free HTTPS host (Netlify Drop or GitHub Pages).
2. Open the link in Chrome on the phone while online and wait for it to load.
3. Chrome menu (⋮) → Install app / Add to Home Screen.
4. Turn on airplane mode and open the app from the home screen.

## How to use
1. **Shop** tab: shop name, your UPI ID, optional GSTIN → Save profile.
2. **Items** tab: add items and prices.
3. **New bill** tab: tap items, set quantity, discounts and GST → Save bill.
4. The bill opens with its UPI QR. Tap **Share on WhatsApp**.
5. **History** tab: each day shows the bill count and day total, and each bill lists its items.

## How the money works
All amounts are whole paise (₹1 = 100) so there are no rounding drifts.
Line = price × quantity × (100 − item discount %) / 100
Subtotal = sum of lines · Bill discount = subtotal × discount % · GST = (subtotal − discount) × GST %
Total = subtotal − discount + GST

## Five bills to check by hand
| # | Items | Discount | GST | Expected total |
|---|---|---|---|---|
| 1 | Rice ₹120 ×1, Oil ₹165 ×1 | none | none | ₹285 |
| 2 | Rice ₹120 ×3 | 10% on bill | none | ₹324 |
| 3 | Oil ₹165 ×2 | none | 5% | ₹346.50 |
| 4 | Rice ₹120 ×2 | 10% on item | 12% | ₹241.92 |
| 5 | Rice ₹120 ×1, Oil ₹165 ×1 | 5% on bill | 18% | ₹319.49 |

## Done-when checklist
- [ ] Totals match hand calculation on 5 bills
- [ ] Works in flight mode, old bills stay saved
- [ ] A UPI app scans the QR and shows the right amount (do not pay)
- [ ] Installed on a real phone

Data stays on the phone (browser storage). Use the Export buttons in History for a summary of billing totals.
