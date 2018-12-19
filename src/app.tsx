import * as React from 'react';
import AceEditor from 'react-ace';

import { State } from './state';
import ResultsPane from './components/ResultsPane';

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace');

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace/mode/javascript');

// tslint:disable-next-line:no-require-imports no-var-requires
require('brace/theme/monokai');

// tslint:disable-next-line:no-require-imports no-var-requires
const tracery = require('tracery-grammar');

(window as any).tracery = tracery;

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
    this.state = { code, origin: 'origin', nodes: ['animal', 'emotion', 'origin'], results: [] };
  }

  componentDidMount = () => {
    this.onRefresh();
  }

  render() {
    return (
      <div>
        <ResultsPane
          results={this.state.results}
          origin={this.state.origin}
          nodes={this.state.nodes}
          onRefresh={this.onRefresh}
          onOriginChange={this.onOriginChange}
          onLockToggle={this.onLockToggle}
        />
        <AceEditor
          value={this.state.code}
          id='editor'
          mode='javascript'
          theme='monokai'
          debounceChangePeriod={1000}
          onChange={this.onChange}
          name='editor'
          editorProps={{ $blockScrolling: true }}
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
    return { ...state, results: newResults, nodes: Object.keys(grammar.symbols) };
  }

  onRefresh = () => {
    const results = this.calculateResults(this.state);
    this.setState(results);
  }

  onOriginChange = (origin: string) => {
    let newState = { ...this.state, origin };
    newState.results = newState.results.map(r => {
      r.locked = false;
      return r;
    });
    newState = this.calculateResults(newState);

    this.setState(newState);
  }

  onLockToggle = (resultIndex: number) => {
    const result = { ...this.state.results[resultIndex] };
    result.locked = !result.locked;

    const newResults = [...this.state.results];

    newResults[resultIndex] = result;

    this.setState({ ...this.state, results: newResults });
  }
}
