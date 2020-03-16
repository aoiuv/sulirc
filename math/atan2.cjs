const p1 = {
  x: 3,
  y: 4
};
const p2 = {
  x: 4,
  y: 3
};

const h = Math.sqrt(p1.x ** 2 + p1.y ** 2);
// radToDeg(Math.atan2(1, 0)) => Rad 90
// radToDeg(Math.atan2(0, 1)) => Rad 0
const deg1 = radToDeg(Math.atan2(p1.y, p1.x));
const deg2 = radToDeg(Math.atan2(p2.y, p2.x));
const delta = deg2 - deg1;

console.log('deg1:', deg1);
console.log('deg2:', deg2);
console.log('delta:', delta);

console.log('a, b, h', p1.x, p1.y, h);

const _deg2 = deg1 + delta;
const _x = Math.cos(degToRad(_deg2)) * h;
const _y = Math.sin(degToRad(_deg2)) * h;
console.log('_deg2:', _deg2);
console.log('_x:', _x);
console.log('_y:', _y);

function degToRad(deg) {
  return (deg / 180) * Math.PI;
}

function radToDeg(rad) {
  return (rad / Math.PI) * 180;
}
