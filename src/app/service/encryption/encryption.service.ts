import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root',
})
export class EncryptionModel {
  jsonObject!: string;
  clientPublicKey!: string; // PEM format
  ownPrivateKey!: string; // Optional for signing, not used here
}

export class EncryptionResponse {
  encryptedString!: string;
}

export class EncryptedPacket {
  data!: string;
  sessionId!: string;
}

export class EncryptionService {
  constructor() {}

  async encryptContent(model: EncryptionModel): Promise<EncryptionResponse> {
    const jsonData = model.jsonObject;

    const jsonBytes = new TextEncoder().encode(jsonData);

    const sessionKey = forge.random.getBytesSync(32);

    const ivVector = sessionKey.substring(0, 16); // first 16 bytes

    const aesEncrypted = this.aesEncrypt(jsonBytes, sessionKey, ivVector);

    const encryptedSessionKey = this.rsaEncryptSessionKey(
      sessionKey,
      model.clientPublicKey,
    );

    const hmac = forge.hmac.create();
    hmac.start('sha256', sessionKey);
    hmac.update(aesEncrypted + ivVector); // mimic Combine(data, iv)
    const hmacDigest = hmac.digest().toHex();

    const packet: EncryptedPacket = {
      data: btoa(aesEncrypted),
      sessionId: btoa(encryptedSessionKey),
    };

    const jsonPacket = JSON.stringify(packet);
    const finalBase64 = btoa(jsonPacket);

    return { encryptedString: `"${finalBase64}"` };
  }

  private aesEncrypt(data: Uint8Array, key: string, iv: string): string {
    const keyWordArray = CryptoJS.enc.Hex.parse(forge.util.bytesToHex(key));
    const ivWordArray = CryptoJS.enc.Hex.parse(forge.util.bytesToHex(iv));

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.lib.WordArray.create(data),
      keyWordArray,
      {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  private rsaEncryptSessionKey(
    sessionKey: string,
    pemPublicKey: string,
  ): string {
    const publicKey = forge.pki.publicKeyFromPem(pemPublicKey);
    const encrypted = publicKey.encrypt(sessionKey, 'RSAES-PKCS1-V1_5');
    return encrypted;
  }
}
