//SELECT ELEMENTS

const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todoListEl = document.getElementById("todos-list");
const notificationEl = document.querySelector(".notification");

//VARIABLES
let todos = JSON.parse(localStorage.getItem("todos")) || [];
let editTodoId = -1;

//THE VERY FIRST RENDER
renderTodo();

//FORM SUBMIT

form.addEventListener("submit", function (event) {
  event.preventDefault();

  saveTodo();
  renderTodo();

  localStorage.setItem("todos", JSON.stringify(todos));
});

//SAVE TODOS

function saveTodo() {
  const todoValue = todoInput.value;

  // CHECK IF TODO IS EMPTY
  const isEmpty = todoInput.value === "";

  // CHECK FOR DUPLICATE TODO
  const isDuplicate = todos.some(
    (todo) => todo.value.toLowerCase() === todoValue.toLowerCase()
  );

  if (isEmpty) {
    showNotification("Empty string");
  } else if (isDuplicate) {
    showNotification("Todo already exists");
  } else {
    if (editTodoId >= 0) {
      //UPDATE THE EDIT TODO
      todos = todos.map((todo, index) => {
        return {
          ...todo,
          value: index === editTodoId ? todoValue : todo.value,
        };
      });

      editTodoId = -1;

      todoInput.value = "";
    } else {
      const todo = {
        value: todoValue,
        checked: false,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };

      todos.push(todo);

      todoInput.value = "";
    }
  }
}

//RENDER TODO
function renderTodo() {
  if (todos.length === 0) {
    todoListEl.innerHTML = "<center>Nothing to do!</center>";
    return;
  }
  //CLEAR ELEMENT BEFORE RE-RENDERING
  todoListEl.innerHTML = "";

  //RENDER TODOS
  todos.forEach((todo, index) => {
    todoListEl.innerHTML += `
    <div class="todo" id=${index}>
          <span>${index + 1} - </span>
          <i class="bi ${todo.checked ? "bi-check-circle" : "bi-circle"} "
          style="color : ${todo.color}"
          data-action = "check"
          ></i>
          <p class="${todo.checked ? "checked" : ""} "" data-action = "check">${
      todo.value
    }</p>
          <i class="bi bi-pencil-square" data-action = "edit"></i>
          <i class="bi bi-trash3" data-action = "delete"></i>
        </div>
    `;
  });
}

//CLICK EVENT LISTENER FOR ALL THE TODOS
todoListEl.addEventListener("click", (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== "todo") return;

  //TODO ID
  const todo = parentElement;
  const todoId = Number(todo.id);

  //TARGET ACTION
  const action = target.dataset.action;
  action === "check" && checkTodo(todoId);
  action === "edit" && editTodo(todoId);
  action === "delete" && deleteTodo(todoId);

  console.log(todoId);
});

//CHECK A TODO

function checkTodo(todoId) {
  todos = todos.map((todo, index) => {
    return {
      ...todo,
      checked: index === todoId ? !todo.checked : todo.checked,
    };
  });
  renderTodo();
  localStorage.setItem("todos", JSON.stringify(todos));
}

//EDIT TODO
function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  editTodoId = todoId;
}

//DELETE TODO
function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  editTodoId = -1;

  //RE-RENDER TODOS
  renderTodo();
  localStorage.setItem("todos", JSON.stringify(todos));
}

//SHOW NOTIFICATION
function showNotification(msg) {
  //CHANGE MESSAGE
  notificationEl.innerHTML = msg;

  //NOTIFICATION ENTER
  notificationEl.classList.add("notifi-enter");

  //NOTIFICATION EXIT
  setTimeout(() => {
    notificationEl.classList.remove("notifi-enter");
  }, 2000);
}
