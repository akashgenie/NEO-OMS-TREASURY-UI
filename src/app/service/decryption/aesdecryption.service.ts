import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { APP_CONSTANTS } from 'src/app/app-constants';

@Injectable({
  providedIn: 'root',
})
export class AesdecryptionService {
  private encryptionKey = CryptoJS.enc.Utf8.parse(
    atob(APP_CONSTANTS.PAN_ENCRYPTION_KEY),
  );
  private iv = CryptoJS.enc.Utf8.parse('\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0');

  decryptResponse(encryptedText: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedText,
        this.encryptionKey,
        {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: this.iv,
        },
      );

      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedText) {
      }

      return decryptedText;
    } catch (error) {
      return 'Decryption failed';
    }
  }
}
