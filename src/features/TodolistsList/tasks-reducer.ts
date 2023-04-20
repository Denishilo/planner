import {appActions} from "app/app-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {todoActions, todosThunks} from "features/TodolistsList/todolists-reducer";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk} from "common/utils/create-app-async-thunk";
import {handleServerAppError, handleServerNetworkError} from "common/utils";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/constants/constants";
import {
    AddTaskArgType,
    RemoveTaskArgType,
    TaskType,
    todolistsApi,
    UpdateTaskArgType,
    UpdateTaskModelType
} from "features/TodolistsList/Todolist/todolists.api";

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[], todolistId: string }, string>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.getTasks(todolistId)
        const tasks = res.data.items
        return {tasks, todolistId}
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
    }
})

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>('tasks/addTasks', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.createTask(arg)
        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task}
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>('tasks/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const state = getState()
        const task = state.tasks[arg.todolistId].find(t => t.id === arg.taskId)
        if (!task) {
            dispatch(appActions.setAppError({error: 'Task not found in the state'}))
            return rejectWithValue(null)
        }
        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel
        }
        const res = await todolistsApi.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg

        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
const removeTask = createAppAsyncThunk<RemoveTaskArgType,RemoveTaskArgType>('tasks/removeTask', async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    dispatch(appActions.setAppStatus({status: 'loading'}))
    try{
        const res = await todolistsApi.deleteTask(arg)
        if (res.data.resultCode === ResultCode.SUCCESS) {
            dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    }
    catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const initialState: TasksStateType = {}
const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled,(state, action)=>{
                const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.domainModel}
            })
            .addCase(removeTask.fulfilled,(state, action)=>{
                const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)
                if (index !== -1) state[action.payload.todolistId].splice(index, 1)
            })
            .addCase(todoActions.addTodolist, ((state, action) => {
                state[action.payload.todolist.id] = []
            }))
            .addCase(todoActions.removeTodolist, (state, action) => {
                delete state[action.payload.id]
            })
            .addCase(todoActions.setTodolists, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(clearTasksAndTodolists, () => {
                return {}
            })
            .addCase(todosThunks.fetchTodos.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
    }
})
export const tasksReducer = slice.reducer
export const tasksActions = slice.actions
export const tasksThunks = {fetchTasks, addTask, updateTask,removeTask}

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}

