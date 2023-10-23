import { Component, OnInit } from '@angular/core';
import { ExerciseService } from "../../../core/services/exercise.service";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {Exercise} from "../../models/exercise";

@Component({
  selector: 'app-attach-exercise',
  templateUrl: './attach-exercise.component.html',
  styleUrls: ['./attach-exercise.component.css']
})
export class AttachExerciseComponent implements OnInit {
  exerciseData: any;
  exerciseTypes: string[] = ['compile_phrase', 'audit', 'pair_exercise', 'picture_exercise', 'sentence'];
  selectedType: string = '';
  attachExerciseForm: FormGroup;
  totalPages: number = 1;
  currentPage: { [key: string]: number } = {};
  audioElement: HTMLAudioElement;

  constructor(private exerciseService: ExerciseService, private fb: FormBuilder) {
    this.audioElement = new Audio();
    this.attachExerciseForm = this.fb.group({
      selectedExercise: new FormControl([]),
    });
    this.currentPage = {
      'compile_phrase': 1,
      'sentence': 1,
      'audit': 1,
      'pair_exercise': 1,
      'picture_exercise': 1
    };
  }

  async ngOnInit() {

  }

  audioPlaying: boolean = false;
  audioStart(audit:string){
    console.log(audit);
    this.audioElement.src = audit;
    if (this.audioPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.audioPlaying = !this.audioPlaying;
  }

  changeSentence(sentence: string, answer: string[]) {
    if (answer) {
      let userSentence = sentence;

      answer.forEach((word: string) => {
        userSentence = userSentence.replace(word, "___");
      });

      return userSentence;
    } else {
      return sentence;
    }
  }

  async fetchExerciseData(type: string) {
    try {
      this.selectedType = type;
      const responseAttachedExercise = await this.exerciseService.getAttachedExerciseType(type);
      const responseExercise = await this.exerciseService.getExerciseData(type, this.currentPage[this.selectedType]);
      const combinedExercises = responseExercise.data.data.map((exercise: Exercise) => ({
        ...exercise,
        attached: responseAttachedExercise.data.data.some((studentExercise: Exercise) => studentExercise.id === exercise.id),
      }));

      this.exerciseData = combinedExercises;
      this.currentPage[this.selectedType] = responseExercise.data.pagination.current_page;
      this.totalPages = responseExercise.data.pagination.last_page;
    } catch (error) {
      console.log(error);
    }
  }

  goToPage(page: number, type:string) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage[type] = page;
      this.fetchExerciseData(this.selectedType);
    }
  }

  getPages(type:string) {
    const pagesToShow = 3;
    const pages = [];

    const startPage = Math.max(1, this.currentPage[type] - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + pagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  addSelectedExercise(exercise: any) {
    if (exercise.attached) {
      this.detachExerciseForUser(exercise.id, this.selectedType);
    } else {
      this.attachExerciseForUser(exercise.id, this.selectedType);
    }
  }

  async attachExerciseForUser(exerciseId: number, type: string) {
    try {
      const result = await this.exerciseService.attachExerciseForUser(exerciseId, type);
      if (result) {
        const exercise = this.exerciseData.find((ex: Exercise) => ex.id === exerciseId);
        if (exercise) {
          exercise.attached = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async detachExerciseForUser(exerciseId: number, type: string) {
    try {
      const result = await this.exerciseService.detachExerciseForUser(exerciseId, type);
      if (result) {
        const exercise = this.exerciseData.find((ex: Exercise) => ex.id === exerciseId);
        if (exercise) {
          exercise.attached = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
