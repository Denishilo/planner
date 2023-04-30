import { Task } from "features/todolists-list/tasks/Task";
import React, { FC } from "react";
import { TaskType } from "features/todolists-list/tasks/tasks.api";
import { TaskStatuses } from "common/constants";
import { TodolistDomainType } from "features/todolists-list/todolists/todolists-reducer";

export const Tasks: FC<Props> = ({ tasks, todolist }) => {
  let tasksForTodolist = tasks;

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }
  return (
    <>
      {tasksForTodolist.map((t) => (
        <Task key={t.id} task={t} todolistId={todolist.id} />
      ))}
    </>
  );
};

/////////// types /////////

type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};
