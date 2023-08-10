import React from "react";
import taskContext from "./taskContext";
import { useState } from "react";

const TaskState = (props) => {
  const host = "http://localhost:5000";
  const tasksInitial = [];
  const [tasks, setTasks] = useState(tasksInitial);

  //Get all tasks
  const getTasks = async (
    title,
    description,
    dueDate,
    status,
    assignedUser
  ) => {
    // task api call
    const response = await fetch(`${host}/api/tasks/fetchalltasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    //  console.log(json)
    setTasks(json);
  };

  //Add a note
  const addTask = async (title, description, dueDate, status, assignedUser) => {
    // todo api call
    const response = await fetch(`${host}/api/tasks/addtask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        dueDate,
        status,
        assignedUser,
      }),
    });
    const task = await response.json();
    setTasks(tasks.concat(task));
  };
  //Delete a Task
  const deleteTask = async (id) => {
    const response = await fetch(`${host}/api/tasks/deletetask/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const json = await response.json();
    console.log(json);

    const newTasks = tasks.filter((task) => {
      return task._id !== id;
    });
    setTasks(newTasks);
  };
  //Edit a note
  const editTask = async (
    id,
    title,
    description,
    dueDate,
    status,
    assignedUser
  ) => {
    const response = await fetch(`${host}/api/tasks/updatetask/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        title,
        description,
        dueDate,
        status,
        assignedUser,
      }),
    });
    const json = response.json();
    console.log(json);
    let newtasks = JSON.parse(JSON.stringify(tasks));
    for (let index = 0; index < newtasks.length; index++) {
      const element = newtasks[index];
      if (element._id === id) {
        newtasks[index].title = title;
        newtasks[index].description = description;
        newtasks[index].dueDate = dueDate;
        newtasks[index].status = status;
        newtasks[index].assignedUser = assignedUser;
        break;
      }
    }
    setTasks(newtasks);
  };

  return (
    <taskContext.Provider
      value={{ tasks, addTask, deleteTask, editTask, getTasks }}
    >
      {props.children}
    </taskContext.Provider>
  );
};

export default TaskState;
