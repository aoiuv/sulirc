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
  calculateRoutes: AsyncParallelHook;
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
      calculateRoutes: new AsyncParallelHook(['source', 'target', 'routesList'])
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
      console.log('routes', routes);

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

// Use the tap method to add a consument
myCar.hooks.brake.tap('WarningLampPlugin', () => console.log('kernel: Warming lamp'));
myCar.hooks.brake.tap('LoggerPlugin', () => console.log('Brake'));
myCar.hooks.accelerate.tap('LoggerPlugin', (newSpeed: number) => console.log(`Accelerating to ${newSpeed}`));

myCar.setBrake();
myCar.setSpeed(100);

const googleMap = (source: string, target: string) => {
  return new Promise(r => {
    setTimeout(() => {
      r(`source: ${source} - target: ${target}, ` + 'route:random/' + Math.random());
    }, 200);
  });
};

myCar.hooks.calculateRoutes.tapPromise('GoogleMapsPlugin', (source, target, routesList) => {
  return googleMap(source, target).then(route => {
    routesList.add(route);
    console.log('GoogleMapsPlugin', route);
  });
});
myCar.hooks.calculateRoutes.tapAsync('BingMapsPlugin', (source, target, routesList, callback) => {
  // bing.findRoute(source, target, (err, route) => {
  // 	if(err) return callback(err);
  // 	routesList.add(route);
  // 	// call the callback
  // 	callback();
  // });
});

// You can still use sync plugins
myCar.hooks.calculateRoutes.tap('CachedRoutesPlugin', (source, target, routesList) => {
  // const cachedRoute = cache.get(source, target);
  // if(cachedRoute)
  // 	routesList.add(cachedRoute);
});

(async () => {
  const ret = myCar.useNavigationSystemPromise('Guangdong', 'Shenzhen');
  myCar.useNavigationSystemPromise('Hunan', 'Shenzhen');

  setTimeout(() => {
    console.log('ret', ret);
  }, 1000);
})();
