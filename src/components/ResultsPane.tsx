import * as React from 'react';
import { Result } from '../state';

import ListItem from './ListItem';
import ClipboardButton from './ClipboardButton';

interface Props {
  results: Result[];
  origin: string;
  onRefresh: (() => void);
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
      <h2>{props.origin}</h2>
      <button
        onClick={props.onRefresh}
        style={{
          position: 'absolute',
          right: 20,
          top: 0
        }}
      >R</button>
    </div>
    <ul>{results}</ul>
  </div>;
}