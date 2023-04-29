import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {FilterValuesType, todoActions, todosThunks} from './todolists-reducer'
import {tasksThunks} from './tasks-reducer'
import {Grid, Paper} from '@mui/material'
import {Todolist} from './Todolist/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTask, selectTodolist} from "features/TodolistsList/todoList.selectors";
import {AddItemForm} from "common/components";
import {TaskStatuses} from "common/constants/constants";
import {useActions} from "common/hooks";

export const TodolistsList = () => {
    const todolists = useSelector(selectTodolist)
    const tasks = useSelector(selectTask)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTodos, addTodo, removeTodo, changeTodolistTitle: changeTodolistTitleThunk} = useActions(todosThunks)
    const {addTask: addTaskThunk, removeTask: removeTaskThunk, updateTask} = useActions(tasksThunks)
    const {changeTodolistFilter} = useActions(todoActions)

    useEffect(() => {
        fetchTodos()
    }, [])

    const removeTask = useCallback(function (taskId: string, todolistId: string) {
        removeTaskThunk({taskId, todolistId})
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        addTaskThunk({title, todolistId})
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        // const thunk = updateTask(id, {status}, todolistId)
        updateTask({taskId: id, todolistId, domainModel: {status}})
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        updateTask({taskId: id, todolistId, domainModel: {title: newTitle}})
    }, [])

    const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
        changeTodolistFilter({id, filter})
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        removeTodo(id)
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        changeTodolistTitleThunk({id, title})
    }, [])

    const addTodolist = useCallback((title: string) => {
        addTodo(title)
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
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
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
