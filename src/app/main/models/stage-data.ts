import {Exercise} from "./exercise";

export interface StageData {
  title: string;
  description: string;
  id: number;
  stage_exercises: Exercise[];
  isClicked: boolean
}
