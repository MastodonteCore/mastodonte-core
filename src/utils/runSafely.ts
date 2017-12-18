export default function runSafely(fn: Function) {
  try {
    return fn();
  } catch (e) {
    return console.log(e.message);
  }
};