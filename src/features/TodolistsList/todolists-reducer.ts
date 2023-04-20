import {Dispatch} from 'redux'
import {AppThunk} from 'app/store';
import {appActions, RequestStatusType} from "app/app-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {handleServerNetworkError} from "common/utils/handle-server-network-error";
import {todolistsApi, TodolistType} from "features/TodolistsList/Todolist/todolists.api";
import {createAppAsyncThunk} from "common/utils";

const initialState: Array<TodolistDomainType> = []

const fetchTodos = createAppAsyncThunk<{todolists:TodolistType[]},void>('todolists/fetchTodolists', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        const res = await todolistsApi.getTodolists()
        dispatch(appActions.setAppStatus({status: 'succeeded'}))
        console.log({res})
        return {todolists:res.data}

            // .then((todos) => {
            //     todos.forEach(tl => {
            //         dispatch(tasksThunks.fetchTasks(tl.id))
            //     })
            // })

    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string, title: string }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(todo => todo.id === action.payload.id)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        },
    },
    extraReducers: builder => {
        builder
            .addCase(clearTasksAndTodolists, () => {
            return []
        })
            .addCase(fetchTodos.fulfilled,(state, action)=>{
                return action.payload.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
            })
    }
})
export const todolistsReducer = slice.reducer
export const todoActions = slice.actions
export const todosThunks = {fetchTodos}

// thunks

export const removeTodolistTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        dispatch(todoActions.changeTodolistEntityStatus({id: todolistId, entityStatus: 'loading'}))
        todolistsApi.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(todoActions.removeTodolist({id: todolistId}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: 'loading'}))
        todolistsApi.createTodolist(title)
            .then((res) => {
                dispatch(todoActions.addTodolist({todolist: res.data.data.item}))
                dispatch(appActions.setAppStatus({status: 'succeeded'}))
            })
    }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
    return (dispatch: Dispatch) => {
        todolistsApi.updateTodolist(id, title)
            .then((res) => {
                dispatch(todoActions.changeTodolistTitle({id, title}))
            })
    }
}

// types
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}

