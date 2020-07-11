# State machine spec

So the state machine idea for balancing creeps was a stupid idea. But for role logic a state machine is probably still the way to go.

Lets examine the workings of the harvester.

- Initial state: not doing anything
- If personal storage is not full:
  - Try to harvest. If unable to harvest due to distance:
  - Move towards nearest source
- Otherwise (storage is full)
  - Find all storage structure that are not full (except for containers)
  - Try to store in nearest. If unable to store due to distance:
  - Move towards
  - If all storage is full, check containers as well

Two things I want to fix:

- Divide creeps evenly across all sources. Right now, all creeps move to the same source (nearest)
- Don't moveTo/attempt to harvest on every tick

Basically, the states are:

- Idle
- Harvest state
  - Idle
  - Move to source State
  - Harvest source State
- Store state
  - Idle
  - Move to storage State
  - Store in storage State

How would we design this? It could be a "flat" machine, where we have two harvest states and two store states, and transitions from both to both, but that wouldn't make a lot of sense.

If we instead define a nested state machine, how would it work?
We want a single function-call that updates the entire creep state.

Basically, we need to make the state machine callable. When the state machine
is called, it first checks if a state transition should occur.
Afterwards, it calls the handler of the state it is in. There should be nothing stopping
this handler from being a state machine as well.
