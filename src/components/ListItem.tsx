import * as React from 'react';

import CopyButton from './ClipboardButton';
import { Result } from '../state';

interface Props {
  result: Result;
  index: number;
}

export default function (props: Props) {
  const { index, result } = props;

  return <li
    key={`result-${index}`}>
    {result.text}
    ({result.locked ? 'L' : 'U'})
    <CopyButton text={result.text} />
  </li>;

}
