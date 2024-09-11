import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule ,CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {


  registrationForm! : FormGroup;

  constructor(private fb:FormBuilder , private userService:UserService , private router : Router){

    this.registrationForm = this.fb.group({
      email:['', [Validators.required]],
      username:['',[Validators.required,Validators.minLength(3)]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      mobile: ['',[Validators.required, Validators.minLength(10)]]
    })
  }


  onSubmit():void{
    if(this.registrationForm.valid){
      console.log("form submitted",this.registrationForm.value)

      let userdata = {
        username:this.registrationForm.value.username,
        password : this.registrationForm.value.password,
        email : this.registrationForm.value.email,
        mobile : this.registrationForm.value.mobile,
      }
      this.userService.registerUser(userdata).subscribe((res:any)=>{
        console.log("new user added successfully",res)
        localStorage.setItem("authtoken",res.token)
        this.router.navigate(['/home'] ,res.email)
      }, err=>{
        console.log("error registering new user",err.error.message)
      })
    }else{
      console.log("Form is invalid")
    }
  }


}
