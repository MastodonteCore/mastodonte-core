export function run(cb, args) {
  if (cb && typeof cb === 'function') {
    return cb(args);
  }
  return undefined;
}