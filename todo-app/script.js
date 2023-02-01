const input = document.querySelector("#todo-input");
const addBtn = document.querySelector(".add-button");
const todoList = document.querySelector(".todolist");

/*****************************************************************************************************/

loadTodos();

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((data) => {
      //console.log(data);
      render(data);
    });
}

function render(todoData) {
  todoList.innerHTML = "";

  for (let todo of todoData) {
    createTodolistMarkup(todo);
  }
}

function createTodolistMarkup(todo) {
  const listItem = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", todo.id);

  const todoDescriptionLabel = document.createElement("label");
  todoDescriptionLabel.setAttribute("for", todo.id);
  const todoDescriptionTxt = document.createTextNode(todo.description);
  todoDescriptionLabel.appendChild(todoDescriptionTxt);

  listItem.append(checkbox, todoDescriptionLabel);
  todoList.appendChild(listItem);
}
