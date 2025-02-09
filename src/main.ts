(() => {
  const swipercontainer =
    document.querySelector<HTMLDivElement>("#swiper-container");

  const swipercontent =
    document.querySelector<HTMLDivElement>("#swipeable-content");

  if (!swipercontainer) {
    return;
  }

  let is_transizing = false;
  let lastpointerx = 0;
  let leftOffset = 0;

  function onPointerMove(event: PointerEvent) {
    if (!swipercontent || is_transizing) {
      return;
    }

    const { offsetX } = event;
    const is_mouse = event.pointerType === "mouse";
    const step = is_mouse ? 1 : 4;
    const mindelta = is_mouse ? 1 : 2;
    const swipercontainer_rect = swipercontainer!.getBoundingClientRect();
    const deltaX = Math.abs(offsetX - lastpointerx);

    if (deltaX >= mindelta && deltaX < swipercontainer_rect.width) {
      leftOffset = Math.max(
        0,
        Math.min(
          leftOffset + (offsetX > lastpointerx ? step : -step),
          swipercontainer_rect.width
        )
      );

      swipercontent.style.transform = `translateX(${leftOffset}px)`;
    }

    lastpointerx = offsetX;
  }

  function adjustOffset() {
    const swipercontainer_rect = swipercontainer!.getBoundingClientRect();

    if (leftOffset > 0 && leftOffset < swipercontainer_rect.width) {
      leftOffset =
        leftOffset > swipercontainer_rect.width / 2
          ? swipercontainer_rect.width
          : 0;
      swipercontent!.style.transform = `translateX(${leftOffset}px)`;
      swipercontent!.setAttribute("transizing", "");
    }
  }

  function cleanUp() {
    lastpointerx = 0;
    swipercontainer!.onpointermove = null;
    swipercontainer!.onpointerup = null;
    swipercontainer!.onpointerleave = null;
  }

  function onPointerUp() {
    adjustOffset();
    cleanUp();
  }

  swipercontainer.addEventListener("dragstart", () => false);
  swipercontainer.addEventListener("pointerdown", (event) => {
    if (event.isPrimary) {
      setTimeout((v) => {});
      swipercontainer.setPointerCapture(event.pointerId);
      swipercontainer.onpointermove = onPointerMove;
      swipercontainer.onpointerup = onPointerUp;
    }
  });

  swipercontent?.addEventListener(
    "transitionstart",
    () => (is_transizing = true)
  );
  swipercontent?.addEventListener("transitionend", () => {
    is_transizing = false;
    swipercontent!.removeAttribute("transizing");
  });
})();
