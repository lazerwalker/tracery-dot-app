import * as React from 'react';
import AceEditor from 'react-ace';

import { State } from './state';
import ResultsPane from './components/ResultsPane';
import { ipcRenderer } from 'electron';
import { TraceryFile } from './fileIO';

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
  aceRef: React.Ref;

  constructor(props: any) {
    super(props);

    const rawGrammar = {
      'origin': ['Welcome to Tracery.app! We\'re so #adjective# you\'re using it.'],
      'adjective': [
        'excited',
        'thrilled',
        'happy'
      ]
    };

    const grammar = tracery.createGrammar();
    grammar.addModifiers(tracery.baseEngModifiers);
    const code = JSON.stringify(rawGrammar, null, 2);
    this.state = { code, origin: 'origin', nodes: ['origin', 'adjective'], results: [], wordWrap: true, htmlRendering: true };

    this.aceRef = React.createRef();
  }

  componentDidMount = () => {
    this.onRefresh();

    ipcRenderer.on('open', this.loadFile);
    ipcRenderer.on('save', this.saveFile);
    ipcRenderer.on('didSave', this.didSave);
    ipcRenderer.on('toggleWordWrap', this.toggleWordWrap);
    ipcRenderer.on('toggleHTMLRendering', this.toggleHTMLRendering);
    ipcRenderer.on('refresh', this.onRefresh);

    ipcRenderer.send('ready');
  }

  componentWillUnmount = () => {
    ipcRenderer.removeListener('open', this.loadFile);
    ipcRenderer.removeListener('save', this.saveFile);
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
          renderHTML={this.state.htmlRendering}
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
          ref={this.aceRef}
          wrapEnabled={this.state.wordWrap}
        />;
      </div >
    );
  }

  //

  loadFile = (_: any, file: TraceryFile) => {
    console.log(file);
    this.setState({ ...this.state, filepath: file.filepath, code: file.data });
  }

  saveFile = () => {
    const value = this.aceRef.current.editor.getValue();
    console.log('Received save! Saving back', value);

    const f: TraceryFile = {
      filepath: this.state.filepath!,
      data: value
    };

    ipcRenderer.send('save', f);
  }

  didSave = (_: any, file: TraceryFile) => {
    this.setState({ ...this.state, filepath: file.filepath });
  }

  onChange = (newValue: string) => {
    // TODO: Add in Redux
    console.log('change', newValue);
    let newState = this.calculateResults({ ...this.state, code: newValue });
    this.setState(newState);
  }

  calculateResults = (state: State) => {
    const { origin, results } = state;
    const code = this.aceRef.current.editor.getValue();

    const grammar = tracery.createGrammar(JSON.parse(code));
    grammar.addModifiers(tracery.baseEngModifiers);

    const newResults = [...results];

    for (let i = 0; i < 10; i++) {
      if (newResults[i] && newResults[i].locked) {
        continue;
      }

      const text = grammar.flatten('#' + origin + '#');

      if (!newResults[i]) {
        newResults[i] = { locked: false, text };
      } else {
        newResults[i].text = text;
      }
    }

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

  toggleWordWrap = () => {
    this.setState({ ...this.state, wordWrap: !this.state.wordWrap });
  }

  toggleHTMLRendering = () => {
    this.setState({ ...this.state, htmlRendering: !this.state.htmlRendering });
  }
}
