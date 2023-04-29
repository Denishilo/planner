import {Button} from "@mui/material";
import React, {FC} from "react";
import {useActions} from "common/hooks";
import {FilterValuesType, todoActions, TodolistDomainType} from "features/todolists-list/todolists/todolists-reducer";

export const FilterTasksButtons: FC<Props> = ({todolist}) => {

    const {changeTodolistFilter} = useActions(todoActions)

    const changeFilterHandler = (filter: FilterValuesType) => {
        changeTodolistFilter({filter, id: todolist.id})
    }

    return (
        <>
            <Button variant={
                todolist.filter === 'all' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('all')}
                    color={'inherit'}
            >All
            </Button>
            <Button variant={
                todolist.filter === 'active' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('active')}
                    color={'primary'}>Active
            </Button>
            <Button variant={
                todolist.filter === 'completed' ? 'outlined' : 'text'}
                    onClick={() => changeFilterHandler('completed')}
                    color={'secondary'}>Completed
            </Button>
        </>
    )
}

type Props = {
    todolist: TodolistDomainType
}