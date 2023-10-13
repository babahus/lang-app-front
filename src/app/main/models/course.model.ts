import {CourseStage} from "./course-stage.model";

export interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  course_stages: CourseStage[];
}
