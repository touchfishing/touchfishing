export default function () {
  let [w, h] = [window.innerWidth, window.innerHeight];
  if (w <= 425) return false;
  if (w * 53 <= 29 * h) return false;
  return true;
}
