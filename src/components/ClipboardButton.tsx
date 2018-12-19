import { clipboard } from 'electron';
import * as React from 'react';

interface Props {
  text: string;
  style?: React.CSSProperties;
}

export default function (props: Props) {
  return <button
    onClick={() => {
      clipboard.writeText(props.text);
    }}
    style={props.style || {}}
  >C</button>;
}