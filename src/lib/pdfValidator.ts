import { PDFDocument } from 'pdf-lib';
import { PdfValidationResult } from '../types';

/**
 * Validates an uploaded PDF file for PVC printing readiness.
 * Checks password protection, file corruption, page count, and physical dimensions.
 */
export async function validatePdfFile(file: File): Promise<PdfValidationResult> {
  const result: PdfValidationResult = {
    isValid: true,
    isEncrypted: false,
    isCorrupted: false,
    pageCount: 0,
    widthMm: 0,
    heightMm: 0,
    resolutionDpi: 300,
    warnings: [],
    errors: [],
  };

  // 1. Check file extension & size limit (Max 50MB)
  if (!file.name.toLowerCase().endsWith('.pdf')) {
    result.isValid = false;
    result.errors.push('Only PDF files are supported. Please upload a valid .pdf document.');
    return result;
  }

  const maxSizeBytes = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSizeBytes) {
    result.isValid = false;
    result.errors.push(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 50MB maximum limit.`);
    return result;
  }

  if (file.size === 0) {
    result.isValid = false;
    result.isCorrupted = true;
    result.errors.push('The uploaded PDF file is empty (0 bytes).');
    return result;
  }

  try {
    const arrayBuffer = await file.arrayBuffer();

    // 2. Parse PDF with pdf-lib
    let pdfDoc: PDFDocument;
    try {
      pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    } catch (err: any) {
      const errMsg = String(err?.message || err).toLowerCase();
      if (errMsg.includes('encrypted') || errMsg.includes('password')) {
        result.isEncrypted = true;
        result.isValid = false;
        result.errors.push('This PDF is password-protected. Please unlock/remove password before uploading.');
        return result;
      }
      result.isCorrupted = true;
      result.isValid = false;
      result.errors.push('The PDF file is corrupted or unreadable. Please re-export or generate a fresh PDF.');
      return result;
    }

    if (pdfDoc.isEncrypted) {
      result.isEncrypted = true;
      result.isValid = false;
      result.errors.push('Password-protected PDF detected. Please remove password protection to proceed.');
      return result;
    }

    const pages = pdfDoc.getPages();
    result.pageCount = pages.length;

    if (pages.length === 0) {
      result.isValid = false;
      result.errors.push('The PDF contains 0 pages.');
      return result;
    }

    if (pages.length > 2) {
      result.warnings.push(
        `PDF contains ${pages.length} pages. A standard PVC card prints Front (Page 1) and Back (Page 2). Extra pages will be truncated.`
      );
    }

    // 3. Check page physical dimensions (PDF dimensions are in points: 1 pt = 1/72 inch = 0.352778 mm)
    const firstPage = pages[0];
    const { width: ptWidth, height: ptHeight } = firstPage.getSize();
    const mmWidth = Number((ptWidth * 0.352778).toFixed(1));
    const mmHeight = Number((ptHeight * 0.352778).toFixed(1));

    result.widthMm = mmWidth;
    result.heightMm = mmHeight;

    // Standard CR80 PVC card size is 85.6 mm x 53.98 mm (Aspect ratio ~1.586)
    const targetAspect = 85.6 / 53.98;
    const actualAspect = Math.max(mmWidth, mmHeight) / Math.min(mmWidth, mmHeight);
    const aspectDiff = Math.abs(actualAspect - targetAspect);

    if (aspectDiff > 0.3) {
      result.warnings.push(
        `PDF dimensions (${mmWidth}x${mmHeight} mm) differ from standard CR80 PVC card size (85.6x54 mm). Our auto-fitter will scale and center your layout for crisp output.`
      );
    }

    // Rough check on low resolution if file size is under 50KB for a full card
    if (file.size < 50 * 1024 && pages.length === 1) {
      result.isLowResolution = true;
      result.warnings.push(
        'File size is small (<50KB). Ensure logos and text are high resolution (300 DPI) for optimal PVC printing.'
      );
    }

    return result;
  } catch (err: any) {
    result.isValid = false;
    result.isCorrupted = true;
    result.errors.push('Error processing PDF structure. Please upload a valid document.');
    return result;
  }
}
