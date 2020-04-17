function createMachine(machineDef) {
  function transition(state, type) {
    const stateDef = machineDef[state];
    const nextStateDef = stateDef.on[type];
    const value = nextStateDef.target;

    nextStateDef.action();
    machineDef[state].actions.onExit();
    machineDef[value].actions.onEnter();
    machine.value = value;

    return value;
  }

  const machine = {
    value: machineDef.initial,
    transition,
  };

  return machine;
}

function interpret(machine) {
  const service = {
    onTransition(callback) {
      callback(machine);
    },
    send() {
    },
    start() {

    }
  };

  return service;
}

/**
 * TODO state machine demo
 */
const togglerMachine = createMachine({
  initial: "inactive",
  inactive: {
    on: {
      TOGGLE: {
        target: "active",
        action() {
          console.log('transition action for "TOGGLE" in "active" state');
        },
      },
    },
    actions: {
      onEnter() {
        console.log("inactive: onEnter");
      },
      onExit() {
        console.log("inactive: onExit");
      },
    },
  },
  active: {
    on: {
      TOGGLE: {
        target: "inactive",
        action() {
          console.log('transition action for "TOGGLE" in "inactive" state');
        },
      },
    },
    actions: {
      onEnter() {
        console.log("active: onEnter");
      },
      onExit() {
        console.log("active: onExit");
      },
    },
  },
});

let state = togglerMachine.value;
console.log(`current state: ${state}`); // current state: off
state = togglerMachine.transition(state, "TOGGLE");
console.log(`current state: ${state}`); // current state: on
state = togglerMachine.transition(state, "TOGGLE");
console.log(`current state: ${state}`); // current state: off
