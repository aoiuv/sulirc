import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} from 'tapable';

interface ICarHook {
  accelerate: SyncHook;
  brake: SyncHook;
  calculateRoutes: AsyncParallelHook;
}

class Car {
  hooks: ICarHook;

  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList'])
    };
  }

  setSpeed(newSpeed: number) {
    this.hooks.accelerate.call(newSpeed);
  }

  setBrake() {
    this.hooks.brake.call();
  }
}

const myCar = new Car();

// Use the tap method to add a consument
myCar.hooks.brake.tap('WarningLampPlugin', () => console.log('Warming lamp'));
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed: number) => console.log(`Accelerating to ${newSpeed}`));

myCar.setBrake();
myCar.setSpeed(100);

