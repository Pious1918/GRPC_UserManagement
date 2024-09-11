import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private apiUrl = 'http://localhost:3000/auth-service'
  
  private profileUrl = 'http://localhost:3000/profile-service'


  private isAuthenticated = false
  constructor(private http : HttpClient) { }


  isUserLoggedIn():boolean{
    if(localStorage.getItem('authtoken')){
      this.isAuthenticated=true
      return true
    }
    return false
  }


  registerUser(userData:{username:string , password:string}){
    console.log("hellooooo")
    return this.http.post(`${this.apiUrl}/register`,userData)
  }
  

  loginUser(entereddata : {email : string , password: string}){
    console.log("hai from userservice loginuser" ,entereddata)

    return this.http.post(`${this.apiUrl}/login`,entereddata)
  }


  getUserProfile():Observable<any>{
    const token = localStorage.getItem("authtoken")
    console.log("toke",token)
    const headers = new HttpHeaders().set('Authorization' ,`Bearer ${token}`)
    console.log("hea",headers)
    return this.http.get<any>(`${this.apiUrl}/user-profile` , {headers})
  }


  updatedData(newData:{username:string, password:string , mobile:string}){
    console.log("from servie",newData)
    return this.http.post(`${this.profileUrl}/update`,newData)
  }

}
