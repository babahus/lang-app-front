import {StageData} from "./stage-data";

export interface CourseData {
    title: string;
    description: string;
    id: number;
    price: number;
    course_stages: StageData[];
}
