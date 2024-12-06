import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';  // Import the tap operator

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; 
  private userNameSubject = new BehaviorSubject<string>('');  // Store username
  userName$ = this.userNameSubject.asObservable();  // Observable to share the username

  constructor(private http: HttpClient) {}

  // Save user to the backend
  saveUser(user: { name: string; email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, user);
  }

  // Fetch current user's name and store it in the BehaviorSubject
  getCurrentUserName(): Observable<string> {
    return this.http.get<string>('http://localhost:8080/api/user', { withCredentials: true })
      .pipe(
        // Store the fetched username in the BehaviorSubject
        tap(name => this.userNameSubject.next(name))  // Use tap operator here
      );
  }

  // Set the username manually
  setUserName(userName: string): void {
    this.userNameSubject.next(userName);
  }

  // Get the stored username
  getUserName(): string {
    return this.userNameSubject.getValue();
  }
  
}
