function createFakeProgress({
  intervalTime = 30,
  minValue = 0,
  maxValue = 100,
  step = 0.1,
  callback = () => {}
}) {
  let progress = minValue;
  let current_progress = 0;
  let currentAlgo = "atan";
  const algo = {
    atan: () => {
      return Math.round((Math.atan(current_progress) / (Math.PI / 2)) * 100 * 1000) / 1000;
    },
    linear: () => {
      const tail = +Math.random().toFixed(3);
      return Math.min(maxValue, Math.round(progress + step) + tail);
    }
  };

  const interval = setInterval(() => {
    if (progress === maxValue) {
      clearInterval(interval);
    }
    callback && callback(progress);

    current_progress += step;
    progress = algo[currentAlgo]();
  }, intervalTime);

  return () => {
    currentAlgo = "linear";
    step = 1;
    intervalTime = 15;
  };
}

let delta = [];
const complete = createFakeProgress({
  callback(progress) {
    console.log(`progress: ${progress}`);
    if (progress === 0) {
      delta.push(Date.now());
    }
    if (progress === 100) {
      delta.push(Date.now());
      console.log(`cost time: ${delta[1] - delta[0]}ms`);
    }
  }
});

setTimeout(() => {
  console.log(`complete!`, new Date);
  complete();
}, 6000);
