import React, { Component } from "react";
import { ThemeProvider } from "styled-components";
import { ToDoListDarkTheme } from "../Themes/ToDoListDarkTheme";
import { ToDoListLightTheme } from "../Themes/ToDoListLightTheme";
import { ToDoListPrimaryTheme } from "../Themes/ToDoListPrimaryTheme";
import { Container } from "../Components/Container";
import { Dropdown } from "../Components/Dropdown";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
} from "../Components/Heading";
import { TextField } from "../Components/TextField";
import { Button } from "../Components/Button";
import { Table, Tr, Td, Th, Tbody, Thead } from "../Components/Table";
import { connect } from "react-redux";
import {
  addTaskAction,
  changeThemeAction,
  deleteTaskAction,
  doneTaskAction,
  editTaskAction,
  updateTaskAction,
} from "../redux/actions/ToDoListAction";
import { arrTheme } from "../Themes/ThemeManager";

class ToDoList extends Component {
  state = {
    taskName: "",
    disabled: true,
  };

  renderTaskToDo = () => {
    return this.props.taskList
      .filter((task) => !task.done) /* !task.done = done:false */
      .map((task, index) => {
        return (
          <Tr key={index}>
            <Th style={{ verticalAlign: "middle" }}>{task.taskName}</Th>
            <Th className="text-right">
              <Button
                onClick={() => {
                  this.setState(
                    {
                      disabled: false,
                    },
                    () => {
                      this.props.dispatch(editTaskAction(task));
                    }
                  );
                }}
                className="ml-1"
              >
                <i className="fa fa-edit"></i>
              </Button>
              <Button
                onClick={() => {
                  this.props.dispatch(doneTaskAction(task.id));
                }}
                className="ml-1"
              >
                <i className="fa fa-check"></i>
              </Button>
              <Button
                onClick={() => {
                  this.props.dispatch(deleteTaskAction(task.id));
                }}
                className="ml-1"
              >
                <i class="fa fa-trash-alt"></i>
              </Button>
            </Th>
          </Tr>
        );
      });
  };

  renderTaskCompleted = () => {
    return this.props.taskList
      .filter((task) => task.done) /* task.done = done:true */
      .map((task, index) => {
        return (
          <Tr key={index}>
            <Th style={{ verticalAlign: "middle" }}>{task.taskName}</Th>
            <Th className="text-right">
              <Button
                onClick={() => {
                  this.props.dispatch(deleteTaskAction(task.id));
                }}
                className="ml-1"
              >
                <i class="fa fa-trash-alt"></i>
              </Button>
            </Th>
          </Tr>
        );
      });
  };

  /* c?? th??? vi???t h??m onchange ri??ng */
  // handleChange = (e) => {
  //   let { name, value } = e.target.value;
  //   this.setState({
  //     [name]: value,
  //   });
  // };

  renderTheme = () => {
    return arrTheme.map((theme, index) => {
      return (
        <option key={index} value={theme.id}>
          {theme.name}
        </option>
      );
    });
  };

  // Life cycle phi??n b???n 16 nh???n v??o props m???i ???????c th???c thi tr?????c render
  // componentWillReceiveProps(newProps) {
  //   console.log("this.props", this.props);
  //   console.log("newProps: ", newProps);
  //   this.setState({
  //     taskName: newProps.taskEdit.taskName,
  //   });
  // }

  // life cycle t??nh kh??ng truy xu???t ???????c tr??? this
  // static getDerivedStateFromProp(newProps, currentState) {
  //   // new props: l?? props m???i, props c?? l?? this.props (k truy xu???t ??c)
  //   // currentState: ???ng v???i state hi???n t???i this.state
  //   // ho???c tr??? v??? state m???i (this.state)
  //   let newState = { ...currentState, taskName: newProps.taskEdit.taskName };
  //   return newState;

  // }

  render() {
    return (
      <ThemeProvider theme={this.props.themeToDoList}>
        <Container className="w-50">
          <Dropdown
            onChange={(event) => {
              let { value } = event.target;
              // dispatch value l??n reducer
              this.props.dispatch(changeThemeAction(value));
            }}
          >
            {this.renderTheme()}
          </Dropdown>
          <Heading3>To Do List</Heading3>
          <TextField
            value={this.state.taskName}
            // l???y th??ng tin user nh???p v??o ?? input
            onChange={(event) => {
              this.setState({
                taskName: event.target.value,
              });
            }}
            name="taskName"
            label="Task name"
            className="w-50"
          />
          <Button
            onClick={() => {
              // l???y th??ng tin ng?????i d??ng nh???p v??o
              let { taskName } = this.state;
              // t???o ra 1 task object
              let newTask = {
                id: Date.now(),
                taskName: taskName,
                done: false,
              };
              // console.log(newTask);
              // ????a task object l??n redux th??ng qua ph????ng th???c dispatch
              this.props.dispatch(addTaskAction(newTask));
            }}
            className="ml-2"
          >
            <i className="fa fa-plus"></i>Ask task
          </Button>
          {this.state.disabled ? (
            <Button
              disabled
              onClick={() => {
                this.props.dispatch(updateTaskAction(this.state.taskName));
              }}
              className="ml-2"
            >
              <i className="fa fa-upload"></i>Update task
            </Button>
          ) : (
            <Button
              onClick={() => {
                let { taskName } = this.state;
                this.setState(
                  {
                    disabled: true,
                    taskName: "",
                  },
                  () => {
                    this.props.dispatch(updateTaskAction(taskName));
                  }
                );
              }}
              className="ml-2"
            >
              <i className="fa fa-upload"></i>Update task
            </Button>
          )}

          <hr color="white" />
          <Heading3>Task to do</Heading3>
          <Table>
            <Thead>{this.renderTaskToDo()}</Thead>
          </Table>
          <Heading3>Task completed</Heading3>
          <Table>
            <Thead>{this.renderTaskCompleted()}</Thead>
          </Table>
        </Container>
      </ThemeProvider>
    );
  }

  // ????y l?? life cycle tr??? v??? props c?? v?? state c?? c???a component tr?????c khi render (ch???y sau render)

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.taskEdit.id !== this.props.taskEdit.id)
      this.setState({
        taskName: this.props.taskEdit.taskName,
      });
  }
}

const mapStateToProps = (state) => {
  return {
    themeToDoList: state.ToDoListReducer.themeToDoList,
    taskList: state.ToDoListReducer.taskList,
    taskEdit: state.ToDoListReducer.taskEdit,
  };
};

export default connect(mapStateToProps)(ToDoList);
