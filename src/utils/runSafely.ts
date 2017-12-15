module.exports = function runSafely(fn) {
  try {
    return fn();
  } catch (e) {
    return console.log(e.message);
  }
};