import * as React from "react"
import { SVGProps } from "react"
const Loading = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    preserveAspectRatio="xMidYMid"
    style={{
      margin: "auto",
      background: "0 0",
      display: "block",
    }}
    className="text-primary"
    viewBox="0 0 100 100"
    {...props}
  >
    <circle
      cx={50}
      cy={50}
      r={32}
      fill="none"
      stroke="currentcolor"
      strokeDasharray="50.26548245743669 50.26548245743669"
      strokeLinecap="round"
      strokeWidth={8}
    >
      <animateTransform
        attributeName="transform"
        dur="1s"
        keyTimes="0;1"
        repeatCount="indefinite"
        type="rotate"
        values="0 50 50;360 50 50"
      />
    </circle>
  </svg>
)
export default Loading
