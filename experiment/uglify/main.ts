import * as sample from "./sample";
import * as util from "./util";
import { compile, interpret, EventTable, CodeTable } from "./interpret";

const debug = require("debug")("uglify");
const stringify = (o: any) => JSON.stringify(o);

debug(EventTable);
debug(CodeTable);
const code = Object.keys(sample).map(key => {
  return compile(sample[key]);
});
debug("event => code", code);

const event = code.filter(Boolean).map(c => {
  return interpret(c);
});
debug("code => event", event);

debug(
  "event length: ",
  stringify({
    actionName: "element.common.dragEnd",
    slideId: "86069daa-a660-4f7a-b024-429e68ce4b48",
    id: "8fd1d343-a272-4eeb-90bc-d5ac0242e5f9",
    xAxis: "732",
    yAxis: "275"
  }).length
);

debug(
  "code length: ",
  "de:86069daa-a660-4f7a-b024-429e68ce4b48:8fd1d343-a272-4eeb-90bc-d5ac0242e5f9:732,275".length
);
