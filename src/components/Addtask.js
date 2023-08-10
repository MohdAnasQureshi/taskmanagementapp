import React, { useContext, useState, useEffect } from "react";
import taskContext from "../context/tasks/taskContext";
// import Notes from "./Notes";

const AddTask = (props) => {
  const context = useContext(taskContext);
  const host = "http://localhost:5000";
  const { addTask } = context;
  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "",
    assignedUser: "",
  });
  const [user, setUser] = useState([
    {
      name: "",
      email: "",
      password: "",
      date: "",
    },
  ]);
  const handleClick = (e) => {
    e.preventDefault();
    addTask(
      task.title,
      task.description,
      task.dueDate,
      task.status,
      task.assignedUser
    );
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "",
      assignedUser: "",
    });
    props.showAlert("Added Successfully", "success");
  };
  const onChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    getUsers();
  }, []);
  const getUsers = async () => {
    // task api call
    const response = await fetch(`${host}/getAllUsers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    // console.log(json);
    setUser(json);
  };

  return (
    <div className="container my-3">
      <h2>Add A Task</h2>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="title"
            value={task.title}
            className="form-control"
            id="title"
            name="title"
            aria-describedby="emailHelp"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            value={task.description}
            className="form-control"
            id="description"
            name="description"
            onChange={onChange}
            minLength={5}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dueDate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            value={task.dueDate}
            className="form-control"
            id="dueDate"
            name="dueDate"
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>

          <select
            className="form-select"
            aria-label="Default select example"
            value={task.status}
            id="status"
            name="status"
            onChange={onChange}
          >
            <option>Select</option>
            <option>Done</option>
            <option>Pending</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="assignedUser" className="form-label">
            Assigned User
          </label>

          <select
            id="assignedUser"
            name="assignedUser"
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => {
              task.assignedUser = e.target.value;
            }}
          >
            <option>Select</option>
            {user.map((u, i) => {
              return <option key={i}>{u.name}</option>;
            })}
          </select>
        </div>

        <button
          disabled={task.title.length < 5 || task.description.length < 5}
          type="submit"
          className="btn btn-primary"
          onClick={handleClick}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
