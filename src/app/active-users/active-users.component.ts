import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-active-users',
  standalone:true,
  imports:[NavbarAdminComponent,CommonModule],
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css']
})
export class ActiveUsersComponent implements OnInit {
  users: { name: string; email: string }[] = []; // Array to store fetched user details

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get('http://localhost:8080/api/user/get').subscribe(
      (response: any) => {
        this.users = response.map((user: any) => ({
          name: user.name,
          email: user.email
        }));
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
}