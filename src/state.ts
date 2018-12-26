export interface State {
  code: string;
  origin: string;
  nodes: string[];
  results: Result[];
  filepath?: string;
}

export interface Result {
  text: string;
  locked: boolean;
}