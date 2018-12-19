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
      onClick={this.toggleLock}>
      <FontAwesomeIcon icon={result.locked ? faLock : faLockOpen} />
    </button>;

    return <li
      key={`result-${index}`}>
      {lockButton}
      {result.text}
      <CopyButton text={result.text} />
    </li>;

  }

  toggleLock = () => {
    if (this.props.onLockToggle) {
      this.props.onLockToggle(this.props.index);
    }
  }
}
