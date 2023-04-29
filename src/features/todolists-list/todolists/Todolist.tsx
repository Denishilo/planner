import React, {FC, memo, useEffect} from 'react'
import {AddItemForm} from 'common/components/AddItemForm/AddItemForm'
import {EditableSpan} from 'common/components/EditableSpan/EditableSpan'
import {Task} from 'features/todolists-list/tasks/Task'
import {TodolistDomainType, todosThunks} from 'features/todolists-list/todolists/todolists-reducer'
import {IconButton} from '@mui/material'
import {Delete} from '@mui/icons-material'
import {TaskStatuses} from "common/constants/constants";
import {tasksThunks} from "features/todolists-list/tasks/tasks-reducer";
import {useActions} from "common/hooks";
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {FilterTasksButtons} from "features/todolists-list/todolists/FilterTasksButtons";

export const Todolist: FC<Props> = memo(({todolist, tasks}) => {
    const {fetchTasks, addTask} = useActions(tasksThunks)
    const {removeTodo, changeTodolistTitle} = useActions(todosThunks)


    useEffect(() => {
        fetchTasks(todolist.id)
    }, [])


    const addTaskCallback = ((title: string) => {
        addTask({title, todolistId: todolist.id})
    })

    const removeTodolistCallback = () => {
        removeTodo(todolist.id)
    }
    const changeTodolistTitleCallback = (title: string) => {
        changeTodolistTitle({id: todolist.id, title})
    }


    let tasksForTodolist = tasks

    if (todolist.filter === 'active') {
        tasksForTodolist =
            tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (
        todolist.filter === 'completed') {
        tasksForTodolist =
            tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    return <div>
        <h3><EditableSpan value={todolist.title} onChange={changeTodolistTitleCallback}/>
            <IconButton onClick={removeTodolistCallback} disabled={
                todolist.entityStatus === 'loading'}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === 'loading'}/>
        <div>
            {
                tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={
                    todolist.id}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <FilterTasksButtons todolist={todolist}/>
        </div>
    </div>
})

///// types ////////

type Props = {
    todolist: TodolistDomainType
    tasks: TaskType[]
}
