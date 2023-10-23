import { createSelector, createFeatureSelector } from '@ngrx/store';

export const selectUserRoleState = createFeatureSelector<any>('userRole');

export const selectRole = createSelector(
  selectUserRoleState,
  (state: any) => state ? state.role : undefined
);

export const selectUserId = createSelector(
  selectUserRoleState,
  (state: any) => state ? state.userId : undefined
);
