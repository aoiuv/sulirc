// const protocol = 'v1';
export const EventTable = {
  "element.common.dragStart": "ds",
  "element.common.dragMove": "dm",
  "element.common.dragEnd": "de",
  penDown: "pd",
  penMove: "pm",
  penUp: "pu"
};

export const CodeTable = Object.keys(EventTable).reduce((memo, evt) => {
  const v = EventTable[evt];
  memo[v] = evt;
  return memo;
}, {});

export function compile(evt: any): string {
  const codeKey = evt.actionName;
  const code = EventTable[codeKey];
  switch (codeKey) {
    case "element.common.dragStart":
    case "element.common.dragMove":
    case "element.common.dragEnd":
      return `${code}:${evt.slideId}:${evt.id}:${evt.xAxis},${evt.yAxis}`;
    case "penDown":
    case "penMove":
    case "penUp":
      const style = evt.style;
      const point = evt.point;
      return `${code}:${evt.slideId}:${evt.id}:${point.x},${point.y}:${style.color}/${style.strokeWidth}/${style.opacity}/${style.globalCompositeOperation}`;
    default:
      return;
  }
}
export function interpret(code: string) {
  const keys = code.split(":");
  const eventKey = keys[0];
  const name = CodeTable[eventKey];
  const slideId = keys[1];
  const id = keys[2];

  switch (eventKey) {
    case "ds":
    case "dm":
    case "de": {
      const axis = keys[3].split(",").map(Number);

      return {
        actionName: name,
        slideId,
        id,
        xAxis: axis[0],
        yAxis: axis[1]
      };
    }
    case "pd":
    case "pm":
    case "pu": {
      const axis = keys[3].split(",").map(Number);
      const style = keys[4].split("/");
      const [color, strokeWidth, opacity, globalCompositeOperation] = style;

      return {
        actionName: name,
        slideId,
        id,
        point: {
          x: axis[0],
          y: axis[1]
        },
        style: {
          color,
          strokeWidth,
          opacity,
          globalCompositeOperation
        },
        strokeWidth,
        strokeColor: color
      };
    }
    default:
      return;
  }
}
