import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EncryptionWrapperService } from './service/encryption/encryption-wrapper.service';
import { SessionStorageService } from './service/session-storage/session-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'neo';

  private currentVersion: string = '';
  private checkInterval = 60000; // Check every 30 seconds

  constructor(
    private http: HttpClient,
    private sessionservice: SessionStorageService,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.sessionservice.generateRandomNumber();
    }, 1000);
  }
}
