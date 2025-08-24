const { debounce } = require("./debounce");

jest.useFakeTimers();

describe("debounce", () => {
  test("preserves the caller context", () => {
    const obj = {
      value: 42,
      getValue() {
        return this.value;
      },
    };

    const spy = jest.spyOn(obj, "getValue");

    const debounced = debounce(obj.getValue, 200); // defaults: leading=false, trailing=true

    debounced.call(obj);

    jest.runAllTimers();

    expect(spy).toHaveReturnedWith(42); // ✅ works with your code
  });

  test("trailing: executes after the delay", () => {
    const spy = jest.fn();
    const debounced = debounce(spy, 200); // trailing = true

    debounced();

    expect(spy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  test("leading: executes immediately and then blocks until delay", () => {
    const spy = jest.fn();
    const debounced = debounce(spy, 200, { leading: true, trailing: false });

    debounced(); // should fire immediately
    expect(spy).toHaveBeenCalledTimes(1);

    debounced(); // within 200ms, should be ignored
    jest.advanceTimersByTime(199);
    expect(spy).toHaveBeenCalledTimes(1);

    // after delay, a new call should be allowed
    jest.advanceTimersByTime(1);
    debounced();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
