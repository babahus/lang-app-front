import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PseudoCryptService {

  protected key: string = environment.cryptoKey;

  encrypt(data: string): string {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
    }
    return btoa(result);
  }

  decrypt(data: string): string {
    const decodedData = atob(data);
    let result = '';
    for (let i = 0; i < decodedData.length; i++) {
      result += String.fromCharCode(decodedData.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
    }
    return result;
  }
}
