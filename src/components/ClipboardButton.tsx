import { clipboard } from 'electron';
import * as React from 'react';
import { Button } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList } from '@fortawesome/free-solid-svg-icons';

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
  ><FontAwesomeIcon icon={faClipboardList} /></Button>;
}