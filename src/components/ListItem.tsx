import * as React from 'react';

import CopyButton from './ClipboardButton';
import { Result } from '../state';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

interface Props {
  result: Result;
  index: number;
  onLockToggle?: (resultIndex: number) => void;
}

export default class ListItem extends React.Component<Props, {}> {
  render = () => {
    const { index, result } = this.props;

    const lockButton = <button
      className='lock'
      onClick={this.toggleLock}>
      <FontAwesomeIcon icon={result.locked ? faLock : faLockOpen} />
    </button>;

    return <li
      className='result'
      key={`result-${index}`}>
      <CopyButton text={result.text} style={{ position: 'absolute', right: '10px' }} />
      {lockButton}
      <p>{result.text}</p>
    </li>;

  }

  toggleLock = () => {
    if (this.props.onLockToggle) {
      this.props.onLockToggle(this.props.index);
    }
  }
}
