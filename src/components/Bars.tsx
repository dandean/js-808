import React from 'react';
import classnames from 'classnames';
import css from './Bars.module.css';
import { Bar } from './Bar';

import { TrackState } from '../App';

interface BarsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The number of bars to be rendered */
  bars: number;

  currentBarIndex: number;

  currentCellIndex: number;

  /** The state for the entire track */
  trackState: TrackState;

  /** When an individual cell is clicked */
  onCellClick: (bar: number, cell: number) => void;
}

export const Bars: React.FunctionComponent<BarsProps> = props => {
  const {
    bars,
    className,
    currentBarIndex,
    currentCellIndex,
    onCellClick,
    trackState,
    ...remaining
  } = props;

  return (
    <div className={classnames(css.wrapper, className)} {...remaining}>
      {[...Array(bars)].map((bar, index) => {
        // The sequencer starts at 1, not 0:
        const barIndex = index + 1;

        return (
          <Bar
            key={`bar-${barIndex}`}
            current={currentBarIndex === barIndex ? currentCellIndex : -1}
            barState={trackState[barIndex]}
            onCellClick={cellIndex => onCellClick(barIndex, cellIndex)}
          />
        );
      })}
    </div>
  );
};

Bars.defaultProps = {
  bars: 4,
  currentBarIndex: -1,
  currentCellIndex: -1
};
