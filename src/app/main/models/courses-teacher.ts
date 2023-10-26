export interface ProgressExercise {
    accounts_exercise_id: number;
    course_id: number;
    exercise: Exercise;
    id: number;
    solved: number;
    solved_at: string;
    user: User;
}

export interface Exercise {
    id: number;
    sentence_with_gaps: string;
    correct_answers_json: string[];
}

export interface User {
    id: number;
    email: string;
    name: string;
}

export interface Data {
    id: number;
    sentence_with_gaps: string;
    correct_answers_json: string[];
}

export interface TypeData {
    data: Data[];
    id: number;
    progress_exercises: ProgressExercise[];
    type: string;
}
