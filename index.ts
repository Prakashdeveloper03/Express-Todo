import express from "express";
import "reflect-metadata";
import { Request, Response } from "express";
import { createConnection, FindOneOptions } from "typeorm";
import { Todo } from "./models/todo";

const app = express();

createConnection({
  type: "sqlite",
  database: "db.sqlite",
  synchronize: true,
  entities: [Todo],
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error);
  });

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", async (req: Request, res: Response) => {
  const todoList = await Todo.find();
  res.render("base", { todoList });
});

app.post("/add", async (req: Request, res: Response) => {
  const { title } = req.body;
  const newTodo = Todo.create({ title, complete: false });
  await newTodo.save();
  res.redirect("/");
});

app.get("/update/:todoId", async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const todo = await Todo.findOneOrFail({ where: { id: parseInt(todoId) } });
  todo.complete = !todo.complete;
  await todo.save();
  res.redirect("/");
});

app.get("/delete/:todoId", async (req: Request, res: Response) => {
  const { todoId } = req.params;
  const todo = await Todo.findOneOrFail({ where: { id: parseInt(todoId) } });
  await todo.remove();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
