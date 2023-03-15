import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-component',
  templateUrl: './base-component.component.html',
  styleUrls: ['./base-component.component.css']
})
export class BaseComponent implements OnInit {

  isToggle : boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.isToggle =! this.isToggle;
  }

}
