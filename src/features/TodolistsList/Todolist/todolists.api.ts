import {instance} from "common/api/common.api";
import {TaskPriorities, TaskStatuses} from "common/constants/constants";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";
import {ResponseType} from 'common/types/common.types'

export const todolistsApi = {
    getTodolists() {
        const promise = instance.get<TodolistType[]>('todo-lists');
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
        return promise;
    },
    deleteTodolist(id: string) {
        const promise = instance.delete<ResponseType>(`todo-lists/${id}`);
        return promise;
    },
    updateTodolist(id: string, title: string) {
        const promise = instance.put<ResponseType>(`todo-lists/${id}`, {title: title});
        return promise;
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(arg:RemoveTaskArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todolistId}/tasks/${arg.taskId}`);
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
export type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
export type AddTaskArgType = {
    todolistId: string,
    title: string
}

export type UpdateTaskArgType = {
    taskId: string,
    domainModel: UpdateDomainTaskModelType,
    todolistId: string
}
export type RemoveTaskArgType = {
    taskId: string,
    todolistId: string
}