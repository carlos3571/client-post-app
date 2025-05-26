import { Component, inject, signal } from '@angular/core';
import { UserTableComponent } from '../../../users/components/user-table/user-table.component';
import { UserService } from '../../../users/services/user.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { PaginationService } from '../../../shared/components/pagination/pagination.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-page',
  imports: [UserTableComponent, RouterLink, PaginationComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {
  userService = inject(UserService);
  paginationService = inject(PaginationService);
  limit = signal(4);

  setLimit = (limit : string)=>{
    this.limit.set(Number(limit))
  }

  // retorna lista de usuarios
  userResource = rxResource({
    request: ()=>({
      page: this.paginationService.currentPage(),
      limit: this.limit()
    }),
    loader: ({request})=>{
      return this.userService.getUsers({
        limit: request.limit,
        page: request.page
      });
    }
  });

  deletedUser(id: string){

    Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deletedUser(id).subscribe(()=>{});
      }
    });
  }
}