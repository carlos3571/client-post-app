import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '../../shared/services/base-http.service';
import { Observable, of, tap } from 'rxjs';
import { Role, RolesResponse,  User,  UserResponse, UsersResponse } from '../interfaces/user.interface';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface Options{
  limit?: number,
  page?: number,
}

const emptyUser: User = {
  id: 'new',
  first_name: '',
  last_name: '',
  email: '',
  telephone: '',
  password: '',
  avatar: 'avatar-user.png',
  createdAt: new Date(),
  updatedAt: new Date(),

  Role: {} as Role
};

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseHttpService{

  private userCache = new Map<string, UserResponse>;
  private usersCache = new Map<string, UsersResponse>;
  private rolesCache = new Map<string, RolesResponse>;
  authService = inject(AuthService);
  router = inject(Router);

  getUsers(options: Options):Observable<UsersResponse>{
    const { limit = 4, page = 1 } = options;

    const key = `products-${page}-${limit}`;

    if(this.usersCache.has(key)){
      return of(this.usersCache.get(key)!);
    }

    return this.http
      .get<UsersResponse>(`${this.apiUrl}/users`, {
        params: {limit, page}},
      )
      .pipe(tap((resp)=>this.usersCache.set(key, resp)));
  }

  getUser(id:string):Observable<UserResponse>{
    if(id === "new") return of({
      success: false,
      message: '',
      data: emptyUser,
    });

    if(this.userCache.has(id)){
      return of(this.userCache.get(id)!);
    }

    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`)
      .pipe(tap((resp)=> this.userCache.set(id, resp)));
    ;
  }

  getRoles():Observable<RolesResponse>{

    if(this.rolesCache.has('roles')){
      return of(this.rolesCache.get('roles')!);
    }
    return this.http.get<RolesResponse>(`${this.apiUrl}/roles`)
       .pipe(tap((resp)=> this.rolesCache.set('roles', resp)));
  }

  created(data: any): Observable<UserResponse>{
    return this.http
      .post<UserResponse>(`${this.apiUrl}/users`,data)
      .pipe(tap((resp)=> this.addUserToCache(resp)));

  }

  updated(id : string , data: any): Observable<UserResponse>{
    return this.http.patch<UserResponse>(`${this.apiUrl}/users/${id}`,data)
      .pipe(tap((resp)=> this.updateUserCache(id, data)));
    ;

  }

  addUserToCache(userResponse: UserResponse){
    if(!userResponse.data.id) return;

    this.userCache.set(userResponse.data.id, userResponse);

    this.usersCache.forEach((usersResponse)=>{
      usersResponse.data.users = [userResponse.data, ...usersResponse.data.users];
    });
  }

  updateUserCache(id: any, user: any){
    user.id = id; 
    const data: UserResponse = {
      success: true,
      message: '',
      data: user,
    }
    this.userCache.set(id, user);
    this.usersCache.forEach((userResponse)=>{
      userResponse.data.users = userResponse.data.users.map((currentUser)=>
      currentUser.id === id ? user : currentUser,);
    });

    const storedUser = localStorage.getItem('user');
    if(storedUser){
      const parsedUser = JSON.parse(storedUser);
      if(parsedUser.id === id){
        localStorage.setItem('user',JSON.stringify(user));
      }
    }
  }

  deletedUser(id: string):Observable<any>{
    return this.http
      .delete(`${this.apiUrl}/users/${id}`)
      .pipe(tap((resp)=> this.removeIfSameUser(id)));
  }

  removeIfSameUser(id: string){
    const storedUser = localStorage.getItem('user');
    if(storedUser){
      const parsedUser = JSON.parse(storedUser);
      if(parsedUser.id === id){
        this.authService.logout();
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'Tu cuenta se ha eliminado, has sido desconectado',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/auth/login']);
      }else{        
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted',
          icon: 'success',
        });
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ok"
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }

      });
      }
    }

  };


  uploadAvatar(id:string, image: File): Observable<string>{
    const formData = new FormData();
    formData.append('avatar', image);
    return this.http.put<string>(`${this.apiUrl}/users/avatar/${id}`, formData)
  }

}
