import { useRef, useEffect, memo } from 'react';
import type { RefObject } from 'react';
import { Photo } from './photos';
import './PhotoReveal.scss';

const BOX_W   = 320;   // 20% smaller than original 400

export const PHOTO_LAYERS = [
  { filter: 'none',                                                  label: 'PHOTO'     },
  { filter: 'saturate(0) brightness(1.1)',                           label: 'LUMINANCE'  },
  { filter: 'saturate(0) contrast(2.2) brightness(0.85)',            label: 'CONTRAST'   },
  { filter: 'saturate(0) contrast(6) brightness(1.4)',               label: 'THRESHOLD'  },
];

// Phase of the reveal lifecycle:
// 'active'  — mouse is moving, photo fill visible
// 'idle'    — mouse stopped, fill fades to transparent (outline stays)
// 'hidden'  — faded away entirely after idle timeout
export type RevealPhase = 'active' | 'idle' | 'hidden';

interface Props {
  photo:      Photo;
  posRef:     RefObject<{ x: number; y: number } | null>;
  phase:      RevealPhase;
  layerIndex: number;
}

export const PhotoReveal = memo(({ photo, posRef, phase, layerIndex }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [arW, arH] = photo.aspectRatio.split('/').map(Number);
  const imgH = Math.round(BOX_W * arH / arW);

  // RAF loop: read posRef and update DOM position directly (no re-renders)
  useEffect(() => {
    const update = () => {
      const el = containerRef.current;
      const pos = posRef.current;
      if (el && pos) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const totalH = imgH;
        const left = Math.max(8, Math.min(vw - BOX_W - 8, pos.x - BOX_W / 2));
        const top  = Math.max(8, Math.min(vh - totalH - 8, pos.y - totalH / 2));
        el.style.left = `${left}px`;
        el.style.top  = `${top}px`;

        // Update image offsets via CSS custom properties
        const imgEl = el.querySelector('img') as HTMLImageElement | null;
        if (imgEl) {
          imgEl.style.left = `${-left}px`;
          imgEl.style.top  = `${-top}px`;
        }
      }
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [posRef, imgH]);

  const layer = PHOTO_LAYERS[Math.max(0, Math.min(PHOTO_LAYERS.length - 1, layerIndex))];

  const phaseClass =
    phase === 'active' ? ' photo-reveal--active' :
    phase === 'idle'   ? ' photo-reveal--idle' :
    '';

  return (
    <div
      ref={containerRef}
      className={`photo-reveal${phaseClass}`}
      style={{ width: BOX_W }}
      aria-hidden="true"
    >
      <div className="photo-reveal__window" style={{ height: imgH }}>
        <img
          src={photo.src}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            width:  '100vw',
            height: '100vh',
            filter: layer.filter,
            transition: 'filter 350ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <span className="photo-reveal__label">( {photo.title} ) · {layer.label}</span>
      </div>
    </div>
  );
});
