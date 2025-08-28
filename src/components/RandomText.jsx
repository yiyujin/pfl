import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RandomText({ txt, fontSize }) {
  const containerRef = useRef(null);
  const stripRefs = useRef([]);

  const sec = 10;
  const stripLengths = [4, 4, 4, 4];
  const staggerFrames = 0.15;

  // 🔹 Convert CSS variable (e.g. "var(--stats-font-size)") into a number
  const resolveFontSize = (fontSize) => {
    if (typeof fontSize === "string" && fontSize.startsWith("var(")) {
      const rootStyle = getComputedStyle(document.documentElement);
      const cssVar = fontSize.slice(4, -1).trim(); // extract --stats-font-size
      const value = rootStyle.getPropertyValue(cssVar).trim();
      return parseFloat(value); // return as number
    }
    return parseFloat(fontSize); // if already a number or px string
  };

  const fontSizeNum = resolveFontSize(fontSize);

  const randomChar = () => {
    const chars = "0123456789";
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };

  const generateStripsData = () => {
    return Array.from(txt).map((char, i) => {
      const length = stripLengths[i] || 4;
      const chars = [char];
      for (let j = 0; j < length - 1; j++) chars.push(randomChar());
      return chars;
    });
  };

  const stripsData = useRef(generateStripsData());

  useEffect(() => {
    const animateStrip = (strip, i, data) => {
      gsap.fromTo(
        strip,
        { y: -fontSizeNum * (data[i].length - 1) },
        { y: 0, duration: 1, ease: "expo.out" }
      );
    };

    const runAnimation = () => {
      stripsData.current = generateStripsData();

      stripRefs.current.forEach((strip, i) => {
        if (strip && stripsData.current[i]) {
          const spans = strip.querySelectorAll("span");
          spans.forEach((span, j) => {
            if (stripsData.current[i][j] !== undefined) {
              span.textContent = stripsData.current[i][j];
            }
          });

          setTimeout(() => {
            animateStrip(strip, i, stripsData.current);
          }, i * staggerFrames * 1000);
        }
      });
    };

    runAnimation();
    const interval = setInterval(runAnimation, sec * 1000);
    return () => clearInterval(interval);
  }, [txt, fontSizeNum, sec]);

  return (
    <div
      ref={containerRef}
      style={{
        height: fontSizeNum,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {stripsData.current.map((chars, i) => (
        <div
          key={i}
          style={{
            width: fontSizeNum * 0.45 + "px",
            height: fontSizeNum + "px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            ref={(el) => (stripRefs.current[i] = el)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "Barlow Condensed",
              fontWeight: 700,
              fontSize: fontSizeNum + "px",
              color: "white",
              lineHeight: 1,
            }}
          >
            {chars.map((c, j) => (
              <span
                key={j}
                style={{ display: "block", height: fontSizeNum + "px" }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
