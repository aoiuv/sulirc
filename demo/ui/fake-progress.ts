/**
 * 伪进度组件（为了让用户有丝滑的加载错觉）
 *
 * by sulirc
 */

interface IFakeProgressOption {
  intervalTime?: number;
  step?: number;
  precision?: number;
  onProgressChange: (progress: number) => void;
}

export function createFakeProgress(option: IFakeProgressOption) {
  const { intervalTime = 30, step = 0.1, precision = 3, onProgressChange } = option;

  const MIN_VALUE = 0;
  const MAX_VALUE = 100;

  let _progress = MIN_VALUE;
  let _value = 0;
  let _algo = 'atan';
  let _step = step;
  let interval = null;

  const increaseAlgo = {
    atan: () => {
      /**
       * 使用反正切函数曲线模拟急速加载
       * 但此进度永远不会到达终点
       */
      const v = (Math.atan(_value) / (Math.PI / 2)) * 100;
      return Math.min(MAX_VALUE, +v.toFixed(precision));
    },
    linear: () => {
      /**
       * 线性微随机函数模拟尾部加载
       * 此进度会迅速到达终点
       */
      const factor = 2;
      const tail = +(Math.random() * factor).toFixed(precision);
      return Math.min(MAX_VALUE, Math.round(_progress + step) + tail);
    },
  };

  interval = setInterval(() => {
    if (_progress === MAX_VALUE) {
      clearInterval(interval);
    }
    onProgressChange && onProgressChange(_progress);

    _value += _step;
    _progress = increaseAlgo[_algo]();
  }, intervalTime);

  // 通过更改为线性算法，快速抵达终点
  return {
    finalize() {
      _algo = 'linear';
      _step = 1;
    },
    reset() {
      clearInterval(interval);
    }
  };
}
