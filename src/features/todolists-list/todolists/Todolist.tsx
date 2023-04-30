import React, { FC, memo, useEffect } from "react";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { TodolistDomainType } from "features/todolists-list/todolists/todolists-reducer";
import { tasksThunks } from "features/todolists-list/tasks/tasks-reducer";
import { useActions } from "common/hooks";
import { TaskType } from "features/todolists-list/tasks/tasks.api";
import { FilterTasksButtons } from "features/todolists-list/todolists/FilterTasksButtons";
import { Tasks } from "features/todolists-list/todolists/tasks/tasks";
import s from "./styles.module.css";
import { TodolistTitle } from "features/todolists-list/todolists/todolistTitle/TodolistTitle";

export const Todolist: FC<Props> = memo(({ todolist, tasks }) => {
  const { fetchTasks, addTask } = useActions(tasksThunks);

  useEffect(() => {
    fetchTasks(todolist.id);
  }, []);

  const addTaskCallback = (title: string) => {
    return addTask({ title, todolistId: todolist.id }).unwrap();
  };

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <AddItemForm addItem={addTaskCallback} disabled={todolist.entityStatus === "loading"} />
      <Tasks tasks={tasks} todolist={todolist} />
      <div className={s.filterTaskButtons}>
        <FilterTasksButtons todolist={todolist} />
      </div>
    </div>
  );
});

///// types ////////
type Props = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};
