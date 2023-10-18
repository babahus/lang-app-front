export function userRoleReducer(state : any, action : any) {
  switch (action.type) {
    case '[User] Set Role and ID':
      return { ...state, role: action.role, id: action.id };
    case '[User] Clear Role and ID':
      return {};
    default:
      return state;
  }
}
