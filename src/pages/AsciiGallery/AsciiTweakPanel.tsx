/**
 * Dev-only leva tweak panel for ASCII gallery parameters.
 *
 * Bridges leva's React hooks with the mutable asciiConfig object
 * that RAF loops read each frame. Only rendered when import.meta.env.DEV.
 */

import { useEffect, useState, useCallback } from 'react';
import { useControls, Leva, button, levaStore } from 'leva';
import { asciiConfig, ASCII_DEFAULTS } from './asciiConfig';
import { clearCache } from './useAsciiConverter';
import { getCurrentKineticState } from './AsciiTransition';
import { Photo } from './photos';

// ── Leva theme — matches site overlay aesthetic ──────────────────────────────

const SITE_THEME = {
  colors: {
    elevation1: 'rgba(255, 255, 255, 0.82)',
    elevation2: 'rgba(255, 255, 255, 0.55)',
    elevation3: 'rgba(240, 240, 240, 0.90)',
    accent1: '#1d1d1d',
    accent2: '#3a55d2',
    accent3: '#3a55d2',
    highlight1: '#888888',
    highlight2: '#666666',
    highlight3: '#1d1d1d',
    vivid1: '#3a55d2',
    folderWidgetColor: '#1d1d1d',
    folderTextColor: '#1d1d1d',
    toolTipBackground: '#1d1d1d',
    toolTipText: '#ffffff',
  },
  radii: { xs: '1px', sm: '2px', lg: '4px' },
  space: { xs: '2px', sm: '4px', md: '8px', rowGap: '4px', colGap: '6px' },
  fonts: { mono: "'GeistMono', monospace", sans: "'GeistMono', monospace" },
  fontSizes: { root: '10px', toolTip: '9px' },
  sizes: {
    rootWidth: '300px',
    controlWidth: '150px',
    rowHeight: '22px',
    folderTitleHeight: '22px',
    titleBarHeight: '28px',
    scrubberWidth: '6px',
    scrubberHeight: '14px',
  },
  shadows: {
    level1: '0 2px 8px rgba(0, 0, 0, 0.08)',
    level2: '0 2px 6px rgba(0, 0, 0, 0.06)',
  },
  borderWidths: {
    root: '0px',
    input: '1px',
    focus: '1px',
    hover: '1px',
    active: '1px',
    folder: '1px',
  },
  fontWeights: { label: 'normal', folder: '500', button: '500' },
};

interface Props {
  currentPhoto: Photo | null;
  onReconvert?: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}

