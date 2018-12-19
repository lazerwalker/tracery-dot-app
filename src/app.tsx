import * as React from 'react';

import AceEditor from 'react-ace';

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

  render() {
    const results = this.state.results.map((r, i) => {
      return <li key={`result-${i}`}>{r.text} ({r.locked ? 'L' : ''})</li>;
    });

    return (
      <div>
        <div id='render' style={{
          float: 'right'
        }}>
          <h2>Welcome to React with Typescript!</h2>
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
            float: 'left'
          }}
        />
      </div>
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
