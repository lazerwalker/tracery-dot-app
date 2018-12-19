import { clipboard } from 'electron';
import * as React from 'react';
import { Button } from 'reactstrap';

interface Props {
  text: string;
  style?: React.CSSProperties;
}

export default function (props: Props) {
  return <Button
    onClick={() => {
      clipboard.writeText(props.text);
    }}
    style={props.style || {}}
  >C</Button>;
}