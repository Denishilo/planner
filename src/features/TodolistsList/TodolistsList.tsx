import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {
    addTodolistTC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    todoActions, todosThunks
} from './todolists-reducer'
import { tasksThunks} from './tasks-reducer'

import {Grid, Paper} from '@mui/material'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {useAppDispatch} from 'common/hooks/useAppDispatch';
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTask, selectTodolist} from "features/TodolistsList/todoList.selectors";
import {AddItemForm} from "common/components";
import {TaskStatuses} from "common/constants/constants";

type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
    const todolists = useSelector(selectTodolist)
    const tasks = useSelector(selectTask)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
			dispatch(todosThunks.fetchTodos())
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        const thunk = tasksThunks.removeTask({taskId, todolistId})
        dispatch(thunk)
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({title, todolistId}))
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        // const thunk = updateTask(id, {status}, todolistId)
        const thunk = tasksThunks.updateTask({taskId:id, todolistId, domainModel:{status}})
        dispatch(thunk)
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        const thunk = tasksThunks.updateTask({taskId:id, todolistId, domainModel:{title:newTitle}})

        dispatch(thunk)
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        dispatch(todoActions.changeTodolistFilter({id, filter}))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(removeTodolistTC(id))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(changeTodolistTitleTC(id, title))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
