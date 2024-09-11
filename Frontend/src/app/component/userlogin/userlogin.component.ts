import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [RouterLink ,ReactiveFormsModule ,CommonModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {

  loginForm!: FormGroup
  constructor(private fb: FormBuilder, private router : Router,private userservice:UserService ){
    this.loginForm = this.fb.group({
      email:["",Validators.required],
      password:['',[Validators.required]]
    })


    if(this.userservice.isUserLoggedIn()){
      this.router.navigate(['/home'])
    }
  }


  

  onSubmit():void{

    if(this.loginForm.valid){
      console.log("form submitted")
      
      let enteredata = {
        email:this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.userservice.loginUser(enteredata).subscribe((res:any)=>{
        console.log("resoponse got successfully logged in" ,res)
        
        localStorage.setItem("authtoken" ,res.token)
        
        this.router.navigate(['/home'])
      }, err=>{
        console.log("cannot logged in ",err.error.message)
      })
    }else{
      console.log("form is invalid")
    }
  }



}


