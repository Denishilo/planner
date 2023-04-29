import React, {ChangeEvent, FC, memo} from 'react'
import {Checkbox, IconButton} from '@mui/material'
import {EditableSpan} from 'common/components/EditableSpan/EditableSpan'
import {Delete} from '@mui/icons-material'
import {TaskStatuses} from "common/constants/constants";
import {TaskType} from "features/todolists-list/tasks/tasks.api";
import {useActions} from "common/hooks";
import {tasksThunks} from "features/todolists-list/tasks/tasks-reducer";
import s from './styles.module.css'

export const Task: FC<Props> = memo(({task, todolistId}) => {

    const {removeTask, updateTask} = useActions(tasksThunks)

    const removeTaskHandler = () => removeTask({taskId: task.id, todolistId});

    const changeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            taskId: task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
            todolistId: todolistId
        })
    }

    const changeTitleHandler = (title: string) => {
        updateTask({taskId: task.id, domainModel: {title}, todolistId})
    };

    return <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
        <Checkbox
            checked={task.status === TaskStatuses.Completed}
            color="primary"
            onChange={changeStatusHandler}
        />
        <EditableSpan value={task.title} onChange={changeTitleHandler}/>
        <IconButton onClick={removeTaskHandler}><Delete/></IconButton>
    </div>
})
///////// types ///////////

type Props = {
    task: TaskType
    todolistId: string
}