import { ApplicationTrackState } from './App';

export const fourOnTheFloor: ApplicationTrackState = {
  Kick: {
    '1': {
      '1': true
    },
    '2': {
      '1': true
    },
    '3': {
      '1': true
    },
    '4': {
      '1': true
    }
  },
  Snare: {
    '2': {
      '1': true
    },
    '4': {
      '1': true
    }
  },
  'Open HH': {
    '1': {
      '3': true
    },
    '2': {
      '3': true
    },
    '3': {
      '3': true
    },
    '4': {
      '3': true
    }
  },
  'Closed HH': {
    '1': {
      '1': true
    },
    '2': {
      '1': true
    },
    '3': {
      '1': true
    },
    '4': {
      '1': true
    }
  }
};

export const basic: ApplicationTrackState = {
  Kick: {
    1: {
      1: true
    },
    3: {
      1: true
    }
  },
  Snare: {
    2: {
      1: true
    },
    4: {
      1: true
    }
  },
  'Open HH': {},
  'Closed HH': {
    1: {
      3: true
    },
    2: {
      3: true
    },
    3: {
      3: true
    },
    4: {
      3: true
    }
  }
};

export const punk: ApplicationTrackState = {
  Kick: {
    '1': {
      '2': true,
      '4': true
    },
    '2': {
      '2': true,
      '4': true
    },
    '3': {
      '2': true,
      '4': true
    },
    '4': {
      '2': true,
      '4': true
    }
  },
  Snare: {
    '1': {
      '1': true,
      '3': true
    },
    '2': {
      '1': true,
      '3': true
    },
    '3': {
      '1': true,
      '3': true
    },
    '4': {
      '1': true,
      '3': true
    }
  },
  'Open HH': {
    '1': {
      '1': true,
      '3': true
    },
    '2': {
      '1': true,
      '3': true
    },
    '3': {
      '1': true,
      '3': true
    },
    '4': {
      '1': true,
      '3': true
    }
  },
  'Closed HH': {}
};

export const empty: ApplicationTrackState = {
  Kick: {},
  Snare: {},
  'Open HH': {},
  'Closed HH': {}
};

export const sequences: {
  [key: string]: { label: string; beats: ApplicationTrackState };
} = {
  fourOnTheFloor: {
    beats: fourOnTheFloor,
    label: 'Four on the Floor'
  },
  basic: {
    beats: basic,
    label: 'Basic'
  },
  punk: {
    beats: punk,
    label: 'Punk'
  },
  empty: {
    beats: empty,
    label: 'Empty'
  }
};
