import * as React from 'react';

// tslint:disable-next-line:no-require-imports no-var-requires
const tracery = require('tracery-grammar');

interface State {
  value: string;
}

export class App extends React.Component<{}, State> {
  state: State;

  constructor(props: any) {
    super(props);

    const grammar = tracery.createGrammar({
      'animal': ['panda', 'fox', 'capybara', 'iguana'],
      'emotion': ['sad', 'happy', 'angry', 'jealous'],
      'origin': ['I am #emotion.a# #animal#.'],
    });
    grammar.addModifiers(tracery.baseEngModifiers);
    const value = grammar.flatten('#origin#');
    this.state = { value };
  }

  render() {
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
        <h3>{this.state.value}</h3>
      </div>
    );
  }
}
