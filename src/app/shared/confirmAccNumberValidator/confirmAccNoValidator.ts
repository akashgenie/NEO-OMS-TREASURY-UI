import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
  FormGroup,
  Validators,
} from '@angular/forms';

export function ConfirmAccNoValidator(
  controlName: string,
  matchingControlName: string,
) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors['confirmAccNoValidator']
    ) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmAccNoValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function UniqueAccountNumberValidator(
  bankDetailsArray: FormArray,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const accountNo = control.value;
    if (!bankDetailsArray || bankDetailsArray.length === 0) {
      return null;
    }
    const duplicateAccount = bankDetailsArray.controls.some(
      (bankGroup: AbstractControl) => {
        const existingAccountNo = bankGroup.get('accountNo')?.value;
        return existingAccountNo === accountNo;
      },
    );
    return duplicateAccount ? { duplicateAccountNo: true } : null;
  };
}
export function matchValidator(
  controlName: string,
  matchingControlName: string,
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) {
      return null;
    }

    if (matchingControl.errors && !matchingControl.errors['match']) {
      return null;
    }

    if (control.value === matchingControl.value) {
      matchingControl.setErrors({ match: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}

export function NonConfirmAccNoValidator(
  controlName: string,
  matchingControlName: string,
) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName];
    if (
      matchingControl.errors &&
      !matchingControl.errors['nonConfirmAccNoValidator']
    ) {
      return;
    }
    if (
      control.value !== matchingControl.value &&
      (control.value != '' || matchingControl.value != '')
    ) {
      matchingControl.setErrors({ nonConfirmAccNoValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function ConfirmFatherNameValidator(
  pan: string,
  fatherName: string,
  partC: boolean,
) {
  return (formGroup: FormGroup) => {
    const regex: RegExp = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;

    setTimeout(() => {
      const panControl: any = formGroup?.get(pan);
      const fatherNameControl: any = formGroup?.get(fatherName);

      if (panControl.value && regex.test(panControl.value.toUpperCase())) {
        fatherNameControl.clearValidators();
      } else if (partC) {
        fatherNameControl.addValidators(Validators.required);
      }

      fatherNameControl.updateValueAndValidity();
    }, 500);
  };
}
