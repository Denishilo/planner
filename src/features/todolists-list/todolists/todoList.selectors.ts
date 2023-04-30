import { AppRootStateType } from "app/store";

export const selectTodolist = (state: AppRootStateType) => state.todolists;
export const selectTask = (state: AppRootStateType) => state.tasks;
