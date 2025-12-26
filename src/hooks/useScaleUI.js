import { useLayoutEffect, useRef } from "react";

export default function useScaleUI(baseW = 420, baseH = 820) {
  const appRef = useRef(null);
  const wrapperRef = useRef(null);

  useLayoutEffect(() => {
    const app = appRef.current;
    const wrapper = wrapperRef.current;
    if (!app || !wrapper) return;

    const scaleUI = () => {
      const { width: viewportW, height: viewportH } =
        wrapper.getBoundingClientRect();

      const scale = Math.min(viewportW / baseW, viewportH / baseH);

      app.style.transform = `scale(${scale})`;

      const scaledW = baseW * scale;
      const scaledH = baseH * scale;

      app.style.left = `${(viewportW - scaledW) / 2}px`;
      app.style.top = `${(viewportH - scaledH) / 2}px`;
    };

    scaleUI();

    const ro = new ResizeObserver(scaleUI);
    ro.observe(wrapper);

    window.addEventListener("orientationchange", scaleUI);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", scaleUI);
    };
  }, [baseW, baseH]);

  return { appRef, wrapperRef };
}
