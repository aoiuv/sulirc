import * as sample from "./sample";
import * as util from "./util";
import { compile, interpret, EventTable, CodeTable } from "./protocol";

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

// debug(
//   "event length: ",
//   stringify({
//     actionName: "element.common.dragEnd",
//     slideId: "86069daa-a660-4f7a-b024-429e68ce4b48",
//     id: "8fd1d343-a272-4eeb-90bc-d5ac0242e5f9",
//     xAxis: "732",
//     yAxis: "275"
//   }).length
// );

// debug(
//   "code length: ",
//   "de:86069daa-a660-4f7a-b024-429e68ce4b48:8fd1d343-a272-4eeb-90bc-d5ac0242e5f9:732,275".length
// );

const eventJson = [
  {
    actionName: 'element.common.dragEnd',
    slideId: '86069daa-a660-4f7a-b024-429e68ce4b48',
    id: '8fd1d343-a272-4eeb-90bc-d5ac0242e5f9',
    xAxis: 732,
    yAxis: 275
  },
  {
    actionName: 'element.common.dragMove',
    slideId: '86069daa-a660-4f7a-b024-429e68ce4b48',
    id: 'fbb0b458-281a-4d59-89cd-6ce81f2f68d1',
    xAxis: 416,
    yAxis: 275
  },
  {
    actionName: 'element.common.dragStart',
    slideId: '86069daa-a660-4f7a-b024-429e68ce4b48',
    id: 'fbb0b458-281a-4d59-89cd-6ce81f2f68d1',
    xAxis: 416,
    yAxis: 275
  },
  {
    actionName: 'penDown',
    slideId: '39c0f340-b4a7-4985-813c-c4f069bc6106',
    id: '86929b1e-cf6f-4fa8-9efd-2d4df3d5f402',
    point: { x: 340, y: 470 },
    style: {
      color: '#FF1000',
      strokeWidth: '3',
      opacity: '1',
      globalCompositeOperation: 'source-over'
    },
    strokeWidth: '3',
    strokeColor: '#FF1000'
  },
  {
    actionName: 'penMove',
    slideId: '43ebeaaf79bb4f45878693560ce2c708',
    id: '6f5d7daa-3ec8-463c-a393-006d2eda6dc5',
    point: { x: 837, y: 643 },
    style: {
      color: '#FF1000',
      strokeWidth: '3',
      opacity: '1',
      globalCompositeOperation: 'source-over'
    },
    strokeWidth: '3',
    strokeColor: '#FF1000'
  },
  {
    actionName: 'penUp',
    slideId: '43ebeaaf79bb4f45878693560ce2c708',
    id: '6f5d7daa-3ec8-463c-a393-006d2eda6dc5',
    point: { x: 837, y: 643 },
    style: {
      color: '#FF1000',
      strokeWidth: '3',
      opacity: '1',
      globalCompositeOperation: 'source-over'
    },
    strokeWidth: '3',
    strokeColor: '#FF1000'
  }
];

const codeString = [
  'de:86069daa-a660-4f7a-b024-429e68ce4b48:8fd1d343-a272-4eeb-90bc-d5ac0242e5f9:732,275',
  'dm:86069daa-a660-4f7a-b024-429e68ce4b48:fbb0b458-281a-4d59-89cd-6ce81f2f68d1:416,275',
  'ds:86069daa-a660-4f7a-b024-429e68ce4b48:fbb0b458-281a-4d59-89cd-6ce81f2f68d1:416,275',
  'pd:39c0f340-b4a7-4985-813c-c4f069bc6106:86929b1e-cf6f-4fa8-9efd-2d4df3d5f402:340,470:#FF1000/3/1/source-over',
  'pm:43ebeaaf79bb4f45878693560ce2c708:6f5d7daa-3ec8-463c-a393-006d2eda6dc5:837,643:#FF1000/3/1/source-over',
  'pu:43ebeaaf79bb4f45878693560ce2c708:6f5d7daa-3ec8-463c-a393-006d2eda6dc5:837,643:#FF1000/3/1/source-over'
] 

debug('compare', JSON.stringify(eventJson).length, codeString.join('').length)