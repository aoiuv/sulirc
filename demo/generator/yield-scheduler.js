function step(v) {
  return v + 1;
}

function* longRunningTask(value1) {
  try {
    const value2 = yield step(value1);
    console.log('scheduler value: ', value2);
    const value3 = yield step(value2);
    console.log('scheduler value: ', value3);
    const value4 = yield step(value3);
    console.log('scheduler value: ', value4);
    const value5 = yield step(value4);
    console.log('scheduler value: ', value5);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}

function scheduler(task) {
  const g = task.next(task.value);

  if (!g.done) {
    task.value = g.value;
    scheduler(task);
  }
}

const initialValue = 0;
const gen = longRunningTask(initialValue);

scheduler(gen);