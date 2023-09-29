import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.css']
})

export class AuthHeaderComponent extends HeaderComponent implements OnInit {



}
