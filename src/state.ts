export interface State {
  code: string;
  origin: string;
  nodes: string[];
  results: Result[];
  filepath?: string;

  wordWrap: boolean;
  htmlRendering: boolean;
}

export interface Result {
  text: string;
  locked: boolean;
}