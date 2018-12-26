import * as React from 'react';
import { Result } from '../state';

import ListItem from './ListItem';
import ClipboardButton from './ClipboardButton';

import { Button } from 'reactstrap';
import OriginDropdown from './OriginDropdown';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

interface Props {
  results: Result[];
  origin: string;
  nodes: string[];
  onRefresh?: () => void;
  onOriginChange?: (origin: string) => void;
  onLockToggle?: (resultIndex: number) => void;
  renderHTML: boolean;
}

export default function (props: Props) {
  const results = props.results.map((r, i) => <ListItem result={r} index={i} onLockToggle={props.onLockToggle} renderHTML={props.renderHTML} />);
  const completeCopyText = props.results.map(r => r.text).join('\n');

  return <div id='render'>
    <div id='navbar'>
      <ClipboardButton
        style={{
          position: 'absolute',
          left: 20,
          top: 0
        }}
        text={completeCopyText} />
      <OriginDropdown origin={props.origin} nodes={props.nodes} onChange={props.onOriginChange} />

      <button
        onClick={props.onRefresh}
        style={{
          position: 'absolute',
          right: 20,
          top: 0
        }}
      >
        <FontAwesomeIcon icon={faSyncAlt} />
      </button>
    </div>
    <ul>{results}</ul>
  </div>;
}