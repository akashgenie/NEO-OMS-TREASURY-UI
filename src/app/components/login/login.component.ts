import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { ClientmasterService } from 'src/app/service/clientmaster.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/service/shared.service';
import { Base64 } from 'js-base64';
import { EncryptionWrapperService } from 'src/app/service/encryption/encryption-wrapper.service';
import { SessionStorageService } from 'src/app/service/session-storage/session-storage.service';
import { APP_CONSTANTS } from 'src/app/app-constants';
import { MatButtonToggleDefaultOptions } from '@angular/material/button-toggle';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('loginText', { static: false }) loginText!: ElementRef;
  @ViewChild('otpText', { static: false }) otpText!: ElementRef;

  emails: any = [];
  inputText: any = [];
  showLogin = true;
  showOTP = true;
  showSuccess = false;
  showOTPBtn = false;
  showOTPBtnInitially = false;
  isLoginAttemptExpired: boolean = false;
  isInvalidUser: boolean = false;
  time = 29;
  initialTime = 29;

  fixedEmail = 'Admin@admin.com';
  fixedOTP = '123456';
  enteredEmail: string = '';
  enteredOTP: string = '';
  error: boolean = false;
  baseUrl = environment.baseUrl;
  logInForm!: FormGroup;
  otpForm!: FormGroup;
  userMail!: string;
  userInfo: any;
  userName!: string;
  loginFormSubmitted: boolean = false;
  loginValidation: boolean = false;
  otpFormSubmitted: boolean = false;
  otpValidation: boolean = false;
  azureTokenError: boolean = false;
  userCheckError: boolean = false;
  isOtpLogin: boolean = true;

  constructor(
    private http: HttpClient,
    private clientService: ClientmasterService,
    private authService: AuthService,
    private router: Router,
    private builder: FormBuilder,
    private sharedService: SharedService,
    private encryptionservice: EncryptionWrapperService,
    private sessionservice: SessionStorageService,
  ) {
    this.showLogin = true;
    this.showOTP = false;
    this.showSuccess = false;
  }

  ngOnInit() {
    this.createLoginForm();
    this.createOtpForm();
    this.checkForAzureToken();
  }

  ngAfterViewInit() {
    this.loginText.nativeElement.focus();
  }
  checkUserName() {
    this.userName =
      this.userInfo.firstname && this.userInfo.lastname
        ? `${this.userInfo.firstname} ${this.userInfo.lastname}`
        : '';
  }

  createLoginForm() {
    this.logInForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  createOtpForm() {
    this.otpForm = this.builder.group({
      otp: ['', [Validators.required]],
    });
  }

  verifyLogin() {
    if (this.otpForm.valid) {
      let formData = {
        emailId: this.logInForm.value.email,
        otpPassword: this.otpForm.value.otp,
      };
      this.authService.otpVerification(formData).subscribe((res: any) => {
        if (res) {
          this.sharedService.addSessionStorageData('personalInfo', res);
          this.userInfo = res;

          this.authService.getRoleAccess(this.userInfo.token).subscribe(
            (res: any) => {
              try {
                this.sharedService.addSessionStorageData('roleAccess', res);
                this.checkUserName();
                this.showLogin = false;
                this.showOTP = false;
                this.showSuccess = true;
              } catch (error) {
              } finally {
                this.sharedService.addSessionStorageData('roleAccess', res);

                setTimeout(() => {
                  this.router.navigateByUrl('/landing-page');
                }, 0);
              }
            },
            (error) => {
              this.router.navigateByUrl('/landing-page');
            },
          );
        }
      });
    } else {
      alert('Invalid OTP. Please try again.');
    }
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (emailPattern.test(this.enteredEmail)) {
      this.error = false;
      this.verifyEmail();
    } else {
      this.error = true;
    }
  }

  checkSessionId() {
    const sessionId = this.encryptionservice.getDecodedSessionId();
    if (!sessionId) {
      this.sessionservice.generateRandomNumber();
    }
  }

  verifyEmail() {
    this.loginFormSubmitted = true;

    if (this.logInForm.valid) {
      let formData = {
        Email: this.logInForm.value.email,
      };

      this.authService.CheckUserLogIn(formData).subscribe({
        next: (res: any) => {
          if (res?.body?.userExists === true && res?.body?.isAdLogin === true) {
            this.userCheckError = false;
            this.isOtpLogin = false;

            this.authService.samlLogin(this.logInForm.value.email);
          } else if (
            res?.body?.userExists === true &&
            res?.body?.isAdLogin === false
          ) {
            this.userMail = this.logInForm.value.email;
            this.isOtpLogin = true;
            let formData = {
              emailId: this.logInForm.value.email,
              otpPassword: 0,
            };

            this.authService.logIn(formData).subscribe(
              (response: any) => {
                this.emails = response;

                this.isInvalidUser = false;
                this.showLogin = false;
                this.showOTP = true;
                this.setbydefaultOTPVisible();
                this.showSuccess = false;
                this.loginFormSubmitted = false;
                setTimeout(() => {
                  this.otpText.nativeElement.focus();
                }, 0);
              },
              (error: any) => {
                if (error?.status == 500) {
                  this.isInvalidUser = true;
                }
              },
            );
          } else {
            this.userCheckError = true;
          }
        },
      });
    }
  }

  isInputMatchingEmail(): boolean {
    return this.emails.includes(this.inputText);
  }

  setOTPVisible() {
    this.showOTPBtn = true;
    let interval = setInterval(() => {
      if (this.time == 0) {
        clearInterval(interval);
        this.showOTPBtn = false;
        this.time = 29;
      } else {
        this.time--;
      }
    }, 1000);
  }

  setbydefaultOTPVisible() {
    this.showOTPBtnInitially = true;
    let interval = setInterval(() => {
      if (this.initialTime == 0) {
        clearInterval(interval);
        this.showOTPBtnInitially = false;
        this.initialTime = 29;
      } else {
        this.initialTime--;
      }
    }, 1000);
  }

  checkEmail(event: any) {
    if (event.target.value) {
      this.loginValidation = false;
      this.userCheckError = false;
      this.azureTokenError = false;
    } else {
      this.loginValidation = true;
    }
  }

  checkOTP(event: any) {
    if (event.target.value) {
      this.otpValidation = false;
    } else {
      this.otpValidation = true;
    }
  }

  checkForAzureToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token !== null) {
      if (!token || token.trim() === '') {
        this.router.navigate(['/login'], { replaceUrl: true });

        this.showLogin = true;
        this.showOTP = false;
        this.azureTokenError = true;
        return;
      }
      this.showLogin = false;
      this.showOTP = false;
      this.azureTokenError = false;

      this.authService.verifyAzureToken(token).subscribe({
        next: (res: any) => {
          if (!res || res.token == null) {
            this.router.navigate(['/login'], { replaceUrl: true });

            this.showLogin = true;
            this.showOTP = false;
            this.azureTokenError = true;
            return;
          }

          try {
            this.sharedService.addSessionStorageData('personalInfo', res);
            this.sharedService.addSessionStorageData('roleAccess', res);

            this.userInfo = res;
            this.checkUserName();
            this.showSuccess = true;
          } catch (error) {
          } finally {
            this.router.navigate(['/login'], { replaceUrl: true });

            setTimeout(() => {
              this.router.navigateByUrl('/landing-page');
            }, 0);
          }
        },
        error: (error: any) => {
          this.router.navigate(['/login'], { replaceUrl: true });

          this.showLogin = true;
          this.showOTP = false;
          this.azureTokenError = true;
        },
      });
    }
  }
}
