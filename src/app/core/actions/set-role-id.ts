import {createAction, props} from "@ngrx/store";

export const setRoleAndId = createAction(
  '[User] Set Role and ID',
  props<{ role: string; id: number }>()
);