export function AsciiTweakPanel({ currentPhoto, onReconvert, onVisibilityChange }: Props) {
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 770);

  // Only show on desktop — hide entirely on mobile/tablet
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 770px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!isDesktop) return null;

  // Notify parent of visibility changes
  useEffect(() => {
    onVisibilityChange?.(visible);
  }, [visible, onVisibilityChange]);

  // Toggle with backtick key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '`' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setVisible(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Image Processing (requires reconvert) ──
  const conversion = useControls('Image Processing', {
    canvasContrast:   { value: asciiConfig.canvasContrast, min: 50, max: 300, step: 5, label: 'Contrast' },
    sigmoidSteepness: { value: asciiConfig.sigmoidSteepness, min: 1, max: 20, step: 0.5, label: 'Tone Curve' },
    percentileLo:     { value: asciiConfig.percentileLo, min: 0, max: 0.3, step: 0.01, label: 'Shadow Clip' },
    percentileHi:     { value: asciiConfig.percentileHi, min: 0.7, max: 1.0, step: 0.01, label: 'Highlight Clip' },
    edgeThreshold:    { value: asciiConfig.edgeThreshold, min: 0.1, max: 0.9, step: 0.05, label: 'Edge Detail' },
    'Apply': button(() => {
      clearCache();
      onReconvert?.();
    }),
  });

  // ── Resolution ──
  const grid = useControls('Resolution', {
    colsMobile:  { value: asciiConfig.colsMobile, min: 40, max: 300, step: 10, label: 'Mobile' },
    colsTablet:  { value: asciiConfig.colsTablet, min: 80, max: 400, step: 10, label: 'Tablet' },
    colsDesktop: { value: asciiConfig.colsDesktop, min: 200, max: 1000, step: 50, label: 'Desktop' },
  });

  // ── Transition ──
  const morph = useControls('Transition', {
    morphMs:          { value: asciiConfig.morphMs, min: 200, max: 4000, step: 50, label: 'Duration (ms)' },
    staggerFraction:  { value: asciiConfig.staggerFraction, min: 0.05, max: 0.8, step: 0.05, label: 'Wave Spread' },
    cellFraction:     { value: asciiConfig.cellFraction, min: 0.1, max: 0.9, step: 0.05, label: 'Cell Blend' },
  });

  // ── Color Pulse ──
  const pulse = useControls('Color Pulse', {
    pulseFreq0:       { value: asciiConfig.pulseFreq0, min: 0.01, max: 2.0, step: 0.01, label: 'Rate A' },
    pulseFreq1:       { value: asciiConfig.pulseFreq1, min: 0.01, max: 2.0, step: 0.01, label: 'Rate B' },
    pulseFreq2:       { value: asciiConfig.pulseFreq2, min: 0.01, max: 2.0, step: 0.01, label: 'Rate C' },
    pulseBaseOpacity: { value: asciiConfig.pulseBaseOpacity, min: 0, max: 0.5, step: 0.01, label: 'Base Opacity' },
    pulseAmplitude:   { value: asciiConfig.pulseAmplitude, min: 0, max: 0.3, step: 0.01, label: 'Intensity' },
  });

  // ── Trails ──
  const echo = useControls('Trails', {
    echoEveryNFrames: { value: asciiConfig.echoEveryNFrames, min: 1, max: 20, step: 1, label: 'Frame Skip' },
    echoOpacity:      { value: asciiConfig.echoOpacity, min: 0, max: 0.6, step: 0.02, label: 'Trail Opacity' },
  });

  // ── Hover Effect ──
  const cursor = useControls('Hover Effect', {
    disturbanceRadius:    { value: asciiConfig.disturbanceRadius, min: 5, max: 80, step: 1, label: 'Radius' },
    disturbanceMaxDarken: { value: asciiConfig.disturbanceMaxDarken, min: 1, max: 30, step: 1, label: 'Darken Amount' },
  });

  // ── Reset All ──
  useControls({
    'Reset All': button(() => {
      Object.assign(asciiConfig, ASCII_DEFAULTS);
      // Try dot-notation keys first (leva folders), fall back to flat
      try {
        levaStore.set({
          'Image Processing.canvasContrast': ASCII_DEFAULTS.canvasContrast,
          'Image Processing.sigmoidSteepness': ASCII_DEFAULTS.sigmoidSteepness,
          'Image Processing.percentileLo': ASCII_DEFAULTS.percentileLo,
          'Image Processing.percentileHi': ASCII_DEFAULTS.percentileHi,
          'Image Processing.edgeThreshold': ASCII_DEFAULTS.edgeThreshold,
          'Resolution.colsMobile': ASCII_DEFAULTS.colsMobile,
          'Resolution.colsTablet': ASCII_DEFAULTS.colsTablet,
          'Resolution.colsDesktop': ASCII_DEFAULTS.colsDesktop,
          'Transition.morphMs': ASCII_DEFAULTS.morphMs,
          'Transition.staggerFraction': ASCII_DEFAULTS.staggerFraction,
          'Transition.cellFraction': ASCII_DEFAULTS.cellFraction,
          'Color Pulse.pulseFreq0': ASCII_DEFAULTS.pulseFreq0,
          'Color Pulse.pulseFreq1': ASCII_DEFAULTS.pulseFreq1,
          'Color Pulse.pulseFreq2': ASCII_DEFAULTS.pulseFreq2,
          'Color Pulse.pulseBaseOpacity': ASCII_DEFAULTS.pulseBaseOpacity,
          'Color Pulse.pulseAmplitude': ASCII_DEFAULTS.pulseAmplitude,
          'Trails.echoEveryNFrames': ASCII_DEFAULTS.echoEveryNFrames,
          'Trails.echoOpacity': ASCII_DEFAULTS.echoOpacity,
          'Hover Effect.disturbanceRadius': ASCII_DEFAULTS.disturbanceRadius,
          'Hover Effect.disturbanceMaxDarken': ASCII_DEFAULTS.disturbanceMaxDarken,
        } as any, false);
      } catch {
        // Fallback: flat keys
        levaStore.set({
          canvasContrast: ASCII_DEFAULTS.canvasContrast,
          sigmoidSteepness: ASCII_DEFAULTS.sigmoidSteepness,
          percentileLo: ASCII_DEFAULTS.percentileLo,
          percentileHi: ASCII_DEFAULTS.percentileHi,
          edgeThreshold: ASCII_DEFAULTS.edgeThreshold,
          colsMobile: ASCII_DEFAULTS.colsMobile,
          colsTablet: ASCII_DEFAULTS.colsTablet,
          colsDesktop: ASCII_DEFAULTS.colsDesktop,
          morphMs: ASCII_DEFAULTS.morphMs,
          staggerFraction: ASCII_DEFAULTS.staggerFraction,
          cellFraction: ASCII_DEFAULTS.cellFraction,
          pulseFreq0: ASCII_DEFAULTS.pulseFreq0,
          pulseFreq1: ASCII_DEFAULTS.pulseFreq1,
          pulseFreq2: ASCII_DEFAULTS.pulseFreq2,
          pulseBaseOpacity: ASCII_DEFAULTS.pulseBaseOpacity,
          pulseAmplitude: ASCII_DEFAULTS.pulseAmplitude,
          echoEveryNFrames: ASCII_DEFAULTS.echoEveryNFrames,
          echoOpacity: ASCII_DEFAULTS.echoOpacity,
          disturbanceRadius: ASCII_DEFAULTS.disturbanceRadius,
          disturbanceMaxDarken: ASCII_DEFAULTS.disturbanceMaxDarken,
        } as any, false);
      }
      clearCache();
      onReconvert?.();
    }),
  });

  // ── Kinetic layer params (direct mutation) ──
  const [kineticKey, setKineticKey] = useState(0);
  const refreshKinetic = useCallback(() => setKineticKey(k => k + 1), []);

  // Sync all leva values to asciiConfig each render
  useEffect(() => {
    Object.assign(asciiConfig, conversion, grid, morph, pulse, echo, cursor);
  });

  // Render kinetic layer info
  const kineticState = getCurrentKineticState();
  const layers = kineticState?.layers ?? [];

  return (
    <>
      <Leva
        hidden={!visible}
        collapsed={false}
        titleBar={{ drag: true, position: { x: -10, y: 60 } }}
        theme={SITE_THEME}
      />

      {/* Bottom-right toggle button */}
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 99999,
            background: 'rgba(255, 255, 255, 0.80)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#1d1d1d',
            border: 'none',
            borderRadius: 4,
            padding: '6px 12px',
            fontFamily: "'GeistMono', monospace",
            fontSize: 10,
            cursor: 'pointer',
            letterSpacing: '0.08em',
            textTransform: 'uppercase' as const,
          }}
        >
          Tweak
        </button>
      )}

      {/* Kinetic layer editor overlay */}
      {visible && layers.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 99998,
            background: 'rgba(255, 255, 255, 0.82)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: 4,
            padding: '10px 14px',
            fontFamily: "'GeistMono', monospace",
            fontSize: 10,
            maxHeight: 300,
            overflowY: 'auto',
            minWidth: 260,
            color: '#1d1d1d',
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>
            Kinetic: {currentPhoto?.kinetic ?? '—'} ({layers.length} layers)
            <button
              onClick={refreshKinetic}
              style={{
                marginLeft: 8, fontSize: 9, cursor: 'pointer',
                background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(29,29,29,0.15)',
                borderRadius: 2, padding: '2px 6px', letterSpacing: '0.04em',
              }}
            >
              refresh
            </button>
          </div>
          {layers.map((layer, i) => (
            <KineticLayerEditor key={`${currentPhoto?.id}-${i}-${kineticKey}`} layer={layer} index={i} />
          ))}
        </div>
      )}
    </>
  );
}

