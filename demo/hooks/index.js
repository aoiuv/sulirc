const { TNG, useState, useEffect, useReducer, useMemo, useCallback, useRef } = require('tng-hooks');

// console.log('TNG', TNG, typeof TNG);
function logger(v = 100) {
  return () => {
    const [counter, setCounter] = useState(v);
    setCounter(counter + 1);
    console.log(`[logger] ${counter}`);
  };
}

const TNG_logger = TNG(logger(50));

TNG_logger();
TNG_logger();
