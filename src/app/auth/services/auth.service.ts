import { computed, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '../../shared/services/base-http.service';
import { catchError, map, Observable, of } from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService{

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<any>(null);
  private _token = signal<String | null>(localStorage.getItem('token'));

  checkStatusResource = rxResource({
    loader: ()=> this.checkStatus(),
  })

  authStatus = computed(()=>{
    if(this._authStatus() === 'checking') return 'checking';
    if(this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed(()=> this._user());
  token = computed(()=> this._token());
  isAdmin = computed(()=> this._user()?.Role?.name.includes('admin') ?? false);

  login(email: string, password: string):Observable<boolean>{
    return this.http
    .post<any>(`${this.apiUrl}/auth/login`,{email, password})
    .pipe(
    map((resp)=> this.handleAuthSuccess(resp)),
    catchError((error:any) => this.handleAuthError(error))
  );

}

  register(data: any):Observable<boolean>{
    return this.http.post<any>(`${this.apiUrl}/auth/register`, data).pipe(
      map((resp)=> this.handleAuthSuccess(resp)),
      catchError((error: any) => this.handleAuthError(error))
    );
  }

  checkStatus():Observable<boolean>{
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false);
    }
    return this.http.get<any>(`${this.apiUrl}/auth/check-status`).pipe(
      map((resp)=> this.handleAuthSuccess(resp)),
      catchError((error:any)=> this.handleAuthError(error))
    );
  }


  logout():void{
    this._user.set('');
    this._token.set('');
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  private handleAuthSuccess(resp:any){
        this._user.set(resp.data.user);
        this._token.set(resp.data.token);
        this._authStatus.set('authenticated');
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('user', JSON.stringify(resp.data.user));
        return true;
  }

  private handleAuthError(error:any){
    this.logout();
    return of(false);
  }
}
