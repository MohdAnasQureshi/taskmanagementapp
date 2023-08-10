import React, { useContext } from "react";
import taskContext from "../context/tasks/taskContext";

const Taskitem = (props) => {
  const context = useContext(taskContext);
  const { task, updateTask, showAlert } = props;
  const { deleteTask } = context;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title"> {task.title}</h5>
          <p className="card-text">{task.description} </p>
          <p className="card-text">{task.dueDate} </p>
          <p className="card-text">{task.status} </p>
          <p className="card-text">{task.assignedUser} </p>
          <i
            className="fa-solid fa-trash-can mx-2"
            onClick={() => {
              deleteTask(task._id);
              showAlert("Deleted Successfully", "success");
            }}
          ></i>
          <i
            className="fa-solid fa-pen-to-square mx-2"
            onClick={() => {
              updateTask(task);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Taskitem;
