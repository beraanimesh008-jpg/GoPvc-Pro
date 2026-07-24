import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  RefreshCw,
  Lock,
  Trash2,
  FileCheck,
} from 'lucide-react';
import { validatePdfFile } from '../lib/pdfValidator';
import { UploadedPdfItem } from '../types';
import { api } from '../services/api';

interface OrderUploadFlowProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  files: UploadedPdfItem[];
  onFilesChange: (files: UploadedPdfItem[]) => void;
}

export const OrderUploadFlow: React.FC<OrderUploadFlowProps> = ({
  quantity,
  onQuantityChange,
  files,
  onFilesChange,
}) => {
  const [validatingIndexes, setValidatingIndexes] = useState<Record<number, boolean>>({});
  const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});
  const [validationWarnings, setValidationWarnings] = useState<Record<number, string[]>>({});

  // Ensure files array length matches quantity
  useEffect(() => {
    // If quantity expanded, don't drop existing uploaded files, just append placeholder or trim
  }, [quantity]);

  const handleQuantityIncrement = () => {
    if (quantity < 100) onQuantityChange(quantity + 1);
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      onQuantityChange(newQty);
      // Trim files array if length > newQty
      if (files.length > newQty) {
        onFilesChange(files.slice(0, newQty));
      }
    }
  };

  const handleFileUpload = async (fileIndex: number, file: File) => {
    setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: true }));
    setValidationErrors((prev) => ({ ...prev, [fileIndex]: [] }));
    setValidationWarnings((prev) => ({ ...prev, [fileIndex]: [] }));

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: false }));
      setValidationErrors((prev) => ({
        ...prev,
        [fileIndex]: ['Only PDF files are allowed.'],
      }));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: false }));
      setValidationErrors((prev) => ({
        ...prev,
        [fileIndex]: ['File size exceeds maximum 50MB limit.'],
      }));
      return;
    }

    try {
      // Local check
      const localResult = await validatePdfFile(file);
      if (localResult.errors.length > 0) {
        setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: false }));
        setValidationErrors((prev) => ({ ...prev, [fileIndex]: localResult.errors }));
        return;
      }
      if (localResult.warnings.length > 0) {
        setValidationWarnings((prev) => ({ ...prev, [fileIndex]: localResult.warnings }));
      }

      // Server upload & disk storage
      const serverFile = await api.uploadPdf(file, fileIndex);

      setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: false }));

      const newPdfItem: UploadedPdfItem = {
        ...serverFile,
        name: file.name,
        sizeBytes: file.size,
        fileIndex,
      };

      // Update files state array
      const updated = [...files];
      const existingIdx = updated.findIndex((f) => f.fileIndex === fileIndex);
      if (existingIdx !== -1) {
        updated[existingIdx] = newPdfItem;
      } else {
        updated.push(newPdfItem);
      }

      onFilesChange(updated);
    } catch (err: any) {
      setValidatingIndexes((prev) => ({ ...prev, [fileIndex]: false }));
      setValidationErrors((prev) => ({
        ...prev,
        [fileIndex]: [err.message || 'Failed to upload PDF file to server.'],
      }));
    }
  };

  const handleRemoveFile = (fileIndex: number) => {
    const updated = files.filter((f) => f.fileIndex !== fileIndex);
    onFilesChange(updated);
    setValidationErrors((prev) => {
      const copy = { ...prev };
      delete copy[fileIndex];
      return copy;
    });
    setValidationWarnings((prev) => {
      const copy = { ...prev };
      delete copy[fileIndex];
      return copy;
    });
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-100 space-y-6 sm:space-y-8">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100">
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600 block mb-1">
            STEP 1 OF 3
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Select Quantity & Upload Card PDFs
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Choose how many cards you need. Each card slot requires 1 valid PDF document (Max 50MB).
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between sm:justify-start gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 shrink-0">
          <button
            onClick={handleQuantityDecrement}
            disabled={quantity <= 1}
            className="w-10 h-10 rounded-xl bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-40 transition flex items-center justify-center shadow-xs shrink-0"
            title="Decrease Quantity"
          >
            <Minus className="w-4 h-4" />
          </button>

          <div className="text-center px-4">
            <span className="text-xl font-black text-slate-900 block leading-tight">
              {quantity}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase">
              {quantity === 1 ? 'Card' : 'Cards'}
            </span>
          </div>

          <button
            onClick={handleQuantityIncrement}
            className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center justify-center shadow-sm shadow-red-200 shrink-0"
            title="Increase Quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Upload Boxes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            PDF Upload Slots ({files.length} of {quantity} uploaded)
          </span>
          <span className="text-xs text-slate-500">Only .PDF allowed | Max 50MB</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: quantity }, (_, idx) => {
            const slotIndex = idx + 1;
            const uploadedFile = files.find((f) => f.fileIndex === slotIndex);
            const isValidating = validatingIndexes[slotIndex];
            const slotErrors = validationErrors[slotIndex] || [];
            const slotWarnings = validationWarnings[slotIndex] || [];

            return (
              <div
                key={`upload-slot-${slotIndex}`}
                className={`relative rounded-2xl p-5 border-2 transition-all ${
                  uploadedFile
                    ? 'bg-red-50/20 border-red-200'
                    : slotErrors.length > 0
                    ? 'bg-rose-50/50 border-rose-300'
                    : 'bg-red-50/30 border-dashed border-red-200 hover:bg-red-50 hover:border-red-300'
                }`}
              >
                {/* Slot Header Label */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-red-600" />
                    Upload PDF {slotIndex}
                  </span>

                  {uploadedFile && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      VERIFIED
                    </span>
                  )}
                </div>

                {/* Slot Content */}
                {isValidating ? (
                  <div className="py-6 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 text-red-600 animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">
                      Analyzing PDF structure & security...
                    </p>
                  </div>
                ) : uploadedFile ? (
                  /* File Uploaded State */
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {(uploadedFile.sizeBytes / (1024 * 1024)).toFixed(2)} MB • {uploadedFile.pageCount} Page(s) • {uploadedFile.dimensionsMm.width}x{uploadedFile.dimensionsMm.height}mm
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(slotIndex)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Warnings if any */}
                    {slotWarnings.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                        {slotWarnings.map((w, wIdx) => (
                          <div key={wIdx} className="flex items-start gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Dropzone State */
                  <div>
                    <label className="cursor-pointer block text-center py-6 px-4 rounded-xl hover:bg-white/60 transition group">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(slotIndex, file);
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 block group-hover:text-red-600 transition">
                        Click or Drag PDF Here
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        Aadhaar, PAN, Voter, Employee ID or Custom Card
                      </span>
                    </label>

                    {/* Slot Errors */}
                    {slotErrors.length > 0 && (
                      <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] space-y-1">
                        {slotErrors.map((err, errIdx) => (
                          <div key={errIdx} className="flex items-start gap-1.5 font-medium">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <span>{err}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Validation Banner Summary */}
      {files.length < quantity && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You have selected <strong>{quantity} card(s)</strong>. Please upload <strong>{quantity - files.length} more PDF file(s)</strong> to proceed to delivery details.
          </span>
        </div>
      )}
    </div>
  );
};
