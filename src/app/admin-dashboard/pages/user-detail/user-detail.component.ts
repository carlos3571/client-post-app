import { Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../users/services/user.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserImagePipe } from '../../../users/pipes/user-image.pipe';
import Swal from 'sweetalert2';
import { User } from '../../../users/interfaces/user.interface';


@Component({
  selector: 'user-detail',
  imports: [ReactiveFormsModule , UserImagePipe],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  user = input.required<User>();
  router = inject(Router);
  fb = inject(FormBuilder);
  previewIMG = false;
  previewURL: string | null = null;
  avatarFile: File | null = null;

  UserService = inject(UserService);

  userForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name:  ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    telephone:  ['', Validators.required],
    role_id:    ['', Validators.required],
    password:   [''],
    avatar:     [''],
  });
  
  ngOnInit(){
    this.userForm.patchValue({
      first_name: this.user().first_name,
      last_name:  this.user().last_name,
      email:      this.user().email,
      telephone:  this.user().telephone,
      role_id:    this.user()?.role_id ?? this.user().Role.id ?? 0,
      avatar:     this.user().avatar,
      password:   this.user().password,
    });
  }

  rolesResource = rxResource({
    request: ()=>({}),
    loader: ()=>{
      return this.UserService.getRoles();
    },
  });

  onSubmit(){
    //console.log({user: this.userForm.value})
    const isValid = this.userForm.valid;
    this.userForm.markAllAsTouched();

    if(!isValid) return 

    const formValue = this.userForm.value;

    if(this.user().id === 'new'){
      this.UserService.created(formValue).subscribe((resp)=>{
        if(this.avatarFile){
          this.UserService.uploadAvatar(resp.data.id, this.avatarFile).subscribe((resp)=>{
            Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'User created',
            showConfirmButton: false,
            timer: 1500,
        });
          });
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User created',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/dashboard/users', resp.data.id]);
      })
    }else{
      this.UserService.updated(this.user().id, formValue).subscribe((resp)=>{
        if(this.avatarFile){
          this.UserService.uploadAvatar(
            this.user().id, 
            this.avatarFile
          ).subscribe(()=>{
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User Updated',
              showConfirmButton: false,
              timer: 1500,
            });
          });
        }
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'User updated',
          showConfirmButton: false,
          timer: 1500,
        });
      });
    }
  }

  onFilesChange(event: Event){
    const file = (event.target as HTMLInputElement).files;
    if(file && file.length > 0){
      this.previewIMG = true;
      this.previewURL = URL.createObjectURL(file[0]);
      this.avatarFile =file[0];
    }
  }
}
