import * as React from 'react';
import AceEditor from 'react-ace';

import { Linter } from 'eslint';
import * as _ from 'lodash';

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

  linter: Linter;

  constructor(props: any) {
    super(props);

    this.linter = new Linter();

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
    this.setState({ filepath: file.filepath, code: file.data });
  }

  saveFile = () => {
    let code = this.aceRef.current.editor.getValue();
    let newState = this.calculateResults({ ...this.state, code });

    const f: TraceryFile = {
      filepath: this.state.filepath!,
      data: newState.code
    };

    ipcRenderer.send('save', f);

    this.setState(newState);
  }

  didSave = (_: any, file: TraceryFile) => {
    this.setState({ filepath: file.filepath });
  }

  formatJSON = (oldCode: string) => {
    // TODO: This appears to work, but comma-dangle/style cause a TS error.
    // Either they're doing nothing, or the typing definitions need a PR.
    const options = {
      rules: {
        'comma-dangle': ['error', 'never'],
        'comma-style': ['error', 'last'],
        indent: ['error', 2, {
          ArrayExpression: 1,
          ObjectExpression: 1
        }],
        'quote-props': 1,
        quotes: 1
      }
    };

    let tempCode = `var foo = ${oldCode}`;

    const changes = this.linter.verify(tempCode, options);

    let editor = this.aceRef.current.editor;

    let cursorOffset = 0;

    const range = editor.selection.getRange();
    const cursor = range.end;

    changes.forEach((c: any) => {
      const text = c.fix.text;

      // Sigh, Ace is 0-indexed but ESLint is 1-indexed
      const start = { row: c.line - 1, column: c.column - 1 };

      // WARNING: Right now, none of our fixes will affect multiple lines. That might change.
      const originalLength = c.fix.range[1] - c.fix.range[0];
      const end = { row: c.line - 1, column: c.column - 1 + originalLength };

      if (start.row === cursor.row && start.column <= cursor.column) {
        if (cursor.column <= end.column) {
          // TODO: This is incorrect, but good enough for now
          const diff = text.length - originalLength;
          cursorOffset += Math.floor(diff / 2);
        } else {
          const diff = text.length - originalLength;
          cursorOffset += diff;
        }
      }
    });

    // TODO: Editing this in here is bad
    editor.selection.setSelectionRange({
      start: { row: range.start.row, column: range.start.column + cursorOffset },
      end: { row: range.end.row, column: range.end.column + cursorOffset }
    });

    // TODO: Running the linter twice is inefficient, but is easier for now so long as it's performant enough
    const messages = this.linter.verifyAndFix(tempCode, options);
    return messages.output.slice(10);
  }

  calculateResults = (state: State) => {
    let { origin, results } = state;

    const code = this.formatJSON(state.code);

    const grammar = tracery.createGrammar(JSON.parse(code));
    grammar.addModifiers(tracery.baseEngModifiers);

    const nodes = Object.keys(grammar.symbols);
    const newResults = [...results];

    if (!_.includes(nodes, origin)) {
      origin = nodes[0];
    }

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

    return { ...state, origin, results: newResults, nodes, code };
  }

  onRefresh = () => {
    const code = this.aceRef.current.editor.getValue();
    const newState = this.calculateResults({ ...this.state, code });
    this.setState(newState);
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
