import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { selectUser } from '../../../store/user.selector';
import { Observable } from 'rxjs';
import { loadUserProfile, updateUserProfile } from '../../../store/user.action';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule ,AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user:any
  editForm!:FormGroup
  isEditing = false

  user$:Observable<any>
  constructor(private userservice:UserService , private router :Router , 
    private fb:FormBuilder,
    private store:Store
  
  ){

      this.user$ =this.store.pipe(select(selectUser));
  }

  ngOnInit(): void {
    this.loadUserData()
  }





  loadUserData(): void {
    this.store.dispatch(loadUserProfile());

    this.user$.subscribe(user => {
      if (user) {
        console.log("user is ",user)
        this.editForm = this.fb.group({
          userId: [user.rr.userId],
          username: [user.rr.username],
          password: [''],
          mobile: [user.rr.mobile]
        });
      }
    });
  }




    onUpdate(): void {
      if (this.editForm.valid) {
        const update = this.editForm.value;
        this.store.dispatch(updateUserProfile({ user:update }));
        console.log("updateee",update)
    
      }
    }
  
    onLogout(){

      localStorage.removeItem('authtoken')
      this.router.navigate(['/'])
    }







      // loadUserData():void{
  //   this.userservice.getUserProfile().subscribe((res:any)=>{
  //     this.user = res.rr
  //     console.log("user is ",this.user)

  //     this.editForm = this.fb.group({
  //       userId:[this.user.userId],
  //       username:[this.user.username],
  //       password:[''],
  //       mobile:[this.user.mobile]
  //     })
  //   },err=>{
  //     console.log(err)
  //   });

  // }


  // onUpdate(){
  //   if(this.editForm.valid){
  //     const update = this.editForm.value
  //     console.log("upp",update)
  //     this.userservice.updatedData(update).subscribe((res:any)=>{
  //       console.log("indddfd",res)
  //       this.user = {...this.user, ...res.updatedProfile}
  //     })
  //   }
  // }


}
