import {Audit, CompilePhrase, Dictionary} from "./exercise";

export interface AttachedExercise {
  dictionary_exercise : Dictionary[],
  compilePhrase_exercise : CompilePhrase[],
  audit_exercise : Audit[]
}
