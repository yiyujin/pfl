import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function RandomText({ txt, fontSize }) {
  const containerRef = useRef(null);
  const stripRefs = useRef([]);

  const sec = 10;

  const stripLengths = [4, 4, 4, 4];
  const staggerFrames = 0.15;

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
        { y: -fontSize * (data[i].length - 1) },
        { y: 0, duration: 1, ease: "expo.out" }
      );
    };

    const runAnimation = () => {
      // Generate new random characters
      stripsData.current = generateStripsData();
      
      // Update the DOM with new characters and animate with stagger
      stripRefs.current.forEach((strip, i) => {
        if (strip && stripsData.current[i]) {
          const spans = strip.querySelectorAll('span');
          spans.forEach((span, j) => {
            if (stripsData.current[i][j] !== undefined) {
              span.textContent = stripsData.current[i][j];
            }
          });
          
          // Animate with stagger delay
          setTimeout(() => {
            animateStrip(strip, i, stripsData.current);
          }, i * staggerFrames * 1000);
        }
      });
    };

    // Initial animation
    runAnimation();

    // Repeat every `sec` seconds
    const interval = setInterval(runAnimation, sec * 1000);

    return () => clearInterval(interval);
  }, [txt, fontSize, sec]);

  return (
    <div
      ref={containerRef}
      style={{
        height: fontSize,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Strips with mask containers */}
      {stripsData.current.map((chars, i) => (
        <div
          key={i}
          style={{
            width: fontSize * 0.45 + "px",
            height: fontSize + "px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Animated inner strip */}
          <div
            ref={(el) => (stripRefs.current[i] = el)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontFamily: "Barlow Condensed",
              fontWeight: 700,
              fontSize: fontSize + "px",
              color: "white",
              lineHeight: 1,
            }}
          >
            {chars.map((c, j) => (
              <span key={j} style={{ display: "block", height: fontSize + "px" }}>
                {c}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}