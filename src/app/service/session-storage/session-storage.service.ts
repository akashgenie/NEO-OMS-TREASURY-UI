import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  generateRandomNumber() {
    const encodeName = Base64.encode('SessionId');
    const randomNumber = crypto.getRandomValues(new Uint8Array(32));
    const base64String = Base64.encode(String.fromCharCode(...randomNumber));

    this.addSessionStorageDataEncrypt(encodeName, base64String);
    return randomNumber;
  }

  addSessionStorageDataEncrypt(name: string, data: any) {
    if (data) {
      sessionStorage.setItem(name, JSON.stringify(data));
    }
  }
}
