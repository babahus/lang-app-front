import {Exercise} from "../pages/exercises/exercises.component";

export interface CourseStage {
  id: number;
  title: string;
  description: string;
  stage_exercises: Exercise[];
  isClicked: boolean;
}
