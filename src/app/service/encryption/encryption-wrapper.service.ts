import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../../app-constants';
import { AesdecryptionService } from '../decryption/aesdecryption.service';
import { v4 as uuidv4 } from 'uuid';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';
import { HttpHeaders } from '@angular/common/http';
import { Base64 } from 'js-base64';

@Injectable({
  providedIn: 'root',
})
export class EncryptionWrapperService {
  private sessionAesKey: any;
  private iv = CryptoJS.lib.WordArray.create(new Array(16).fill(0));
  sessionId: any;
  private readonly SESSION_ID_KEY = btoa('app_session_id');

  constructor(private aesService: AesdecryptionService) {
    this.initializeSessionId();
  }

  private initializeSessionId(): void {
    const existingSessionId = this.getStoredSessionId();
    if (existingSessionId) {
      this.sessionId = existingSessionId;
    } else {
      this.sessionId = this.generateSessionId();

      this.storeSessionId(this.sessionId);
    }
  }

  private storeSessionId(sessionId: Uint8Array): void {
    const base64SessionId = Base64.fromUint8Array(sessionId);
    sessionStorage.setItem(this.SESSION_ID_KEY, base64SessionId);
  }

  private getStoredSessionId(): Uint8Array | null {
    try {
      const base64SessionId = sessionStorage.getItem(this.SESSION_ID_KEY);
      if (!base64SessionId) return null;

      return Base64.toUint8Array(base64SessionId);
    } catch (error) {
      return null;
    }
  }

  generateSessionId(): Uint8Array {
    const randomNumber = crypto.getRandomValues(new Uint8Array(32));
    return randomNumber;
  }

  private formatAsCSharpByteArray(array: Uint8Array): string {
    const byteList = Array.from(array).join(', ');
    return byteList;
  }

  getSessionStorageDataEncrypt(name: string) {
    const value = sessionStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  }

  getDecodedSessionId(): Uint8Array | null {
    return this.getStoredSessionId();
  }

