/**
 * https://github.com/webpack/tapable
 */

import {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
  HookMap
} from 'tapable';

interface ICarHook {
  accelerate: SyncHook;
  brake: SyncHook;
  calculateRoutes: AsyncSeriesHook;
}

class List {
  routes = [];

  add(route: string) {
    this.routes.push(route);
  }

  getRoutes() {
    return this.routes;
  }
}

class Car {
  hooks: ICarHook;

  constructor() {
    this.hooks = {
      accelerate: new SyncHook(['newSpeed']),
      brake: new SyncHook(),
      calculateRoutes: new AsyncSeriesHook(['source', 'target', 'routesList'])
    };
  }

  setSpeed(newSpeed: number) {
    this.hooks.accelerate.call(newSpeed);
  }

  setBrake() {
    this.hooks.brake.call();
  }

  useNavigationSystemPromise(source: string, target: string) {
    const routesList = new List();
    return this.hooks.calculateRoutes.promise(source, target, routesList).then(res => {
      const routes = routesList.getRoutes();
      console.log('Total routes: ', routes);
      return routes;
    });
  }

  useNavigationSystemAsync(source: string, target: string, callback: any) {
    const routesList = new List();
    this.hooks.calculateRoutes.callAsync(source, target, routesList, (err: any) => {
      if (err) return callback(err);
      callback(null, routesList.getRoutes());
    });
  }
}

const myCar = new Car();

myCar.hooks.brake.tap('WarningLampPlugin', () => console.log('kernel: Warming lamp'));
myCar.hooks.brake.tap('LoggerPlugin', () => console.log('Brake'));
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed: number) => console.log(`Accelerating to ${newSpeed}`));

myCar.setBrake();
myCar.setSpeed(100);

const googleMap = (source: string, target: string) => {
  return new Promise(r => {
    setTimeout(() => {
      r(`Google Map: from ${source} - to ${target}, ` + 'route:random/' + Math.random());
    }, 1000);
  });
};

const bingMap = (source: string, target: string, callback) => {
  setTimeout(() => {
    callback(null, `Bing Map: from ${source} - to ${target}, ` + 'route:random/' + Math.random());
  }, 1000);
};

const cacheMap = new Map();

myCar.hooks.calculateRoutes.tapPromise('GoogleMapsPlugin', (source, target, routesList) => {
  return googleMap(source, target).then(route => {
    routesList.add(route);
    console.log('GoogleMapsPlugin' + Date.now(), route);
  });
});

myCar.hooks.calculateRoutes.tapAsync('BingMapsPlugin', (source, target, routesList, callback) => {
  bingMap(source, target, (err, route) => {
    if (err) {
      return callback(err);
    }
    routesList.add(route);
    console.log('BingMapsPlugin' + Date.now(), route);
    callback();
  });
});

// You can still use sync plugins
myCar.hooks.calculateRoutes.tap('CachedRoutesPlugin', (source, target, routesList) => {
  const key = `${source}-${target}`;
  const cachedRoute = cacheMap.get(key);
  if (cachedRoute) {
    routesList.add(cachedRoute);
  }
});

(async () => {
  const r1 = await myCar.useNavigationSystemPromise('Guangdong', 'Shenzhen');
  const r2 = await myCar.useNavigationSystemPromise('Hunan', 'Shenzhen');

  // console.log(r1, r2);
})();
