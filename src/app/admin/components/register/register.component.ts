import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error: string | null = null;
  registrationPending = false;
  availableRoles = [
    { label: 'Viewer', value: 'viewer' },
    { label: 'Gallery Manager', value: 'gallery-manager' },
    { label: 'Admin', value: 'admin' },
  ];
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: this.fb.array(
        this.availableRoles.map(() => this.fb.control(false)),
        [this.minSelectedCheckboxes(1)]
      ),
    });
  }

  minSelectedCheckboxes(min = 1): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const totalSelected = (formArray as FormArray).controls
        .map((ctrl) => ctrl.value)
        .reduce((acc, selected) => (selected ? acc + 1 : acc), 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { name, email, password, roles } = this.registerForm.value;
    const selectedRoles = roles
      .map((checked: boolean, i: number) =>
        checked ? this.availableRoles[i].value : null
      )
      .filter((v: string | null) => v !== null);

    try {
      await this.authService.register(email, password, name, selectedRoles);
      this.authService.logout();
      this.registrationPending = true;
      this.registerForm.reset();
    } catch (err: any) {
      this.error = err.message || 'Registration failed';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
