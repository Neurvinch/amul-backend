import Todo from "../models/TodosSchema.js";

export const listTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch todos" });
  }
};

export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title || !description) return res.status(400).json({ message: "title and description required" });
    const todo = await Todo.create({ title, description, user: req.userId });
    return res.status(201).json(todo);
  } catch (err) {
    return res.status(500).json({ message: "Failed to create todo" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body || {};
    const update = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    const todo = await Todo.findOneAndUpdate({ _id: id, user: req.userId }, update, { new: true });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.json(todo);
  } catch (err) {
    return res.status(500).json({ message: "Failed to update todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete todo" });
  }
};
