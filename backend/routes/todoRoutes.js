import { Router } from "express";
import { listTodos, createTodo, updateTodo, deleteTodo } from "../controller/todosController.js";
import { verifyToken } from "../middleware/middleware.js";

const router = Router();

router.get("/todos", verifyToken, listTodos);
router.post("/todos", verifyToken, createTodo);
router.put("/todos/:id", verifyToken, updateTodo);
router.delete("/todos/:id", verifyToken, deleteTodo);

export default router;
