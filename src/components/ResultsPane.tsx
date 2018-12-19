import * as React from 'react';
import { Result } from '../state';

import ListItem from './ListItem';
import ClipboardButton from './ClipboardButton';

import { Button } from 'reactstrap';
import OriginDropdown from './OriginDropdown';

interface Props {
  results: Result[];
  origin: string;
  nodes: string[];
  onRefresh?: () => void;
  onOriginChange?: (origin: string) => void;
}

export default function (props: Props) {
  const results = props.results.map((r, i) => <ListItem result={r} index={i} />);
  const completeCopyText = props.results.map(r => r.text).join('\n');

  return <div id='render' style={{
    float: 'right',
    height: '100vh',
    width: '50vw'
  }}>
    <div
      id='navbar'
      style={{
        position: 'relative',
        textAlign: 'center'
      }}>
      <ClipboardButton
        style={{
          position: 'absolute',
          left: 20,
          top: 0
        }}
        text={completeCopyText} />
      <OriginDropdown origin={props.origin} nodes={props.nodes} onChange={props.onOriginChange} />

      <Button
        onClick={props.onRefresh}
        style={{
          position: 'absolute',
          right: 20,
          top: 0
        }}
      >R</Button>
    </div>
    <ul>{results}</ul>
  </div>;
}