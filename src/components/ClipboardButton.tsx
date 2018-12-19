import { clipboard } from 'electron';
import * as React from 'react';

interface Props {
  text: string;
}

export default function (props: Props) {
  return <button
    onClick={() => {
      clipboard.writeText(props.text);
    }}
    style={{
      position: 'absolute',
      left: 20,
      top: 0
    }}
  >C</button>;
}