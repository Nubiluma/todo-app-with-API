const input = document.querySelector("#todo-input");
const addBtn = document.querySelector(".add-button");
const todoList = document.querySelector(".todolist");

const state = {
  todos: [],
  filter: "all",
};

/*****************************************************************************************************/

addBtn.addEventListener("click", addTodo);

loadTodos();

/*****************************************************************************************************/

function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((todosFromAPI) => {
      state.todos = todosFromAPI;
      render();
    });
}

function addTodo() {
  if (isInputValid(input.value)) {
    const newTodo = { description: input.value, done: false };

    fetch("http://localhost:4730/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    })
      .then((response) => response.json())
      .then((newTodoFromAPI) => {
        state.todos.push(newTodoFromAPI);
        createTodoItemMarkup(newTodoFromAPI);
      });
  }
}

/* 
function removeTodo(id) {

  fetch(`http://localhost:4730/todos/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      render();
    });
}


function editTodo(id) {
  fetch(`http://localhost:4730/todos/${id}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json'},
  })
  .then((response) => response.json())
  .then((editedTodoFromAPI) => {
  })

}

 */

function render() {
  todoList.innerHTML = "";

  state.todos.forEach((todo) => createTodoItemMarkup(todo));
}

function createTodoItemMarkup(todo) {
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

function isInputValid(inputValue) {
  if (inputValue.length >= 3) {
    return true;
  }
}
