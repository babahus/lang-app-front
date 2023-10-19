export interface Exercise {
  id: number;
  [key: string]: any;
}

export interface Audit {
  id : number
  path : string
  text : string
  solved : boolean
}

export interface Pair {
  id : number;
  options: PairOption[];
}

export interface PairOption {
  word: string;
  translation: string;
}

export interface Picture {
  id: number;
  options: PictureOption[];
  path: string;
}

export interface PictureOption {
  text: string;
  is_correct: boolean;
}

export interface Sentence {
  id: number;
  sentence_with_gaps: string;
  correct_answers_json: string[];
}


export interface CompilePhrase {
  id : number
  phrase : string
  solved : boolean
}

export interface Dictionary {
  id : number;
  data : any[];
  solved : boolean
}
