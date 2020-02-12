export function compile(evt: any): string {
  const keys = evt.actionName.split(".");
  const codeKey = keys[2];
  switch (codeKey) {
    case "dragStart":
    case "dragMove":
    case "dragEnd":
      return `${codeKey}:${evt.slideId}:${evt.id}:${evt.xAxis},${evt.yAxis}`;
    default:
      return;
  }
}
export function interpret(code: string) {
  const keys = code.split(":");
  const eventKey = keys[0];

  switch (eventKey) {
    case "dragStart":
    case "dragMove":
    case "dragEnd":
      const axis = keys[3].split(",");
      return {
        actionName: `element.common.${eventKey}`,
        slideId: keys[1],
        id: keys[2],
        xAxis: axis[0],
        yAxis: axis[1]
      };
    default:
      return;
  }
}