function KineticLayerEditor({ layer, index }: { layer: any; index: number }) {
  const [collapsed, setCollapsed] = useState(true);
  const editableFields = [
    'zoneRowStart', 'zoneRowEnd', 'zoneColStart', 'zoneColEnd',
    'densityMin', 'densityMax', 'spatialScale', 'colScale',
    'flowX', 'flowY', 'maxShift', 'oscSpeed',
    'heightPow', 'seedScale', 'colPhaseScale', 'rowPhaseScale',
    'fogThreshold', 'colorIndex',
  ];

  return (
    <div style={{ marginBottom: 6, borderTop: '1px solid rgba(29,29,29,0.1)', paddingTop: 4 }}>
      <div
        onClick={() => setCollapsed(c => !c)}
        style={{ cursor: 'pointer', fontWeight: 500 }}
      >
        {collapsed ? '▸' : '▾'} Layer {index}: {layer.mode}
      </div>
      {!collapsed && (
        <div style={{ paddingLeft: 12, marginTop: 4 }}>
          {editableFields.map(field => {
            const val = layer[field];
            if (val === undefined) return null;
            return (
              <div key={field} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ opacity: 0.5 }}>{field}</span>
                <input
                  type="number"
                  step={typeof val === 'number' && val < 1 ? 0.01 : 1}
                  defaultValue={val}
                  onChange={e => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) layer[field] = v;
                  }}
                  style={{
                    width: 70,
                    fontFamily: "'GeistMono', monospace",
                    fontSize: 10,
                    textAlign: 'right',
                    border: '1px solid rgba(29,29,29,0.2)',
                    borderRadius: 2,
                    padding: '1px 4px',
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
