import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent {
  @Input() completedExercises: number = 0;
  @Input() totalExercises: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  getPercentage(completed: number, total: number): number {
    if (total === 0) return 0;
    return (completed / total) * 100;
  }
}
