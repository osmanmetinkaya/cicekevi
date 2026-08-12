"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Loader2, X, ZoomIn, ZoomOut } from "lucide-react";
import { getCroppedImageBlob } from "@/lib/crop-image";

/**
 * Fotoğraf yükleme akışına eklenen kırpma/yakınlaştırma/kaydırma adımı.
 * react-easy-crop görsel üzerinde sürükleme (kaydırma) ve pinch/wheel ile
 * yakınlaştırmayı hazır sağlıyor; burada yalnızca UI çerçevesi ve
 * "Uygula" anında canvas'a kırpma var.
 */
export function ImageCropModal({
  file,
  aspect,
  onCancel,
  onConfirm,
}: {
  file: File;
  /** Genişlik / yükseklik oranı, ör. 1 (kare), 4/3 (banner). */
  aspect: number;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [imageSrc] = useState(() => URL.createObjectURL(file));
  useEffect(() => () => URL.revokeObjectURL(imageSrc), [imageSrc]);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedArea(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedArea) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedArea);
      onConfirm(blob);
    } catch (err) {
      console.error("[admin] crop failed", err);
      setError("Görsel işlenemedi. Tekrar dene.");
      setProcessing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Fotoğrafı düzenle"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg text-ink">Fotoğrafı düzenle</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-blush-100 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-muted">
          Sürükleyerek konumlandır, kaydırıcıyla yakınlaştır.
        </p>

        <div className="relative mt-4 h-72 w-full overflow-hidden rounded-xl bg-cream">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ZoomOut size={16} className="shrink-0 text-ink-muted" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Yakınlaştırma"
            className="flex-1 accent-rose-700"
          />
          <ZoomIn size={16} className="shrink-0 text-ink-muted" />
        </div>

        {error && (
          <p className="mt-3 text-sm text-rose-700" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-ink transition-colors hover:border-blush-300 hover:text-rose-700"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing || !croppedArea}
            className="inline-flex items-center gap-2 rounded-full bg-rose-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-900 disabled:opacity-60"
          >
            {processing && <Loader2 size={15} className="animate-spin" />}
            Uygula
          </button>
        </div>
      </div>
    </div>
  );
}
