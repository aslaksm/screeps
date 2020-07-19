# StateCharts

binge reading https://statecharts.github.io

thoughts:

Activities are long-running processes that can run upon entry into a state. An activity should be terminated when the state is left.
More importantly, an activity can be self-terminating: _If it terminates before leaving the state, it can issue events_. This is the missing piece that allows me to envision the harvester AI in terms of stateCharts. we would have something like:

-   Harvest compound state
    -   cold/init atom state
    -   move to atom state
    -   harvest atom state
-   Store compound state
    -   cold/init atom state
    -   move to store atom state
    -   store atom state

Transitions from move to -> harvest and move to -> store can be done with activities.
When entering move to, we start a `move to` activity. This activity would init a move and continually check if we were close enough to harvest. If we are, we fire off an event that transitions us to the harvest state. When harvesting, we would have a similar activity that would transition us to the store compound state.

in xstate (which i'll probably end up using), an activity is a function that
initiates some activity (as a side effect) and returns a function that stops that activity. It takes the context (what?) and the name of the activity.

A state machine can have a context (extended state) that can be altered during its lifetime. In our case, we'd mainly want the creep ID as state (and maybe the target source).
Events (cause of state transitions) are objects with a type that signifies the event. This means an event can have tons of additional data tacked on to it.

---

Having now created a crude machine for the harvester, there are basically 4 activities that need to be implemented:

-   moveHarvest
-   moveStore
-   harvest
-   store

moveHarvest and moveStore could conveivably be one function with the target given via
context/event data.

Just a thought... In the case of the harvester, each state has an activity and all events are spawned from activities, so it's entirely self-contained. Modelling this using statecharts seems kind of pointless.
Also, I'm not quite sure how activities even make sense in the context of screeps. No async code is allowed, and we run through the entire gameloop on every tick, so creating highly complex state objects that require functions to run at set intervals might be completely infeasible.

---

Reading: https://www.researchgate.net/publication/252047555_Component-based_hierarchical_state_machine_-_A_reusable_and_flexible_game_AI_technology

The way to go is probably to create a system that works within the confines of screeps. Components like moveTo could take a target and a maybe predicate transition function.

_Obviously, an object whose implementation is dependent on a special context cannot inhabit in other heterogeneous contexts. In the case of FSM, states created by ordinary OO technique tend to be coupled with their contexts (container state, NPC,or game environment) and cannot be composed into other heterogeneous contexts_.
