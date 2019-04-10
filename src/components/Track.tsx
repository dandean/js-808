import React from 'react';
import css from './Track.module.css';
import { speaker } from '../speaker';
import { Bars } from './Bars';
import { TrackState } from '../App';

interface TrackProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  bars: number;
  currentBarIndex: number;
  currentCellIndex: number;
  onCellClick: (label: string, bar: number, cell: number) => void;
  trackState: TrackState;
}

export const Track: React.FunctionComponent<TrackProps> = props => {
  const {
    bars,
    className,
    currentBarIndex,
    currentCellIndex,
    label,
    onCellClick,
    trackState,
    ...remaining
  } = props;

  if (
    trackState[currentBarIndex] &&
    trackState[currentBarIndex][currentCellIndex] === true
  ) {
    speaker.play(label);
  }

  return (
    <div className={css.wrapper} {...remaining}>
      <span className={css.label}>{label}</span>
      <Bars
        bars={bars}
        currentBarIndex={currentBarIndex}
        currentCellIndex={currentCellIndex}
        trackState={trackState}
        onCellClick={(bar, cell) => props.onCellClick(label, bar, cell)}
      />
    </div>
  );
};