  aesEncrypt(data: string): string {
    if (!this.sessionId) {
      this.initializeSessionId();
    }

    const aesKeyBytes = this.sessionId.slice(0, 16);
    const ivVector = CryptoJS.lib.WordArray.create(aesKeyBytes);
    const aesKey = CryptoJS.lib.WordArray.create(this.sessionId);

    this.sessionAesKey = aesKey;
    const encrypted = CryptoJS.AES.encrypt(data, aesKey, {
      iv: ivVector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  aesSessionEncrypt(data: string): string {
    const sessionId = this.getDecodedSessionId();
    if (!sessionId) {
      this.initializeSessionId();
      return this.aesSessionEncrypt(data); // Retry with new sessionId
    }

    const aesKeyBytes = sessionId.slice(0, 16);
    const ivVector = CryptoJS.lib.WordArray.create(aesKeyBytes);
    const aesKey = CryptoJS.lib.WordArray.create(sessionId);

    const encrypted = CryptoJS.AES.encrypt(data, aesKey, {
      iv: ivVector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  aesSessionDecrypt(encryptedText: string): string {
    try {
      const sessionId = this.getDecodedSessionId();
      if (!sessionId) {
        return '';
      }

      const aesKeyBytes = sessionId.slice(0, 16);
      const ivVector = CryptoJS.lib.WordArray.create(aesKeyBytes);
      const aesKey = CryptoJS.lib.WordArray.create(sessionId);

      const decrypted = CryptoJS.AES.decrypt(encryptedText, aesKey, {
        iv: ivVector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const result = decrypted.toString(CryptoJS.enc.Utf8);
      if (!result) {
      }

      return result;
    } catch (error) {
      return '';
    }
  }

  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_ID_KEY);
    this.sessionId = null;
  }

  refreshSession(): void {
    this.sessionId = this.generateSessionId();
    this.storeSessionId(this.sessionId);
  }

  aesDecrypt(encryptedText: string, sessionId: any): string {
    const decodeEncryptData = atob(encryptedText);
    const aesKeyBytes = sessionId.slice(0, 16);

    const ivVector = CryptoJS.lib.WordArray.create(aesKeyBytes);
    const aesKey = CryptoJS.lib.WordArray.create(sessionId);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, aesKey, {
      iv: ivVector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  aesPasswordEncrypt(data: string, keyBytes: any): string {
    const aesPasswordKey = CryptoJS.enc.Utf8.parse(keyBytes);
    const encrypted = CryptoJS.AES.encrypt(data, aesPasswordKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  }

  aesPasswordDecrypt(encryptedText: string, keyBytes: any): string {
    const aesPasswordKey = CryptoJS.lib.WordArray.create(keyBytes);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, aesPasswordKey, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  rsaEncrypt(data: Uint8Array): string {
    const decryptedText = atob(APP_CONSTANTS.PUBLIC_KEY);

    const rsa = forge.pki.publicKeyFromPem(decryptedText);
    const encrypted = rsa.encrypt(data.toString(), 'RSA-OAEP');
    const originalString = this.rsaDecrypt(encrypted);
    return btoa(encrypted);
  }

  rsaDecrypt(encryptedText: string): string {
    const encryptedBytes = forge.util.decode64(encryptedText);
    const privateKeyConvert = atob(APP_CONSTANTS.PRIVATE_KEY);

    const privateKey = forge.pki.privateKeyFromPem(privateKeyConvert);
    const decrypted = privateKey.decrypt(encryptedBytes, 'RSAES-PKCS1-V1_5');
    return decrypted;
  }

  rsaEncryptSessionKey(): string {
    if (!this.sessionId) {
      this.initializeSessionId();
    }

    const decryptedText = atob(APP_CONSTANTS.PUBLIC_KEY);
    const publicKey = forge.pki.publicKeyFromPem(decryptedText);

    const binaryStr = String.fromCharCode(...this.sessionId);

    const encrypted = publicKey.encrypt(binaryStr, 'RSAES-PKCS1-V1_5');

    return forge.util.encode64(encrypted);
  }

  rsaDecryptSessionKey(encryptedBase64: string): Uint8Array {
    const decodeEncryptBase64 = atob(encryptedBase64);
    const privateKeyConvert = atob(APP_CONSTANTS.PRIVATE_KEY);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyConvert);

    const encryptedBytes = forge.util.decode64(encryptedBase64);

    const decryptedBinaryStr = privateKey.decrypt(
      encryptedBytes,
      'RSAES-PKCS1-V1_5',
    );

    const decryptedBytes = new Uint8Array(
      [...decryptedBinaryStr].map((c) => c.charCodeAt(0)),
    );
    return decryptedBytes;
  }

  prepareRequest(payload: any): { encryptedBody: any; headers: any } {
    const data = this.aesEncrypt(JSON.stringify(payload));

    const sessionIdEncrypted = this.rsaEncryptSessionKey();
    const userId = atob(APP_CONSTANTS.USER_ID);
    const actualPassword = atob(APP_CONSTANTS.ACTUAL_PASSWORD);
    const passwordKey = atob(APP_CONSTANTS.PASSWORD_ENCRYPTION_KEY);
    const requestId = uuidv4();

    const passwordRaw = `${actualPassword}:${requestId}`;

    const passwordEncrypted = this.aesPasswordEncrypt(passwordRaw, passwordKey);

    return {
      encryptedBody: btoa(
        JSON.stringify({
          data: data,
          sessionId: sessionIdEncrypted,
        }),
      ),
      headers: {
        'X-UserId': userId,
        'X-RequestId': requestId,
        'X-Password': passwordEncrypted,
      },
    };
  }

  prepareHeaders(): { headers: any } {
    const userId = atob(APP_CONSTANTS.USER_ID);
    const actualPassword = atob(APP_CONSTANTS.ACTUAL_PASSWORD);
    const passwordKey = atob(APP_CONSTANTS.PASSWORD_ENCRYPTION_KEY);
    const requestId = uuidv4();

    const passwordRaw = `${actualPassword}:${requestId}`;

    const passwordEncrypted = this.aesPasswordEncrypt(passwordRaw, passwordKey);

    return {
      headers: {
        'X-UserId': userId,
        'X-RequestId': requestId,
        'X-Password': passwordEncrypted,
      },
    };
  }

  decryptResponseObj(encryptedText: any) {
    const decodedJsonString = Base64.decode(encryptedText);
    const resObj = JSON.parse(decodedJsonString);

    const decryptSessionId = this.rsaDecryptSessionKey(resObj.sessionId);
    const decryptPayloadData = this.aesDecrypt(resObj.data, decryptSessionId);
    if (!decryptPayloadData || decryptPayloadData.trim() == '') {
      return null;
    }

    try {
      return JSON.parse(decryptPayloadData);
    } catch {
      return decryptPayloadData; // return string if not JSON
    }
  }

  decryptBlobObj(encryptedText: any) {
    const decodedJsonString = Base64.decode(encryptedText);
    const resObj = JSON.parse(decodedJsonString);

    const decryptSessionId = this.rsaDecryptSessionKey(resObj.sessionId);
    const decryptPayloadData = this.blobDecrypt(resObj.data, decryptSessionId);
    return decryptPayloadData;
  }

  binaryToBlob(binary: string, mimeType: string): Blob {
    const binaryString = binary;
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mimeType });
  }

  blobDecrypt(encryptedText: string, sessionId: any): any {
    const decodeEncryptData = atob(encryptedText);
    const aesKeyBytes = sessionId.slice(0, 16);

    const ivVector = CryptoJS.lib.WordArray.create(aesKeyBytes);
    const aesKey = CryptoJS.lib.WordArray.create(sessionId);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, aesKey, {
      iv: ivVector,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted;
  }

  wordArrayToBlob(
    wordArray: CryptoJS.lib.WordArray,
    mime = 'application/octet-stream',
  ): Blob {
    const byteArray = this.wordArrayToUint8Array(wordArray);
    return new Blob([byteArray], { type: mime });
  }

  wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;

    const u8 = new Uint8Array(sigBytes);
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    return u8;
  }
}
