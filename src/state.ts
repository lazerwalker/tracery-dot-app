export interface State {
  code: string;
  origin: string;
  nodes: string[];
  results: Result[];
}

export interface Result {
  text: string;
  locked: boolean;
}