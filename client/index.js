// サーバーからTODOリストを取得して表示する
const fetchAndDisplayTodoList = async () => {
  const response = await fetch("http://localhost:8000/");
  const todoList = await response.json();

  const todoListElement = document.getElementById("todo-list");
  todoListElement.innerHTML = "";

  todoList.forEach((todo) => {
    // チェックボックスを生成
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    // チェックボックスの状態が変更されたときに、updateTodoStatus関数を呼び出す
    checkbox.addEventListener("change", function () {
      updateTodoStatus(todo.id, this.checked);
    });

    // テキストボックスを生成
    // <input type="text" class="task-textbox" value="..." />
    const textbox = document.createElement("input");
    textbox.type = "text";
    textbox.value = todo.title;
    textbox.classList.add("task-textbox");

    // テキストボックスの値が変更されたときに、updateTodoTitle関数を呼び出す
    textbox.addEventListener("change", function () {
      updateTodoTitle(todo.id, this.value);
    });

    // 削除ボタンを生成
    // <button class="delete-button">削除</button>
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.classList.add("delete-button");

    // 削除ボタンがクリックされたときに、deleteTodo関数を呼び出す
    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    // <div>
    //   <input type="checkbox" />
    //   <input type="text" class="task-textbox" value="..." />
    //   <button class="delete-button">削除</button>
    // </div>
    const todoElement = document.createElement("div");
    todoElement.appendChild(checkbox);
    todoElement.appendChild(textbox);
    todoElement.appendChild(deleteButton);

    todoListElement.appendChild(todoElement);
  });
};

// サーバー上のTODOアイテムの completed を更新する
const updateTodoStatus = async (id, completed) => {
  const response = await fetch(`http://localhost:8000/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (response.status === 200) {
    fetchAndDisplayTodoList();
  }
};

// サーバー上のTODOアイテムの title を更新する
const updateTodoTitle = async (id, title) => {
  const response = await fetch(`http://localhost:8000/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (response.status === 200) {
    fetchAndDisplayTodoList();
  }
};

// サーバーに新しいTODOアイテムを追加する
const addTodo = async () => {
  const todoTitleInput = document.getElementById("todo-title");
  const todoTitle = todoTitleInput.value;

  if (todoTitle) {
    const response = await fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: todoTitle }),
    });

    if (response.status === 200) {
      todoTitleInput.value = "";
      fetchAndDisplayTodoList();
    }
  }
};

// サーバーからTODOアイテムを削除する
const deleteTodo = async (id) => {
  const response = await fetch(`http://localhost:8000/${id}`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    fetchAndDisplayTodoList();
  }
};

// ボタンが押されたときにaddTodo関数を呼び出す
const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addTodo);

document.addEventListener("DOMContentLoaded", fetchAndDisplayTodoList);
