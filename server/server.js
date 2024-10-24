import { cors } from "hono/cors";
import Database from "better-sqlite3";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();
const db = new Database('todo.db');

app.use(cors({ origin: "*" }));

// todoテーブルが存在しなければ作成するSQL
const createTodoTableQuery = db.prepare(`
  CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL
  );
`);

// todoテーブルが存在しなければ作成
createTodoTableQuery.run();

// `todo`テーブルから全てのデータを取得するSQL
const getTodoListQuery = db.prepare(`
  SELECT * FROM todo;
`);

app.get("/", async (c) => {
  // `todo`テーブルから全てのデータを取得
  const todos = getTodoListQuery.all();

  return c.json(todos, 200);
});

const insertTodoQuery = db.prepare(`
  INSERT INTO todo (title, completed) VALUES (?, ?);
  `);
  
  app.post("/", async (c) => {
    const param = await c.req.json();
  
    if (!param.title) {
      throw new HttpException(400, { message: "Title must be provided" });
    }
  
    const newTodo = {
      completed: param.completed ? 1 : 0,
      title: param.title,
    };
  
    // リクエストに渡されたデータをDBに挿入
    insertTodoQuery.run(newTodo.title, newTodo.completed);
  
    return c.json({ message: "Successfully created" }, 200);
});

// 指定されたIDのtodoを取得するSQL
const getTodoQuery = db.prepare(`
  SELECT * FROM todo WHERE id = ?;
  `);
  // 指定されたIDのtodoのtitleとcompletedを更新するSQL
  const updateTodoQuery = db.prepare(`
  UPDATE todo SET title = ?, completed = ? WHERE id = ?;
  `);
  
  
app.put("/:id", async (c) => {
  const param = await c.req.json();
  const id = c.req.param("id");

  if (!param.title && param.completed === undefined) {
    throw new HTTPException(400, { message: "Either title or completed must be provided" });
  }

  // 指定されたIDのtodoを取得
  const todo = getTodoQuery.get(id);
  if (!todo) {
    throw new HTTPException(400, { message: "Failed to update task title" });
  }

  if (param.title) {
    todo.title = param.title;
  }

  if (param.completed !== undefined) {
    todo.completed = param.completed ? 1 : 0;
  }

  // リクエストに渡されたデータをDBに更新
  updateTodoQuery.run(todo.title, todo.completed, id);

  return c.json({ message: "Task updated" }, 200);
});

// 指定されたIDのtodoを削除するSQL
const deleteTodoQuery = db.prepare(`
  DELETE FROM todo WHERE id = ?;
`);

app.delete("/:id", async (c) => {
  const id = c.req.param("id");

  // 指定されたIDのtodoを取得
  const todo = getTodoQuery.get(id);

  // もし指定されたIDのtodoが存在しない場合はエラーを返す
  if (!todo) {
    throw new HTTPException(400, { message: "Failed to delete task" });
  }

  // 指定されたIDのtodoを削除
  deleteTodoQuery.run(id);
  return c.json({ message: "Task deleted" }, 200);
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse()
  }
});

serve({
  fetch: app.fetch,
  port: 8000,
});
