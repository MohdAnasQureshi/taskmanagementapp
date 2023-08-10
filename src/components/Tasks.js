import React, { useContext, useEffect, useRef, useState } from "react";
import taskContext from "../context/tasks/taskContext";
import Taskitem from "./Taskitem";
import Addtask from "./Addtask";
import { useNavigate } from "react-router-dom";

const Tasks = (props) => {
  let history = useNavigate();
  const context = useContext(taskContext);
  const host = "http://localhost:5000";
  const { tasks, getTasks, editTask } = context;
  const [task, setTask] = useState({
    etitle: "",
    edescription: "",
    edueDate: "",
    estatus: "",
    eassignedUser: "",
  });
  const [user, setUser] = useState([
    {
      name: "",
      email: "",
      password: "",
      date: "",
    },
  ]);
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

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getTasks();
    } else {
      history("/login");
    }
    //eslint-disable-next-line
  }, []);
  const updateTask = (currentTask) => {
    ref.current.click();
    setTask({
      id: currentTask._id,
      etitle: currentTask.title,
      edescription: currentTask.description,
      edueDate: currentTask.dueDate,
      estatus: currentTask.status,
      eassignedUser: currentTask.assignedUSer,
    });
  };
  const handleClick = (e) => {
    editTask(
      task.id,
      task.etitle,
      task.edescription,
      task.edueDate,
      task.estatus,
      task.eassignedUser
    );
    refClose.current.click();
    props.showAlert("Updated Successfully", "success");
  };
  const onChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const ref = useRef(null);
  const refClose = useRef(null);
  return (
    <>
      <Addtask showAlert={props.showAlert} />

      <button
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        ref={ref}
      ></button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Task
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container my-3">
                <h2>Edit this Task</h2>
                <form className="my-3">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <input
                      type="title"
                      className="form-control"
                      id="etitle"
                      name="etitle"
                      value={task.etitle}
                      aria-describedby="emailHelp"
                      onChange={onChange}
                      required
                      minLength={5}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="edescription"
                      value={task.edescription}
                      name="edescription"
                      onChange={onChange}
                      required
                      minLength={5}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edueDate" className="form-label">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="edueDate"
                      value={task.edueDate}
                      name="edueDate"
                      onChange={onChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estatus" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="estatus"
                      name="estatus"
                      value={task.estatus}
                      onChange={onChange}
                    >
                      <option>Select</option>
                      <option>Done</option>
                      <option>Pending</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="eassignedUser" className="form-label">
                      Assigned User
                    </label>

                    <select
                      id="eassignedUser"
                      name="eassignedUser"
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => {
                        task.eassignedUser = e.target.value;
                      }}
                    >
                      <option>Select</option>
                      {user.map((u, i) => {
                        return (
                          <option key={i} value={u.name}>
                            {u.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                Close
              </button>
              <button
                disabled={
                  task.etitle.length < 5 || task.edescription.length < 5
                }
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
              >
                Update Task
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h2>Your Tasks</h2>
        <div className="container mx-2">
          {tasks.length === 0 && "No tasks to display"}
        </div>
        {tasks.map((task) => {
          return (
            <Taskitem
              key={task._id}
              showAlert={props.showAlert}
              updateTask={updateTask}
              task={task}
            />
          );
        })}
      </div>
    </>
  );
};

export default Tasks;
