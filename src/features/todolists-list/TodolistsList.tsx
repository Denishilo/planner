import React, {useCallback, useEffect} from 'react'
import {useSelector} from 'react-redux'
import {todosThunks} from 'features/todolists-list/todolists/todolists-reducer'
import {Grid, Paper} from '@mui/material'
import {Todolist} from 'features/todolists-list/todolists/Todolist'
import {Navigate} from 'react-router-dom'
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import {selectTask, selectTodolist} from "features/todolists-list/todolists/todoList.selectors";
import {AddItemForm} from "common/components";
import {useActions} from "common/hooks";

export const TodolistsList = () => {
    const todolists = useSelector(selectTodolist)
    const tasks = useSelector(selectTask)
    const isLoggedIn = useSelector(selectIsLoggedIn)

    const {fetchTodos, addTodo} = useActions(todosThunks)

    useEffect(() => {
        fetchTodos({})
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
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
