const input = document.querySelector("#todo-input");
const addBtn = document.querySelector(".add-button");
const removeTodosBtn = document.querySelector(".remove-button");
const todoList = document.querySelector(".todolist");

const filterElementAll = document.querySelector("#filter-all");
const filterElementOpen = document.querySelector("#filter-open");
const filterElementDone = document.querySelector("#filter-done");

let FILTER_ALL = "all";
let FILTER_OPEN = "open";
let FILTER_DONE = "done";

const filterOptions = [filterElementAll, filterElementOpen, filterElementDone];
filterElementAll.checked = true;

const state = {
  todos: [],
  filter: FILTER_ALL,
};

loadTodos();

/*******************************************************************/
/******* event listener assignments *******/

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
});

addBtn.addEventListener("click", addTodo);
removeTodosBtn.addEventListener("click", removeDoneTodos);

filterOptions.forEach((e) => e.addEventListener("click", changeFilter));

/*******************************************************************/
/******* CURD functions *******/

/**
 * load todos from database
 */
function loadTodos() {
  fetch("http://localhost:4730/todos")
    .then((response) => response.json())
    .then((todosFromAPI) => {
      state.todos = todosFromAPI;
      render();
    });
}

/**
 * add new todo to database
 * input value is set to todo description
 */
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

/**
 * remove single todo from database
 * @param {number} id
 */
function removeTodo(id) {
  state.todos.splice(
    state.todos.findIndex((e) => e.id === id),
    1
  );
  fetch(`http://localhost:4730/todos/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      render();
    });
}

/**
 * toggle done attribute
 * (identify todo by checking element id of clicked checkbox)
 */
function toggleDoneStatus(event) {
  const id = event.target.value;
  let todo = state.todos.find((e) => e.id == id);
  todo.done = !todo.done;

  fetch(`http://localhost:4730/todos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  })
    .then((response) => response.json())
    .then((data) => {
      todo = data;
      render();
    });
}

/*******************************************************************/
/******* other event listener functions *******/

/**
 * change current filter in state to the one being clicked
 */
function changeFilter() {
  if (this === filterElementOpen) {
    state.filter = FILTER_OPEN;
  } else if (this === filterElementDone) {
    state.filter = FILTER_DONE;
  } else {
    state.filter = FILTER_ALL;
  }

  render();
}

/**
 * remove all todos with done attribute === true
 */
function removeDoneTodos() {
  const doneTodos = state.todos.filter((todo) => todo.done);
  if (doneTodos.length > 0) {
    doneTodos.forEach((todo) => removeTodo(todo.id));
  }
}

/*******************************************************************/
/******* utilities *******/

/**
 * filter todos by done value
 * @returns array of filtered todos
 */
function filterTodos() {
  if (state.filter === FILTER_DONE) {
    const doneTodos = state.todos.filter((todo) => todo.done === true);
    return doneTodos;
  }
  if (state.filter === FILTER_OPEN) {
    const openTodos = state.todos.filter((todo) => todo.done === false);
    return openTodos;
  }
  return state.todos;
}

/**
 * check if user input is valid
 * valid: string with at least 3 chars AND no duplicate description in todo list
 * @param {string} inputValue
 * @returns true or false
 */
function isInputValid(inputValue) {
  const foundMatchingDescription = state.todos.find(
    (e) => e.description.toLowerCase() === inputValue.toLowerCase()
  );

  return inputValue.length >= 3 && !foundMatchingDescription;
}

/*******************************************************************/
/******* rendering *******/

function render() {
  todoList.innerHTML = "";
  const filteredTodos = filterTodos();

  filteredTodos.forEach((todo) => createTodoItemMarkup(todo));
}

function createTodoItemMarkup(todo) {
  const listItem = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("value", todo.id);
  checkbox.setAttribute("name", "todos");
  checkbox.checked = todo.done;

  checkbox.addEventListener("change", toggleDoneStatus);

  const todoDescriptionLabel = document.createElement("label");
  todoDescriptionLabel.setAttribute("for", todo.id);
  const todoDescriptionTxt = document.createTextNode(todo.description);
  todoDescriptionLabel.appendChild(todoDescriptionTxt);

  listItem.append(checkbox, todoDescriptionLabel);
  todoList.appendChild(listItem);
}
