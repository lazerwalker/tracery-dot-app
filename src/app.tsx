import * as React from 'react';
import AceEditor from 'react-ace';

import CopyButton from './components/ClipboardButton';

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace');

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace/mode/javascript');

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace/theme/monokai');

// tslint:disable-next-line:no-require-imports no-var-requires
const tracery = require('tracery-grammar');

interface State {
  code: string;
  origin: string;
  results: Result[];
}

interface Result {
  text: string;
  locked: boolean;
}

export class App extends React.Component<{}, State> {
  state: State;

  constructor(props: any) {
    super(props);

    const rawGrammar = {
      'animal': ['panda', 'fox', 'capybara', 'iguana'],
      'emotion': ['sad', 'happy', 'angry', 'jealous'],
      'origin': ['I am #emotion.a# #animal#.'],
    };

    const grammar = tracery.createGrammar();
    grammar.addModifiers(tracery.baseEngModifiers);
    const code = JSON.stringify(rawGrammar, null, 2);
    this.state = { code, origin: 'origin', results: [] };
  }

  componentDidMount = () => {
    this.onRefresh();
  }

  render() {
    const results = this.state.results.map((r, i) => {
      return <li key={`result-${i}`}>{r.text} ({r.locked ? 'L' : 'U'}) <CopyButton text={r.text} /></li>;
    });

    const completeCopyText = this.state.results.map(r => r.text).join('\n');

    return (
      <div>
        <div id='render' style={{
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
            <CopyButton
              style={{
                position: 'absolute',
                left: 20,
                top: 0
              }}
              text={completeCopyText} />
            <h2>{this.state.origin}</h2>
            <button
              onClick={this.onRefresh}
              style={{
                position: 'absolute',
                right: 20,
                top: 0
              }}
            >R</button>
          </div>
          <ul>{results}</ul>
        </div>
        <AceEditor
          value={this.state.code}
          mode='javascript'
          theme='monokai'
          debounceChangePeriod={1000}
          onChange={this.onChange}
          name='editor'
          editorProps={{ $blockScrolling: true }}
          style={{
            float: 'left',
            height: '100vh',
            width: '50vw'
          }}
        />;
      </div >
    );
  }

  onChange = (newValue: string) => {
    // TODO: Add in Redux
    console.log('change', newValue);
    let newState = this.calculateResults({ ...this.state, code: newValue });
    this.setState(newState);
  }

  calculateResults = (state: State) => {
    const { code, origin, results } = state;
    const grammar = tracery.createGrammar(JSON.parse(code));
    grammar.addModifiers(tracery.baseEngModifiers);

    const newResults = [...results];

    for (let i = 0; i < 10; i++) {
      if (newResults[i] && newResults[i].locked) {
        continue;
      }

      // console.log(origin);
      const text = grammar.flatten('#' + origin + '#');

      if (!newResults[i]) {
        newResults[i] = { locked: false, text };
      } else {
        newResults[i].text = text;
      }
    }
    console.log(newResults);
    return { ...state, results: newResults };
  }

  onRefresh = () => {
    const results = this.calculateResults(this.state);
    this.setState(results);
  }
}
