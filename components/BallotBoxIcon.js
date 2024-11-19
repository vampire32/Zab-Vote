import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export default function BallotBoxIcon({ size = 100, color = '#4834D4' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect
        x="20"
        y="30"
        width="60"
        height="40"
        fill={color}
        opacity="0.9"
      />
      <Path
        d="M35 20 L65 20 L65 35 L35 35 Z"
        fill={color}
        opacity="0.7"
      />
      <Path
        d="M45 25 L55 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Path
        d="M55 25 L45 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}