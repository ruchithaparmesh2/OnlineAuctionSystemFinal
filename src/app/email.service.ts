import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private emailApiUrl = 'http://localhost:8080/api/email/send'; // Adjust this as needed

  constructor(private http: HttpClient) {}

  sendEmail(emailData: any): Observable<any> {
    return this.http.post(this.emailApiUrl, emailData);
  }
}
