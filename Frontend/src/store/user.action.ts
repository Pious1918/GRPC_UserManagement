import { createAction, props } from "@ngrx/store";


export const loadUserProfile = createAction(
    '[user] load user profile'
)

export const loaduserProfileSuccess = createAction(
    '[user] load user profile success',
    props<{user:any}>()

)

export const loadUserprofileFailure = createAction(
    '[user] load user profile failure',
    props<{error:any}>()
)

export const updateUserProfile = createAction(
    '[user] update user profile',
    props<{user:any}>()
)

export const updateUserprofilesuccess = createAction(
    '[user] update user profile success',
    props<{user:any}>()
)

export const updateUserProfileFailure = createAction(
    '[User] Update User Profile Failure',
    props<{ error: any }>()
  );
