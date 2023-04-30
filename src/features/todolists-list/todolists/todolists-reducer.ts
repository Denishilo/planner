import { RequestStatusType } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { ChangeTodoTitleArgType, todolistsApi, TodolistType } from "features/todolists-list/todolists/todolists.api";
import { createAppAsyncThunk } from "common/utils";
import { ResultCode } from "common/constants";

const initialState: Array<TodolistDomainType> = [];

const fetchTodos = createAppAsyncThunk<{ todolists: TodolistType[] }, void>("todos/fetchTodos", async () => {
  const res = await todolistsApi.getTodolists();
  return { todolists: res.data };
});
const removeTodo = createAppAsyncThunk<{ todolistId: string }, string>(
  "todos/removeTodo",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    dispatch(todoActions.changeTodolistEntityStatus({ id: todolistId, entityStatus: "loading" }));
    const res = await todolistsApi.deleteTodolist(todolistId);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return { todolistId };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const addTodo = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todos/addTodo",
  async (title, { rejectWithValue }) => {
    const res = await todolistsApi.createTodolist(title);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return { todolist: res.data.data.item };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);

const changeTodolistTitle = createAppAsyncThunk<ChangeTodoTitleArgType, ChangeTodoTitleArgType>(
  "todos/changeTodoTitle",
  async (arg, { rejectWithValue }) => {
    const res = await todolistsApi.updateTodolist(arg.id, arg.title);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return { id: arg.id, title: arg.title };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const slice = createSlice({
  name: "todolist",
  initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus;
    },
    setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
      return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) state[index].title = action.payload.title;
      });
  },
});
export const todolistsReducer = slice.reducer;
export const todoActions = slice.actions;
export const todosThunks = { fetchTodos, removeTodo, addTodo, changeTodolistTitle };

// types
export type FilterValuesType = "all" | "active" | "completed";

export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
