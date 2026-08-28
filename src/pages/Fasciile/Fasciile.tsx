import { useCallback, useEffect, useRef, useState } from 'react';
import { Panel } from './Panel';
import { useAsciiEngine } from './useAsciiEngine';
import { decodeImage, loadImageFromUrl, readFileText } from '../../lib/ascii/sources/heightfield';
import { sanitizeSvg, svgToImage } from '../../lib/ascii/sources/svgIngest';
import type { Params } from '../../lib/ascii/types';
import './Fasciile.scss';

const SOURCES: Array<{ value: Params['source']; label: string }> = [
  { value: 'torus', label: 'Donut' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'path', label: 'Path' },
  { value: 'image', label: 'Image' },
];

const ACCEPT =
  'image/svg+xml,image/png,image/jpeg,image/webp,image/gif,.svg,.png,.jpg,.jpeg,.webp,.gif';

const SVG_STEPS = [
  'Parse SVG, resolve viewBox',
  'Walk geometry elements',
  'Flatten by arc length',
  'Release the DOM',
];
const RASTER_STEPS = [
  'Rasterize to sample grid',
  'Extract luminance field',
  'Derive normals from gradient',
  'Build point cloud',
];

const looksLikeSvg = (text: string) => /<svg[\s>]/i.test(text.slice(0, 4000));
const looksLikeUrl = (text: string) => /^(https?:\/\/|data:image\/|\/)\S+$/i.test(text.trim());
const URL_STEPS = ['Fetch the image', 'Extract luminance field', 'Build point cloud', 'Ready'];
const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export const Fasciile = () => {
  const stageRef = useRef<HTMLPreElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);

  const engine = useAsciiEngine(stageRef, viewportRef);
  const {
    params,
    stats,
    running,
    setRunning,
    rebuild,
    reset,
    redraw,
    setSource,
    loadShape,
    loadImage,
    faceFront,
    revision,
  } = engine;

  const [source, setSourceState] = useState<Params['source']>('torus');
  const [projectLabel, setProjectLabel] = useState('Donut');
  const [toast, setToast] = useState('');
  const [steps, setSteps] = useState<{ labels: string[]; active: number; title: string } | null>(
    null,
  );
  const [pasteOpen, setPasteOpen] = useState(false);
  const toastTimer = useRef(0);

  const flash = useCallback((message: string, ms = 1600) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), ms);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const chooseSource = useCallback(
    (kind: Params['source']) => {
      setSource(kind);
      setSourceState(kind);
      setProjectLabel(
        kind === 'image' ? 'Raster' : kind === 'path' ? 'Path' : kind === 'sphere' ? 'Sphere' : 'Donut',
      );
    },
    [setSource],
  );

  /** Walks the labelled step list, then runs `finish`. */
  const runSteps = useCallback((labels: string[], title: string, finish: () => void) => {
    setSteps({ labels, active: 0, title });
    let i = 0;
    const tick = () => {
      i += 1;
      if (i < labels.length) {
        setSteps({ labels, active: i, title });
        window.setTimeout(tick, 150);
        return;
      }
      finish();
      setSteps(null);
    };
    window.setTimeout(tick, 150);
  }, []);

  const useMarkup = useCallback(
    (raw: string) => {
      const markup = sanitizeSvg(raw);
      if (!markup) {
        flash("That markup isn't valid SVG", 3000);
        return;
      }
      setPasteOpen(false);
      runSteps(SVG_STEPS, 'Analyzing SVG', () => {
        if (!loadShape(markup)) {
          flash('Parsed, but no samplable geometry in it', 3000);
          return;
        }
        setSourceState('path');
        setProjectLabel('SVG · outline');
        flash('SVG imported');
      });
    },
    [flash, loadShape, runSteps],
  );

  const useUrl = useCallback(
    async (raw: string) => {
      const url = raw.trim();
      setPasteOpen(false);

      // An .svg URL is worth fetching as text first — that route yields arc
      // length, and therefore the reveal. Falls through to raster if CORS says no.
      if (/\.svg(\?|#|$)/i.test(url)) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            if (looksLikeSvg(text)) {
              useMarkup(text);
              return;
            }
          }
        } catch {
          // CORS or network — fall through and let <img> try instead.
        }
      }

      try {
        const img = await loadImageFromUrl(url);
        runSteps(URL_STEPS, 'Loading image', () => {
          loadImage(img);
          setSourceState('image');
          setProjectLabel('URL');
          flash('Loaded from URL');
        });
      } catch (err) {
        flash((err as Error).message, 5000);
        setPasteOpen(true);
      }
    },
    [flash, loadImage, runSteps, useMarkup],
  );

  const importFile = useCallback(
    async (file: File) => {
      const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name);

      if (isSvg) {
        try {
          const raw = await readFileText(file);
          useMarkup(raw);
          return;
        } catch (err) {
          // Reading the bytes failed. The markup may still decode as an image.
          console.error('[fasciile]', err);
        }
        const fallback = await decodeImage(file);
        if (fallback) {
          runSteps(RASTER_STEPS, 'Analyzing SVG', () => {
            loadImage(fallback);
            setSourceState('image');
            setProjectLabel('SVG · solid');
            flash('Read failed — rasterized instead', 3000);
          });
          return;
        }
        flash('Could not read that file. Paste the markup instead.', 4000);
        setPasteOpen(true);
        return;
      }

      if (!/^image\//.test(file.type)) {
        flash(`Needs SVG, PNG, JPEG, WebP or GIF — got "${file.type || 'unknown type'}"`, 3500);
        return;
      }

      const img = await decodeImage(file);
      if (!img) {
        flash('Could not decode that image', 3000);
        return;
      }
      runSteps(RASTER_STEPS, 'Analyzing image', () => {
        loadImage(img);
        setSourceState('image');
        setProjectLabel('Raster');
        flash('Imported');
      });
    },
    [flash, loadImage, runSteps, useMarkup],
  );

  // Solid mode for an SVG: rasterize the markup and hand it to the raster path.
  const solidify = useCallback(async () => {
    const img = await svgToImage(sanitizeSvg(pasteRef.current?.value ?? '') ?? '');
    if (!img) {
      flash('Nothing to rasterize', 2500);
      return;
    }
    loadImage(img);
    setSourceState('image');
  }, [flash, loadImage]);

  // ── Drop and paste ───────────────────────────────────────────────────────
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const stop = (e: DragEvent) => {
      e.preventDefault();
      viewport.classList.add('is-drop');
    };
    const clear = (e: DragEvent) => {
      e.preventDefault();
      viewport.classList.remove('is-drop');
    };
    const onDrop = (e: DragEvent) => {
      clear(e);
      const dt = e.dataTransfer;
      if (!dt) return;
      if (dt.files?.length) {
        void importFile(dt.files[0]);
        return;
      }
      const text = dt.getData('text/plain') || '';
      if (looksLikeSvg(text)) useMarkup(text);
      else if (looksLikeUrl(text)) void useUrl(text);
    };

    viewport.addEventListener('dragenter', stop);
    viewport.addEventListener('dragover', stop);
    viewport.addEventListener('dragleave', clear);
    viewport.addEventListener('drop', onDrop);
    return () => {
      viewport.removeEventListener('dragenter', stop);
      viewport.removeEventListener('dragover', stop);
      viewport.removeEventListener('dragleave', clear);
      viewport.removeEventListener('drop', onDrop);
    };
  }, [importFile, useMarkup, useUrl]);

  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const dt = e.clipboardData;
      if (!dt) return;
      const target = e.target as HTMLElement;
      if (target !== pasteRef.current && /^(INPUT|TEXTAREA)$/.test(target?.tagName ?? '')) return;
      if (dt.files?.length) {
        e.preventDefault();
        void importFile(dt.files[0]);
        return;
      }
      const text = dt.getData('text/plain') || '';
      if (target === pasteRef.current) return;
      if (looksLikeSvg(text)) {
        e.preventDefault();
        useMarkup(text);
      } else if (looksLikeUrl(text)) {
        e.preventDefault();
        void useUrl(text);
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [importFile, useMarkup, useUrl]);

  const exportConfig = useCallback(() => {
    const json = JSON.stringify(params.current, null, 2);
    navigator.clipboard?.writeText(json).then(
      () => flash('Config copied'),
      () => {
        console.log(json);
        flash('Copy blocked — logged to console', 2500);
      },
    );
  }, [flash, params]);

  return (
    <div className="fasciile">
      <Panel
        params={params}
        source={source}
        projectLabel={projectLabel}
        onRebuild={rebuild}
        onRedraw={redraw}
        onReset={reset}
        onFaceFront={faceFront}
        revision={revision}
      />

      <div className="fasciile__viewport" ref={viewportRef} tabIndex={0} aria-label="ASCII render">
        <pre className="fasciile__stage" ref={stageRef} />

        <div className="fasciile__hud">
          <span>
            <b>{fmtK(stats.points)}</b> pts
          </span>
          <span>
            <b>
              {stats.cols}×{stats.rows}
            </b>{' '}
            cells
          </span>
          <span>
            <b>{stats.ms.toFixed(1)}</b> ms/frame
          </span>
        </div>

        {steps && (
          <div className="fasciile__scrim" role="status" aria-live="polite" data-no-drag>
            <div className="fasciile__scrim-box">
              <p className="fasciile__loadword" aria-hidden="true">
                [LOADING<i>.</i>
                <i>.</i>
                <i>.</i>]
              </p>
              <h4>{steps.title}</h4>
              {steps.labels.map((label, i) => (
                <div
                  key={label}
                  className={`fasciile__step${i === steps.active ? ' is-on' : i < steps.active ? ' is-done' : ''}`}
                >
                  <i />
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}

        {pasteOpen && (
          <div className="fasciile__paste" data-no-drag>
            <div className="fasciile__paste-box">
              <h4>Paste markup or a URL</h4>
              <textarea
                ref={pasteRef}
                spellCheck={false}
                placeholder={'<svg viewBox="0 0 100 100">…</svg>\n\nor\n\nhttps://example.com/photo.jpg'}
              />
              <div className="fasciile__paste-row">
                <button type="button" className="fasciile__btn" onClick={() => setPasteOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="fasciile__btn" onClick={solidify}>
                  Use as solid
                </button>
                <button
                  type="button"
                  className="fasciile__btn is-primary"
                  onClick={() => {
                    const raw = pasteRef.current?.value ?? '';
                    if (looksLikeUrl(raw)) void useUrl(raw);
                    else useMarkup(raw);
                  }}
                >
                  Load
                </button>
              </div>
              <p className="fasciile__hint">
                SVG markup, or a link straight to an image file. ⌘V in the viewport works too.
                A URL only loads if its host allows cross-origin reads.
              </p>
            </div>
          </div>
        )}

        {toast && <div className="fasciile__toast">{toast}</div>}

        <nav className="fasciile__dock" aria-label="Project actions" data-no-drag>
          <div className="fasciile__dock-sources" role="group" aria-label="Source">
            {SOURCES.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={source === s.value}
                onClick={() => chooseSource(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setRunning(!running)}>
            {running ? 'Pause' : 'Play'}
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            Import
          </button>
          <button type="button" onClick={() => setPasteOpen(true)}>
            Paste
          </button>
          <button type="button" className="is-primary" onClick={exportConfig}>
            Export config
          </button>
        </nav>

        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importFile(file);
          }}
        />
      </div>
    </div>
  );
};

export default Fasciile;
