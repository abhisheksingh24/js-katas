const { throttle } = require("./throttle"); // adjust path as needed

jest.useFakeTimers();

describe("throttle", () => {
  let fn, throttledFn;

  beforeEach(() => {
    fn = jest.fn();
  });

  test("should call function immediately (default leading=true)", () => {
    throttledFn = throttle(fn, 100);
    throttledFn("a");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });

  test("should not call function again within throttle window", () => {
    throttledFn = throttle(fn, 100);
    throttledFn("a");
    throttledFn("b");
    throttledFn("c");
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test("should call function again after throttle window passes", () => {
    throttledFn = throttle(fn, 100);
    throttledFn("a");
    jest.advanceTimersByTime(120);
    throttledFn("b");
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("b");
  });

  test("with leading=false, should not call immediately", () => {
    throttledFn = throttle(fn, 100, { leading: false });
    throttledFn("a");
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).not.toHaveBeenCalled(); // no trailing by default
  });

  test("with trailing=true and leading=false, should call at the end of window", () => {
    throttledFn = throttle(fn, 100, { leading: false, trailing: true });
    throttledFn("a");
    throttledFn("b");
    throttledFn("c");

    jest.advanceTimersByTime(99);
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("c"); // last args respected
  });

  test("with leading=true and trailing=true, should call both immediately and at end", () => {
    throttledFn = throttle(fn, 100, { leading: true, trailing: true });
    throttledFn("a");
    throttledFn("b");

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("b");
  });

  test("should only call once if invoked rapidly without trailing", () => {
    throttledFn = throttle(fn, 100, { leading: true, trailing: false });
    throttledFn("a");
    throttledFn("b");
    throttledFn("c");

    jest.advanceTimersByTime(200);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("a");
  });
});
