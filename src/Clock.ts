/**
 * Attempts to be a sequencer clock, keeping track of the current state and
 * notifying via callback about the change in time.
 *
 * Unused!
 *
 * There are many, many, many issues with this class – it's a stinker.
 * I eventually got rid of it and merged the functionality directly into
 * the application component.
 */
export class Clock {
  private timeout: any;
  private beatsPerBar: number = 4;

  public currentBar: number = 0;
  public currentBeat: number = 0;

  constructor(
    public bpm: number,
    public bars: number,
    private callback: (bar: number, beat: number) => void
  ) {}

  private callbackAndQueue() {
    this.currentBeat++;

    if (this.currentBeat > this.beatsPerBar) {
      this.currentBeat = 1;
      this.currentBar++;
    }

    if (this.currentBar > this.bars) {
      this.currentBar = 1;
    }

    this.callback(this.currentBar, this.currentBeat);

    const next: number = 60 / this.bpm;
    this.timeout = setTimeout(() => this.callbackAndQueue(), next * 1000);
  }

  start() {
    if (this.currentBar < 1) {
      this.currentBar = this.bars + 1;
    }

    if (this.currentBeat < 1) {
      this.currentBeat = this.beatsPerBar + 1;
    }

    this.callbackAndQueue();
  }

  stop() {
    clearTimeout(this.timeout);
  }
}
