import React from 'react';
import { ToolBar } from './components/ToolBar';
import { Track } from './components/Track';
import { speaker } from './speaker';
import { sequences } from './sequences';
import css from './App.module.css';

// TODO: These exported state interfaces belong somewhere else.

export interface ApplicationTrackState {
  // label
  [key: string]: TrackState;
}

export interface TrackState {
  // bar
  [key: string]: BarState;
}

export interface BarState {
  // cell
  [key: string]: boolean;
}

interface ApplicationState {
  currentBar: number;
  currentBeat: number;
  bpm: number;
  bars: number;
  isPlaying: boolean;
  selectedSequenceId: string;
  trackState: ApplicationTrackState;
}

export class ApplicationClass extends React.Component<{}, ApplicationState> {
  private storageInterval: any;
  private clockTimeout: any;
  private beatsPerBar: number = 4;

  constructor(props: any) {
    super(props);

    // We need to initialize state once. State can come from two places:
    // 1) saved state in local storage or 2) default configuration. Most of
    // these values can be pulled in fairly easily. Because track state is an
    // object we've got to add some error handling.
    let selectedSequenceId = this.getFromStorageOrDefault(
      'selectedSequence',
      'fourOnTheFloor'
    );

    let trackState = this.getFromStorageOrDefault('trackState', null);
    if (trackState === null) {
      trackState = JSON.stringify(sequences['fourOnTheFloor'].beats);
    }

    this.state = {
      currentBar: 0,
      currentBeat: 0,
      bpm: Number(this.getFromStorageOrDefault('bpm', 128)),
      bars: Number(this.getFromStorageOrDefault('bars', 4)),
      isPlaying: false,
      selectedSequenceId,
      trackState: JSON.parse(trackState)
    };
  }

  componentDidMount() {
    // Wire up the speaker singleton. This would allow us to play sounds as
    // they are triggered from each track, while leaving the details of how
    // that is wired up outside of that component.
    speaker.on('play', label => {
      console.log(label);
    });

    // Save state at an interval. This was originally saving whenever these
    // properties changed but the blocking nature of localStorage immediately
    // showed a UI performance issue where frequent state changes began making
    // the UI stutter. A more ideal solution would be to push this process off
    // to an async process, possibly on a web worker, and save to a central
    // location instead of local storage.
    this.storageInterval = setInterval(() => {
      window.localStorage.setItem('bpm', this.state.bpm.toString());
      window.localStorage.setItem('bars', this.state.bars.toString());
      window.localStorage.setItem(
        'trackState',
        JSON.stringify(this.state.trackState)
      ),
        window.localStorage.setItem(
          'selectedSequence',
          this.state.selectedSequenceId
        );
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.storageInterval);
  }

  private getFromStorageOrDefault(key: string, defaultValue: any) {
    return window.localStorage.getItem(key) || defaultValue;
  }

  // The enqueue, startClock, and stopClock methods manage the sequencers
  // beat events. The approach here is *very naive*, and it's pretty gross
  // to have this logic tied into the Application component itself. Ideally
  // we would use a more capable and high-quality timing event class such
  // as the one provided by Tone.js: https://tonejs.github.io/docs/
  private enqueue() {
    // Increment the beat...
    let beat = this.state.currentBeat + 1;
    let bar = this.state.currentBar;

    // If the beat breaks out of the bar, increment the bar and reset the beat...
    if (beat > this.beatsPerBar) {
      beat = 1;
      bar++;
    }

    // If the bar breaks out of the song length or is invalid, reset it to 1...
    if (bar > this.state.bars || bar < 1) {
      bar = 1;
    }

    // Calculate the time until the next beat. Using setTimeout here is going
    // have some inherent variability as it's affected by other processes
    // occurring on the machine. Also, adjustments to the BPM won't take effect
    // until the current timeout is executed, so changes to slow beats will
    // have a lag.
    const next: number = 60 / this.state.bpm;
    this.clockTimeout = setTimeout(() => this.enqueue(), next * 1000);

    // Update the clock, advancing play head and triggering sounds:
    this.setState({
      currentBar: bar,
      currentBeat: beat
    });
  }

  private startClock() {
    this.enqueue();
  }

  private stopClock() {
    clearTimeout(this.clockTimeout);
  }

  render() {
    return (
      <div className={css.app}>
        <ToolBar
          bar={this.state.currentBar}
          beat={this.state.currentBeat}
          bpm={this.state.bpm}
          bars={this.state.bars}
          isPlaying={this.state.isPlaying}
          sequences={Object.keys(sequences).map(id => ({
            label: sequences[id].label,
            id
          }))}
          currentSequenceId={this.state.selectedSequenceId}
          onTogglePlayState={play => {
            if (play) {
              this.startClock();
            } else {
              this.stopClock();
            }
            this.setState((state, props) => {
              const isPlaying = !state.isPlaying;
              return { isPlaying };
            });
          }}
          onSetBPM={bpm => this.setState({ bpm })}
          onSetBars={bars => this.setState({ bars })}
          onSetSequence={id => {
            // Deep clone to keep from modifying the originals. Super basic,
            // but it works for now...
            const sequence = JSON.parse(JSON.stringify(sequences[id].beats));

            // Worth noting that we're not validating that `id` matches
            // anything, so we have possible empty track states...
            this.setState({
              selectedSequenceId: id,
              trackState: sequence
            });
          }}
        />
        <div className={css.tracks}>
          {Object.keys(this.state.trackState).map(label => {
            return (
              <Track
                key={`track-${label}`}
                label={label}
                bars={this.state.bars}
                currentBarIndex={this.state.currentBar}
                currentCellIndex={this.state.currentBeat}
                trackState={this.state.trackState[label]}
                onCellClick={(label, bar, cell) => {
                  // Clicking a cell toggles the track instrument. To
                  // accomplish this we copy existing state and add
                  // new triggers...
                  const state: ApplicationTrackState = {
                    ...this.state.trackState
                  };

                  // The instrument not have any triggers yet so we have to
                  // guard against the potentially empty object before
                  // togging the trigger...
                  if (!state[label]) {
                    state[label] = {};
                  }

                  // And same here for the Bar – there may be no triggers in
                  // this bar so we guard against that...
                  if (!state[label][bar]) {
                    state[label][bar] = {};
                  }

                  // And now we flip whatever is there (true|false|undefined)
                  // and save the updated track back to state:
                  state[label][bar][cell] = !state[label][bar][cell];
                  this.setState({ trackState: state });
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
