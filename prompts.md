# Bill Book: prompts used, in order

Project 7 · Bharat Space Education Research Centre · GenAI Internship, Week 2

## 1. Plan
> Ask me a few questions about this task (Bill Book: shop profile + items, bills with quantity/discount/tax, UPI QR for the exact total, share a bill as an image, bill history and daily total, works offline, installs on a phone) before we build it.

Answers: build a PWA (installable web app, works offline); I am a beginner and will rely on the agent; extras wanted: GST options, discount per item and per bill, export/backup; share the bill as an image.

## 2. Change of decision
> For sharing, I am not sure how. Guide me. → Chosen: **bill as an image plus a short text caption** (e.g. "Bill #104 from Sharma Stores. Total: ₹285. Thank you!").

## 3. Build
> Let's build it. Offline-first PWA called "Bill Book" for a small Indian shop. Plain HTML/CSS/JS, mobile-first, large buttons, no CDN links. (1) shop profile (name, UPI ID, GSTIN) and an item list with prices; (2) bills with quantity, per-item and per-bill discount, GST rate, money stored in paise; (3) UPI QR for the exact total using upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...; (4) Share on WhatsApp: draw the bill + QR to a PNG and share with the Web Share API plus caption; fallback to download; (5) bill history and daily total; (6) export/backup. Add a service worker and manifest so it works in flight mode and installs.

## 4. Make it work offline and install on a phone
> Build it according to the project statement: it must run offline and install on a real phone. Bundle the QR code generator inside the project (no internet needed), add manifest.json, sw.js and icons, and package the files for hosting.

## 5. History improvement
> In the bill history, show day by day: subtotals, and the items sold with their prices.

## 6. Items inside each bill
> Show each bill's items with quantity and price in the history, with the bill's subtotal.

## 7. Simplify
> In the day section show only the day total and how many bills. When I export the history, do not export the items sold, only the billing price.

## Test notes
- Totals checked against 5 hand-calculated bills (see README.md).
- Tested QR with a UPI app by scanning only, no payment.
- Tested in airplane mode after installing.
