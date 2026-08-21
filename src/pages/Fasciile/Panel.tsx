import { useCallback, useState } from 'react';
import { SCHEMA, visibleControls, type Control } from '../../lib/ascii/schema';
import type { Params } from '../../lib/ascii/types';

interface PanelProps {
  params: React.MutableRefObject<Params>;
  source: Params['source'];
  projectLabel: string;
  onRebuild: () => void;
  onRedraw: () => void;
}

/**
 * Renders itself from SCHEMA. Adding a control means adding a schema entry.
 *
 * Values are read from and written to the params ref directly, so moving a
 * slider redraws the canvas without re-rendering the tree. The local `tick`
 * state exists only to refresh the numeric readouts.
 */
export const Panel = ({ params, source, projectLabel, onRebuild, onRedraw }: PanelProps) => {
  const [, setTick] = useState(0);

  const apply = useCallback(
    (control: Control, value: Params[keyof Params]) => {
      (params.current as unknown as Record<string, unknown>)[control.key] = value;
      if (control.rebuilds) onRebuild();
      else onRedraw();
      setTick((n) => n + 1);
    },
    [params, onRebuild, onRedraw],
  );

  return (
    <aside className="fasciile__panel" aria-label="Parameters" data-no-drag>
      <div className="fasciile__brand">
        <span>FASCIILE</span>
        <span>{projectLabel}</span>
      </div>

      {SCHEMA.map((group) => {
        const controls = visibleControls(group, source);
        if (!controls.length) return null;
        return (
          <div className="fasciile__group" key={group.title}>
            <p className="fasciile__group-title">{group.title}</p>
            {controls.map((control) => (
              <Field key={String(control.key)} control={control} params={params} apply={apply} />
            ))}
          </div>
        );
      })}
    </aside>
  );
};

interface FieldProps {
  control: Control;
  params: React.MutableRefObject<Params>;
  apply: (control: Control, value: Params[keyof Params]) => void;
}

const Field = ({ control, params, apply }: FieldProps) => {
  const current = params.current[control.key] as never;
  const id = `fasciile-${String(control.key)}`;

  if (control.kind === 'range') {
    const value = current as unknown as number;
    return (
      <div className="fasciile__ctl">
        <div className="fasciile__ctl-row">
          <label className="fasciile__ctl-label" htmlFor={id}>
            {control.label}
          </label>
          <span className="fasciile__ctl-value">
            {value.toFixed(control.decimals)}
            {control.suffix ?? ''}
          </span>
        </div>
        <input
          id={id}
          type="range"
          min={control.min}
          max={control.max}
          step={control.step}
          value={value}
          onChange={(e) => apply(control, parseFloat(e.target.value) as never)}
        />
        {control.hint && <p className="fasciile__hint">{control.hint}</p>}
      </div>
    );
  }

  if (control.kind === 'select') {
    return (
      <div className="fasciile__ctl">
        <label className="fasciile__ctl-label" htmlFor={id}>
          {control.label}
        </label>
        <select
          id={id}
          value={String(current)}
          onChange={(e) => apply(control, e.target.value as never)}
        >
          {control.options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
        {control.hint && <p className="fasciile__hint">{control.hint}</p>}
      </div>
    );
  }

  return (
    <div className="fasciile__ctl">
      <div className="fasciile__segs" role="group" aria-label={control.label}>
        {control.options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            className="fasciile__seg"
            aria-pressed={current === (o.value as never)}
            onClick={() => apply(control, o.value as never)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {control.hint && <p className="fasciile__hint">{control.hint}</p>}
    </div>
  );
};
