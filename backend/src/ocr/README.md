# Document Scanner / OCR — architecture

This mirrors the "Document Quality & Information Check" feature in the brief
(section 6). It never claims legal authenticity — only that expected fields
were detected and the scan is legible.

## Flow

```
Upload (PDF/JPG/PNG)
  -> Validate file type & size (src/middleware upload guard)
  -> Store original in object storage (never public) — path only in DB
  -> OCR extraction (src/ocr/ocrProvider.ts)
  -> Document-type classification (keyword/heuristic first pass; can be
     swapped for an LLM classification call)
  -> Field-presence check against a per-document-type expected-field schema
     (src/ocr/fieldSchemas.ts)
  -> Return { detectedType, fieldChecks[], overallQuality }
```

## Swapping in a real OCR provider

`src/ocr/ocrProvider.ts` exports a single `runOcr(buffer, mimeType)` function.
Two ready options:

- **Local**: Tesseract.js (`npm install tesseract.js`) — no external API, good
  for a first working version.
- **Cloud**: Google Cloud Vision / AWS Textract — better accuracy on messy
  scans, but requires API keys (`OCR_API_KEY` in `.env`) and network egress.

Only `ocrProvider.ts` needs to change; the route and field-schema logic stay
the same either way.
