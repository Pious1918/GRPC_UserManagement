import { Routes } from '@angular/router';
import { RegistrationComponent } from './component/registration/registration.component';
import { UserloginComponent } from './component/userlogin/userlogin.component';
import { HomeComponent } from './component/home/home.component';
import { AuthService } from './service/auth.service';

export const routes: Routes = [


    {path:'',component: UserloginComponent },
    {path:'register' ,component:RegistrationComponent},
    {path:'home' ,component:HomeComponent , canActivate:[AuthService]},
];
