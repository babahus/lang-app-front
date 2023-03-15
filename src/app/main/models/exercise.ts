export interface Audit {
  id : number
  path : string
  text : string
  solved : boolean
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
