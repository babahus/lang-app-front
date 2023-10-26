export interface Exercise {
  header: string;
  description: string;
  creator: string;
  // add any other properties here
}

export interface CourseStage {
  id: number;
  title: string;
  description: string;
  stage_exercises: Exercise[];
  isClicked: boolean;
}
