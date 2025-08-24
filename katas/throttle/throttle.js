const throttle = (fn, duration, config = {}) => {
  let silenced = false,
    pending = false, lastArgs = null;

  const { leading = true, trailing = false } = config;

  return function (...args) {
    const context = this;

    if (silenced) {
      pending = true;
      lastArgs = args;
      return;
    }

    if (leading && !pending) {
      fn.apply(context, args);
      silenced = true;
    } else {
      pending = true;
      lastArgs = args;
    }

    setTimeout(() => {
      if (trailing && pending) {
        fn.apply(context, lastArgs);
        pending = false;
      }
      silenced = false;
    }, duration);
  };
};

module.exports = { throttle };
