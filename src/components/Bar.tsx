import React from 'react';
import classnames from 'classnames';
import css from './Bar.module.css';
import { BarState } from '../App';

interface BarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The current cell being played */
  current?: number;
  barState?: BarState;
  onCellClick: (index: number) => void;
}

/**
 * Represents a single Bar of a Track.
 */
export const Bar: React.FunctionComponent<BarProps> = props => {
  const { className, current, onCellClick, barState, ...remaining } = props;

  return (
    <div className={classnames(css.bar, className)} {...remaining}>
      <div
        onClick={event => onCellClick(1)}
        className={classnames(css.cell, {
          [css.current]: props.current === 1,
          [css.enabled]: barState && barState[1] === true
        })}
      />
      <div
        onClick={event => onCellClick(2)}
        className={classnames(css.cell, {
          [css.current]: props.current === 2,
          [css.enabled]: barState && barState[2] === true
        })}
      />
      <div
        onClick={event => onCellClick(3)}
        className={classnames(css.cell, {
          [css.current]: props.current === 3,
          [css.enabled]: barState && barState[3] === true
        })}
      />
      <div
        onClick={event => onCellClick(4)}
        className={classnames(css.cell, {
          [css.current]: props.current === 4,
          [css.enabled]: barState && barState[4] === true
        })}
      />
    </div>
  );
};
