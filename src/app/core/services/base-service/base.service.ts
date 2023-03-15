import { Injectable } from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Audit, CompilePhrase, Dictionary} from "../../../main/models/exercise";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  protected url: string = environment.apiUrl;
  protected storage: Storage = window.localStorage;

  constructor(
    protected http: HttpClient,
    protected route: Router,
    protected router: ActivatedRoute,
  ) { }
}
