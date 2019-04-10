# JS-808

This is a very basic attempt at implementing the specification here: https://github.com/splice/js-808

![js808](https://user-images.githubusercontent.com/18332/55910131-7fdc2f00-5b92-11e9-862b-9f1a4cde320e.png)

## Install and run

```
yarn install
npm run start
```

The sequencer is running at http://localhost:3000

## Brainstorming

I spent the first bit of time thinking imperatively about how to build the sequencer. I imagined a configuration object containing tracks and beat state. An interval could work as a rudimentary clock. Every interval I could check where the "play head" is and play any sounds which hadn't been played on the previous interval. Problems with the idea became obvious immediately with how I'd have to keep track of which triggers were and weren't played, timing would sound off pretty fast, and a whole tone of basic low level time and state management was going to make it take too long.

I did a quick search, and as I suspected, many of these details have already been solved by open source libraries such as Tone.js. For the purposes of this exercise I thought I should work out a rudimentary version myself. In the real world, though, I would always opt for existing technology which solves the product need rather than re-inventing for the sake of re-invention.

Back to the problem at hand.

I realized I could skip over most of the challenges I was seeing if I approached the UI more declaratively. If I can create a rudimentary clock to manage timed events, I could serialize clock state into timing data, apply that state to the UI, and allow the UI to be a reflection of that clock, updating the visuals and triggering sounds arbitrarily based on any state. This would also allow the user to jump to any point in time and hot-swap track data.

## Technology choices

The sequencer is built using React, TypeScript, and CSS Modules, and Create React App.

### TypeScript

I've used TypeScript a lot lately in my current role of building out a living design system. It became valuable here as I worked through the various components. Much time was saved by getting early indications of missing and incorrect component props and arguments.

### React

I use React for my day to day work in my current role, so it was the natural choice for prototyping something quickly. I hadn't used the new React Hooks feature yet, so I gave it a go and learned that while building this project out. Once I had it almost to where I stopped I found there where some concepts I wasn't completely certain about yet, so I refactored the main Application component back into a React Component Class. It was a good learning experience, though.

### CSS Modules

CSS Modules allow the CSS to be coupled 1 to 1 with the components it is styling. I find this to be a good optimization over the classic approach to CSS of putting BEM or OOCSS in their own stylesheets. While that process works OK, the CSS usually drifts and becomes incorrect, entangled, and bloated. I've used other tools, such as Emotion and Styled Components, but that adds a whole other level of complexity. CSS Modules is straight-forward and easy to manage.

### Create React App

I opted to bootstrap the application with `create-react-app` because I didn't want to spend a large chunk of my time fiddling with with webpack configurations. It has built-in options to enable TypeScript and CSS Modules, which saved me a ton of time.

## Building the Sequencer

### Components

I started out by building the smallest component first: the `<Bar>` (with 4 beats per bar). I checked that it rendered as expected, then moved up the component tree to `<Bars>`, `<Track>`, and `<ToolBar>`.

Once these were wired up to pass state down the component tree I started implementing the event handlers handle cell clicks and set track triggers. Here I'm bubbling these events back up the component tree, including additional context state so that the top level component knows exactly what's clicked. For example, cell 3 of bar 2 of the Kick track operates like this:

- Bar#onCellClick(3) -> Bars#onCellClick(2, 3) -> Track#onCellClick('Kick', 2, 3) -> merge trigger into existing sequence.

This allows each component to have isolated knowledge of what it needs, and makes the components themselves quite simple and composable. There is a performance cost, which I'll come to later.

Next I started building out the toolbar to enable configuration of the sequencer parameters. This was rather basic – just wiring up HTML elements to state.

### Playing the Sequencer

The first piece of this work was to build some sort of clock implementation. I first opted to write a standalone `Clock` class, thinking that it could be a good abstraction for all of the isolated concerns of timing management. This _could_ possibly allow for the straight forward swapping out of the implementation with a more full featured and tested 3rd party dependency.

I wired up the clock to the Application component's setState method. Every time the internal state of the clock updated to a new beat setState would be called and the UI would advance as expected.

**Problems...**

This is where I realized a problem with how I was building. At the lowest level I'd been thinking about each bar having 4 beats per bar, and looking back at the instructions it very clearly states 8 beats per bar. I decided to leave the mistake in place and move ahead rather than rework the internals. It believe it would be fairly straight forward to address this issue, but not a good use of my remaining time.

This is also where deep component structure of my solution shows its limitations. Each track has a configurable number of bars, and each bar has four cells. Clock state is passed down the component tree, and every beat results in every `<Track>`, `<Bars>`, and `<Bar>` to compute its HTML output, even if no output is changing. I could implement React.memo to address _some_ of the issue, but I didn't have time to go down that route.

I ended up refactoring the clock functionality, opting to pull its logic directly into the Application component. I found that I was having to duplicate state between the two pieces of code and it seemed both unnecessary and overly complicated for the needs of this exercise. I've left the original `Clock.ts` code in place, but it is unused.

I think the UI performance problem is better addressed by rethinking the component structure so that there is a more sustainable grid abstraction. I imagine something like:

- The sequencer grid is a single component which renders track configuration data
- Because state isn't passed deep component tree, there are many fewer calculations and function calls per render
- Click events on each cell can be observed as bubbled up through even propagation, and metadata present on each cell can inform the handler about which was clicked.
- The play head can be its own component which updates based on clock state, rather than what it is now, which is that each cell is turned "on" when it sees that it is in the current play state.

### The Speaker

I ran out of time before I could get into the details of the speaker, so I opted to simply print sound events to the console.

### Tests

I didn't have time to get into testing, but with a real project I would have used Storybook to catalog the components and manage visual regressions, and probably mocha for basic unit tests.
