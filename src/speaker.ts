import { EventEmitter } from 'events';

/**
 * This is the super low tech "speaker" implementation. If I had more time
 * it could be wired up to arbitrary output devices.
 */
export class Speaker extends EventEmitter {
  play(sound: string): void {
    this.emit('play', sound);
  }
}

export const speaker = new Speaker();
