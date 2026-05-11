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
  mouseX:     number;
  mouseY:     number;
  phase:      RevealPhase;
  layerIndex: number;
}

export const PhotoReveal = ({ photo, mouseX, mouseY, phase, layerIndex }: Props) => {
  const [arW, arH] = photo.aspectRatio.split('/').map(Number);
  const imgH   = Math.round(BOX_W * arH / arW);
  const totalH = imgH;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const panelLeft = Math.max(8, Math.min(vw - BOX_W - 8, mouseX - BOX_W / 2));
  const panelTop  = Math.max(8, Math.min(vh - totalH - 8, mouseY - totalH / 2));

  const imgOffsetX = -panelLeft;
  const imgOffsetY = -panelTop;

  const layer = PHOTO_LAYERS[Math.max(0, Math.min(PHOTO_LAYERS.length - 1, layerIndex))];

  const phaseClass =
    phase === 'active' ? ' photo-reveal--active' :
    phase === 'idle'   ? ' photo-reveal--idle' :
    '';

  return (
    <div
      className={`photo-reveal${phaseClass}`}
      style={{ left: panelLeft, top: panelTop, width: BOX_W }}
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
            left: imgOffsetX,
            top:  imgOffsetY,
            filter: layer.filter,
            transition: 'filter 350ms cubic-bezier(0.25, 1, 0.5, 1)',
          }}
        />
        <span className="photo-reveal__label">( {photo.title} ) · {layer.label}</span>
      </div>
    </div>
  );
};
