import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../../../../core/services/exercise.service';
import { ActivatedRoute } from '@angular/router';
import { Pair, PairOption } from '../../../models/exercise';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pair',
  templateUrl: './pair.component.html',
  styleUrls: ['./pair.component.css'],
})
export class PairComponent implements OnInit {
  exerciseService: ExerciseService;
  id: string | null | number;
  pair!: Pair;
  words: string[] = [];
  translations: string[] = [];

  constructor(
    exerciseService: ExerciseService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.exerciseService = exerciseService;
    this.id = this.route.snapshot.params['id'];
  }

  pairForm = this.fb.group({
    data: this.fb.control(''),
  });

  async ngOnInit(): Promise<void> {
    this.pair = await this.exerciseService.getExerciseByTypeAndId(
      'pair_exercise',
      this.id
    );

    this.words = this.pair.options.map((option) => option.word);
    this.translations = this.pair.options.map((option) => option.translation);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.translations, event.previousIndex, event.currentIndex);
  }

  async checkAnswer() {
    try {
      this.pairForm.patchValue({
        data: JSON.stringify(
          this.words.map((word, index) => ({
            word,
            translation: this.translations[index],
          }))
        ),
      });

      const result = await this.exerciseService.solveExercise(
        72,
        this.id,
        'pair_exercise',
        this.pairForm
      );
      this.success(result);
    } catch (error) {
      console.log(error);
    }
  }

  success(text: string) {
    Swal.fire({
      title: 'Success',
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4',
    });
  }
}
