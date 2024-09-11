import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../app/service/user.service";
import { Router } from "@angular/router";
import { loadUserProfile, loadUserprofileFailure, loaduserProfileSuccess, updateUserProfile, updateUserProfileFailure, updateUserprofilesuccess } from "./user.action";
import { catchError, map, mergeMap, of } from "rxjs";
import { Injectable } from "@angular/core";





@Injectable()
export class UserEffects{

    constructor(

        private actions$:Actions,
        private userService :UserService,
        private route : Router
    ){

    }




    loadUserProfile$ = createEffect(() =>
        this.actions$.pipe(
          ofType(loadUserProfile),
          mergeMap(() => this.userService.getUserProfile()
            .pipe(
              map(user => loaduserProfileSuccess({ user })),
              catchError(error => of(loadUserprofileFailure({ error })))
            ))
        )
      );


      updateUserProfile$ = createEffect(() =>
        this.actions$.pipe(
          ofType(updateUserProfile),
          mergeMap(action => this.userService.updatedData(action.user)
            .pipe(
              map(user => updateUserprofilesuccess({ user })),
              catchError(error => of(updateUserProfileFailure({ error })))
            ))
        )
      );
    

}