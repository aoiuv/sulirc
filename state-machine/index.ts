// import './implemention';
import './loginMachine';
// import { createMachine, interpret } from "xstate";

// // Stateless machine definition
// // machine.transition(...) is a pure function used by the interpreter.
// const togglerMachine = createMachine({
//   id: "toggle",
//   initial: "inactive",
//   states: {
//     inactive: { on: { TOGGLE: "active" } },
//     active: { on: { TOGGLE: "inactive" } },
//   },
// });

// // const m1 = togglerMachine.transition('inactive', 'TOGGLE');
// // const m2 = togglerMachine.transition('active', 'TOGGLE');
// // console.log(m1.value, m2.value, m1 == m2);

// // Machine instance with internal state
// const toggleService = interpret(togglerMachine)
//   .onTransition((state) => console.log(state.value))
//   .start();

// toggleService.send("TOGGLE");
// // => 'active'

// toggleService.send("TOGGLE");
// // => 'inactive'
