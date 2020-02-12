export const EventTable = {
  dragStart: "ds",
  dragMove: "dm",
  dragEnd: "de"
};

export const CodeTable = Object.keys(EventTable).reduce((memo, evt) => {
  const v = EventTable[evt];
  memo[v] = evt;
  return memo;
}, {});

export function compile(evt: any): string {
  const keys = evt.actionName.split(".");
  const codeKey = keys[2];
  switch (codeKey) {
    case "dragStart":
    case "dragMove":
    case "dragEnd":
      return `${EventTable[codeKey]}:${evt.slideId}:${evt.id}:${evt.xAxis},${evt.yAxis}`;
    default:
      return;
  }
}
export function interpret(code: string) {
  const keys = code.split(":");
  const eventKey = keys[0];

  switch (eventKey) {
    case "ds":
    case "dm":
    case "de":
      const axis = keys[3].split(",");
      return {
        actionName: `element.common.${CodeTable[eventKey]}`,
        slideId: keys[1],
        id: keys[2],
        xAxis: axis[0],
        yAxis: axis[1]
      };
    default:
      return;
  }
}
