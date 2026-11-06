import { useId } from "react";
import { useDocumentVisible } from "./useDocumentVisible";
import "./NewtonCradle.css";

export function NewtonCradle() {
  const visible = useDocumentVisible();
  const gold = useId();
  return (
    <div className="lobby-cradle" aria-hidden="true" data-motion-paused={!visible || undefined}>
      <svg viewBox="0 0 260 176" focusable="false">
        <defs>
          <radialGradient id={gold} cx="32%" cy="28%" r="75%">
            <stop stopColor="#fff1b5" /><stop offset=".3" stopColor="#ffda71" />
            <stop offset=".8" stopColor="#e6a838" /><stop offset="1" stopColor="#ad7127" />
          </radialGradient>
        </defs>
        <path className="cradle-frame" d="M25 153V27Q25 18 34 18H226Q235 18 235 27V153" />
        <g>
          {Array.from({ length: 5 }, (_, index) => {
            const x = 70 + index * 30;
            return (
              <g className="cradle-arm" key={index} style={{ transformOrigin: `${x}px 21px` }}>
                <path className="cradle-string" d={`M${x} 21V101`} />
                <circle className="cradle-ball" cx={x} cy="114" r="15" fill={`url(#${gold}) #f0bd55`} />
              </g>
            );
          })}
        </g>
        <rect className="cradle-base" x="10" y="152" width="240" height="12" rx="6" />
      </svg>
    </div>
  );
}
