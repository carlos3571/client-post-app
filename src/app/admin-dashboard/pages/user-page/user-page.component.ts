import { Component, effect, inject, input, linkedSignal } from '@angular/core';
import { UserService } from '../../../users/services/user.service';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserDetailComponent } from "../user-detail/user-detail.component";

@Component({
  selector: 'app-user-page',
  imports: [UserDetailComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent {

  id = input.required<string>();
  userService = inject(UserService);
  router = inject(Router);

  userId = linkedSignal(this.id);

  userResource = rxResource({
    request: ()=>({id: this.userId()}),
    loader: ({request})=>{
      return this.userService.getUser(request.id);
    },
  });

  redirectEffect = effect(() =>{
    if(this.userResource.error()){
      this.router.navigate(['/dashboard/users']);
    }
  });
  

}
