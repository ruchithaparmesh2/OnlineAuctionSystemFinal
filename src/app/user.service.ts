import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchUserData(): Observable<User> {
    return this.http
      .get<User>('http://localhost:8080/oauth-success', { withCredentials: true })
      .pipe(
        tap((data: User) => {
          this.userSubject.next(data); // Set the user data
        })
      );
  }

  getUser(): User | null {
    return this.userSubject.getValue();
  }

  setUserName(name: string): void {
    const cleanedName = name.replace(/\s+/g, ''); // Remove spaces from the name
    const currentUser = this.userSubject.getValue();
    if (currentUser) {
      this.userSubject.next({ ...currentUser, name: cleanedName });
    } else {
      this.userSubject.next({ name: cleanedName } as User);
    }
  }
  

  clearUser(): void {
    this.userSubject.next(null);
  }

  saveUser(user: User): Observable<any> {
    return this.http.post('http://localhost:8080/api/users/save', user);
  }
}
