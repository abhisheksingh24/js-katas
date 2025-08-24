const debounce = (fn, delay, config = {}) => {
  let timeoutId = null;
  const { leading = false, trailing = true } = config;
  let isPending = false;

  return function (...args) {
    const context = this;
    isPending = true;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (leading && timeoutId === null) {
      fn.apply(context, args);
      isPending = false;
    }

    timeoutId = setTimeout(() => {
      if (trailing && isPending) {
        fn.apply(context, args);
        isPending = false;
      }
      timeoutId = null;
    }, delay);
  };
};

module.exports = { debounce };
