import {Component, OnInit} from '@angular/core';
import {ExerciseService} from "../../../../core/services/exercise.service";
import {ActivatedRoute} from "@angular/router";
import {Audit} from "../../../models/exercise";
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.css']
})
export class AuditComponent implements OnInit {

  exerciseService: ExerciseService;
  id: string | null | number;
  audit!: Audit;
  audioElement: HTMLAudioElement;

  constructor(exerciseService: ExerciseService, private route: ActivatedRoute, private fb: FormBuilder) {
    this.audioElement = new Audio();
    this.exerciseService = exerciseService;
    this.id = this.route.snapshot.params['id'];
  }

  audioForm = this.fb.group({
    data: this.fb.control('', Validators.required),
  })

  async ngOnInit(): Promise<void> {
    this.audit = await this.exerciseService.getExerciseByTypeAndId('audit', this.id);
    this.audioElement.src = this.audit.path;
  }

  audioPlaying: boolean = false;
  playAudio() {
    if (this.audioPlaying) {
      this.audioElement.pause();
    } else {
      this.audioElement.play();
    }
    this.audioPlaying = !this.audioPlaying;
  }

  async onSubmit() {
    try {
      const result = await this.exerciseService.solveExercise(43 ,this.id, 'audit', this.audioForm);
      this.success(result);
    } catch (error) {
      console.log(error);
    } finally {
      this.audioForm.reset();
    }
  }

  success(text:string){
    Swal.fire({
      title: 'Success',
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok',
      width: 600,
      padding: '3em',
      color: '#2B788B',
      background: '#F6F5F4'
    })
  }

}
