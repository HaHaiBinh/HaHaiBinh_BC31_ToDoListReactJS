import { arrTheme } from "../../Themes/ThemeManager";
import { ToDoListDarkTheme } from "../../Themes/ToDoListDarkTheme";
import {
  add_task,
  change_theme,
  delete_task,
  done_task,
  edit_task,
  update_task,
} from "../types/ToDoListTypes";

const initialState = {
  themeToDoList: ToDoListDarkTheme,
  taskList: [
    { id: "task-1", taskName: "task 1", done: true },
    { id: "task-2", taskName: "task 2", done: false },
    { id: "task-3", taskName: "task 3", done: true },
    { id: "task-4", taskName: "task 4", done: false },
  ],
  taskEdit: { id: "-1", taskName: "", done: false },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case add_task: {
      // console.log("todo", action.newTask);
      // Kiểm tra rỗng
      if (action.newTask.taskName.trim() == "") {
        alert("Task name is required");
        return { ...state };
      }
      // Kiểm tra tồn tại
      let taskListUpdate = [...state.taskList];
      let index = taskListUpdate.findIndex(
        (task) => task.taskName == action.newTask.taskName
      );
      if (index !== -1) {
        // đã tồn tại
        alert("task name is already exits");
        return { ...state };
      }
      // taskListUpdate.push(action.newTask); -> có thể dùng hàm push
      // xử lý validation xong thì gán taskList mới vào taskList cũ
      state.taskList = [...taskListUpdate, action.newTask];
      return { ...state };
    }
    case change_theme: {
      // tìm theme dựa vào action.themeId được chọn
      let theme = arrTheme.find((theme) => theme.id == action.themeId);
      if (theme) {
        // chọn theme này thì set lại theme cho state.themeToDoList
        state.themeToDoList = { ...theme.theme };
        // theme.theme là let theme chấm đến arrTheme có thuộc tính là theme
      }
    }
    case done_task: {
      // click vào button check => dispatch lên action có taskId
      let taskListUpdate = [...state.taskList];
      /* từ taskId tìm ra task đó ở vị trí nào trong mảng và tiến hành
          cập nhật lại thuộc tính done = true và cập nhật lại state của redux
      */
      let index = taskListUpdate.findIndex((task) => task.id == action.taskId);
      if (index !== -1) {
        taskListUpdate[index].done = true;
      }

      // state.taskList = taskListUpdate
      return { ...state, taskList: taskListUpdate };
    }

    case delete_task: {
      /* Cách 1: Dựa vào tìm vị trí index */
      // let taskListUpdate = [...state.taskList];
      // let index = taskListUpdate.findIndex((task) => task.id == action.taskId);
      // if (index !== -1) {
      //   taskListUpdate.splice(index, 1);
      // }
      // return { ...state, taskList: taskListUpdate };
      /* Cách 2: Gán lại giá trị cho taskList = taskListUpdate.filter (k có taskId đó) */
      // let taskListUpdate = [...state.taskList];
      // taskListUpdate = taskListUpdate.filter(
      //   (task) => task.id !== action.taskId
      // );
      // return { ...state, taskList: taskListUpdate };
      /* Cách siêu ngắn gọn */
      return {
        ...state,
        taskList: state.taskList.filter((task) => task.id !== action.taskId),
      };
    }
    case edit_task: {
      return { ...state, taskEdit: action.task };
    }

    case update_task: {
      console.log(action.taskList);
      // chỉnh sửa lại taskname của taskEdit
      state.taskEdit = { ...state.taskEdit, taskName: action.taskName };
      // tìm trong taskList cập nhật lại taskEdit người đùng update
      let taskListUpdate = [...state.taskList];
      let index = taskListUpdate.findIndex(
        (task) => task.id == state.taskEdit.id
      );
      if (index !== -1) {
        taskListUpdate[index] = state.taskEdit;
      }

      state.taskList = taskListUpdate;
      state.taskEdit = { id: "-1", taskName: "", done: false };
      return { ...state };
    }

    default:
      return { ...state };
  }
};
