import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "@/utils/api";
import { useTodos } from "../hooks/useTodos";
import { Todo } from "@/types/Todo";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const { state: authState } = useAuth();
  const { state: todoState, dispatch } = useTodos();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/");
      return;
    }

    // Set the authorization header with the token
    api.defaults.headers.common["Authorization"] = `Bearer ${authState.token}`;

    const fetchTodos = async () => {
      try {
        const res = await api.get("/todos");
        dispatch({ type: "SET_TODOS", todos: res.data });
      } catch (err) {
        console.error(err);
        setError("Failed to load todos.");
      }
    };

    fetchTodos();
  }, [authState.isAuthenticated, authState.token, navigate, dispatch]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditTodoId(null);
    setCompleted(false);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      if (editTodoId !== null) {
        // Update todo
        const res = await api.put(`/todos/${editTodoId}`, {
          title,
          description,
          dueDate,
          completed,
        });
        dispatch({ type: "UPDATE_TODO", todo: res.data });
      } else {
        // Create new todo
        const res = await api.post("/todos", {
          title,
          description,
          dueDate,
          completed,
        });
        dispatch({ type: "ADD_TODO", todo: res.data });
      }
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to save todo.");
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditTodoId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate);
    setCompleted(todo.completed);
    setError("");
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      dispatch({ type: "DELETE_TODO", id });
    } catch (err) {
      console.error(err);
      setError("Failed to delete todo.");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Todos</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow"
      >
        <h3 className="text-xl font-semibold mb-4">
          {editTodoId ? "Edit Todo" : "Add New Todo"}
        </h3>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="border border-gray-300 rounded w-full p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="border border-gray-300 rounded w-full p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="dueDate" className="block mb-1 font-medium">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className="border border-gray-300 rounded w-full p-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="mb-4 flex items-center space-x-2">
          <input
            id="completed"
            type="checkbox"
            checked={completed}
            onChange={() => setCompleted(!completed)}
          />
          <label htmlFor="completed" className="font-medium">
            Completed
          </label>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            {editTodoId ? "Update Todo" : "Add Todo"}
          </button>
          {editTodoId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <ul className="space-y-4">
        {todoState.todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white p-4 rounded shadow flex justify-between items-start"
          >
            <div>
              <h4 className="text-lg font-semibold">{todo.title}</h4>
              <p className="text-sm text-gray-600">{todo.description}</p>
              <p className="text-sm">Due: {todo.dueDate}</p>
              <p className="text-sm">
                {todo.completed ? "Completed" : "Not Completed"}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(todo)}
                className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
