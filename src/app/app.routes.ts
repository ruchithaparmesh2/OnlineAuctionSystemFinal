import { Routes } from '@angular/router';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardUserComponent } from './dashboard-user/dashboard-user.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AllAuctionsComponent } from './all-auctions/all-auctions.component';

export const routes: Routes = [
    { path: '', component: MainpageComponent, pathMatch: 'full' },
    { path: 'login-admin', component: LoginAdminComponent },
    { path: 'login-user', component: LoginUserComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'dashboard-user', component: DashboardUserComponent},
    {path:'all-auctions',component:AllAuctionsComponent},
    {path:'add-item',component:AddItemComponent},
    { path: '**', redirectTo: '' }
  
];
