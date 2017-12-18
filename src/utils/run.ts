export default function run(cb: Function, args: any) {
  if (cb && typeof cb === 'function') {
    return cb(args);
  }
  return undefined;
}