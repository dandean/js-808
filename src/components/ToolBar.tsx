import React from 'react';
import classnames from 'classnames';
import css from './ToolBar.module.css';

interface ToolBarProps extends React.HTMLAttributes<HTMLDivElement> {
  bar: number;
  beat: number;
  bars: number;
  bpm: number;
  isPlaying: boolean;
  sequences: {
    label: string;
    id: string;
  }[];
  currentSequenceId?: string;
  onTogglePlayState: (isPlaying: boolean) => void;
  onSetBPM: (bpm: number) => void;
  onSetBars: (bars: number) => void;
  onSetSequence: (id: string) => void;
}

export const ToolBar: React.FunctionComponent<ToolBarProps> = props => {
  const {
    className,
    bar,
    beat,
    bars,
    bpm,
    isPlaying,
    sequences,
    currentSequenceId,
    onTogglePlayState,
    onSetBPM,
    onSetBars,
    onSetSequence,
    ...remaining
  } = props;

  const barCountInputRef = React.createRef<HTMLInputElement>();
  const bpmInputRef = React.createRef<HTMLInputElement>();

  return (
    <div className={classnames(css.wrapper, className)} {...remaining}>
      <h1 className={css.logo}>JS-808</h1>
      <div className={css.controls}>
        <span className={css.clock}>
          {bar < 1 ? '~' : bar}:{beat < 1 ? '~' : beat}
        </span>
        <button type="button" onClick={event => onTogglePlayState(!isPlaying)}>
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <label htmlFor="bars">Bars:</label>
        <input
          ref={barCountInputRef}
          id="bars"
          type="number"
          className="label"
          min="4"
          value={String(bars)}
          onChange={event => {
            const value = parseInt(event.target.value, 10);
            if (value < 4) {
              event.preventDefault();
              if (barCountInputRef.current) {
                barCountInputRef.current.value = '4';
              }
            } else if (value >= 4) {
              onSetBars(value);
            }
          }}
        />
        <label htmlFor="bpm">BPM:</label>
        <input
          ref={bpmInputRef}
          id="bpm"
          type="number"
          className="label"
          min="20"
          value={String(bpm)}
          onChange={event => {
            const value = parseInt(event.target.value, 10);
            if (value < 20) {
              event.preventDefault();
              if (bpmInputRef.current) {
                bpmInputRef.current.value = '4';
              }
            } else if (value >= 20) {
              onSetBPM(value);
            }
          }}
        />
        <select
          onChange={({ target }) => {
            onSetSequence(target.options[target.selectedIndex].value);
          }}
        >
          {sequences.map(({ label, id }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
