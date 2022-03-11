let [xDown, yDown] = [null, null];

function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt, callback) {
  if (!xDown || !yDown) {
    return;
  }
  let [xUp, yUp] = [evt.touches[0].clientX, evt.touches[0].clientY];
  let [xDiff, yDiff] = [xDown - xUp, yDown - yUp];

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (callback) {
      if (xDiff > 0) {
        /* left swipe */
        callback[0]();
      } else {
        /* right swipe */
        callback[1]();
      }
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

export default function assignTouchE(el, callback) {
  el.addEventListener("touchstart", handleTouchStart, false);
  el.addEventListener(
    "touchmove",
    (e) => {
      handleTouchMove(e, callback);
    },
    false
  );
}
