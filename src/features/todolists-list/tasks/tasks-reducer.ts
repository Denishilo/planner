import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { todoActions, todosThunks } from "features/todolists-list/todolists/todolists-reducer";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/constants/constants";
import {
  AddTaskArgType,
  RemoveTaskArgType,
  tasksApi,
  TaskType,
  UpdateTaskArgType,
  UpdateTaskModelType,
} from "features/todolists-list/tasks/tasks.api";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasks",
  async (todolistId) => {
    const res = await tasksApi.getTasks(todolistId);
    const tasks = res.data.items;
    return { tasks, todolistId };
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>(
  "tasks/addTasks",
  async (arg, { rejectWithValue }) => {
    const res = await tasksApi.createTask(arg);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      const task = res.data.data.item;
      return { task };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  }
);

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "tasks/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
    if (!task) {
      dispatch(appActions.setAppError({ error: "Task not found in the state" }));
      return rejectWithValue(null);
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...arg.domainModel,
    };
    const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, apiModel);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return arg;
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);
const removeTask = createAppAsyncThunk<RemoveTaskArgType, RemoveTaskArgType>(
  "tasks/removeTask",
  async (arg, { rejectWithValue }) => {
    const res = await tasksApi.deleteTask(arg);
    if (res.data.resultCode === ResultCode.SUCCESS) {
      return arg;
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: true });
    }
  }
);

const initialState: TasksStateType = {};
const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1)
          state[action.payload.todolistId][index] = {
            ...state[action.payload.todolistId][index],
            ...action.payload.domainModel,
          };
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) state[action.payload.todolistId].splice(index, 1);
      })
      .addCase(todoActions.setTodolists, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(clearTasksAndTodolists, () => {
        return {};
      })
      .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => {
          state[tl.id] = [];
        });
      })
      .addCase(todosThunks.removeTodo.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todosThunks.addTodo.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      });
  },
});
export const tasksReducer = slice.reducer;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

/////////////// types ///////////////

export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
