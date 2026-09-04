export interface OcrResult {
  rawText: string
  confidence: number // 0–1
}

/**
 * MOCK implementation for local development without an OCR dependency
 * installed yet. Swap this for tesseract.js or a cloud OCR SDK call —
 * see ./README.md. The route layer (documents.routes.ts) only depends on
 * this function's signature, not on how it's implemented.
 */
export async function runOcr(_buffer: Buffer, _mimeType: string): Promise<OcrResult> {
  return {
    rawText: '[mock OCR output — replace runOcr() in src/ocr/ocrProvider.ts with a real provider]',
    confidence: 0.5,
  }
}
