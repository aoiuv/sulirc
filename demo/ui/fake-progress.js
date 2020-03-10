function createFakeProgress({
  intervalTime = 30,
  minValue = 0,
  maxValue = 100,
  step = 0.1,
  complete = () => {}
}) {
  let progress = minValue;
  let value = 0;
  let algo = "atan";
  const increaseAlgo = {
    atan: () => {
      return Math.round((Math.atan(value) / (Math.PI / 2)) * 100 * 1000) / 1000;
    },
    linear: () => {
      const factor = 2;
      const tail = +(Math.random() * factor).toFixed(3);
      return Math.min(maxValue, Math.round(progress + step) + tail);
    }
  };

  const interval = setInterval(() => {
    if (progress === maxValue) {
      clearInterval(interval);
    }
    complete && complete(progress);

    value += step;
    progress = increaseAlgo[algo]();
  }, intervalTime);

  return () => {
    algo = "linear";
    step = 1;
  };
}

////////////////////////////////
const complete = createFakeProgress({
  complete(progress) {
    console.log(`progress... ${progress}%`);
    if (progress === 0) {
      console.time(`FakeProgress`);
    }
    if (progress === 100) {
      console.timeEnd(`FakeProgress`);
    }
  }
});

setTimeout(() => {
  console.log(`real complete!`, new Date());
  complete();
}, 5000);
