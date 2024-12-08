import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
// import api from "@/utils/api";
import { useTodos } from "../hooks/useTodos";
import { useNavigate } from "react-router-dom";
import { Todo } from "@/types/todo";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/hooks/use-toast";
import { LogOutIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { z } from "zod";


// Todo schema
const todoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(), // We can also refine if we want to ensure a valid date.
  completed: z.boolean(),
});

const TodoList = () => {
  const { state: authState, dispatch: authDispatch } = useAuth();
  const { state: todoState, dispatch } = useTodos();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [completionFilter, setCompletionFilter] = useState<
    "all" | "completed" | "notCompleted"
  >("all");
  const [dueDateFilter, setDueDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [searchTerm, setSearchTerm] = useState("");

  /* Wrote this incase the requirement needs todos to be done from the backend */
  //   useEffect(() => {
  //     if (!authState.isAuthenticated) {
  //       navigate("/auth/login");
  //       return;
  //     }

  //     // Set the authorization header with the token
  //     api.defaults.headers.common["Authorization"] = `Bearer ${authState.token}`;

  //     const fetchTodos = async () => {
  //       try {
  //         const res = await api.get("/todos");
  //         dispatch({ type: "SET_TODOS", todos: res.data });
  //       } catch (err) {
  //         console.error(err);
  //         setError("Failed to load todos.");
  //       }
  //     };

  //     fetchTodos();
  //   }, [authState.isAuthenticated, authState.token, navigate, dispatch]);

  //   const resetForm = () => {
  //     setTitle("");
  //     setDescription("");
  //     setDueDate("");
  //     setEditTodoId(null);
  //     setCompleted(false);
  //     setError("");
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();

  //     if (!title.trim()) {
  //       setError("Title is required.");
  //       return;
  //     }

  //     try {
  //       if (editTodoId !== null) {
  //         // Update todo
  //         const res = await api.put(`/todos/${editTodoId}`, {
  //           title,
  //           description,
  //           dueDate,
  //           completed,
  //         });
  //         dispatch({ type: "UPDATE_TODO", todo: res.data });
  //       } else {
  //         // Create new todo
  //         const res = await api.post("/todos", {
  //           title,
  //           description,
  //           dueDate,
  //           completed,
  //         });
  //         dispatch({ type: "ADD_TODO", todo: res.data });
  //       }
  //       resetForm();
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to save todo.");
  //     }
  //   };

  //   const handleEdit = (todo: Todo) => {
  //     setEditTodoId(todo.id);
  //     setTitle(todo.title);
  //     setDescription(todo.description);
  //     setDueDate(todo.dueDate);
  //     setCompleted(todo.completed);
  //     setError("");
  //   };

  //   const handleDelete = async (id: number) => {
  //     try {
  //       await api.delete(`/todos/${id}`);
  //       dispatch({ type: "DELETE_TODO", id });
  //     } catch (err) {
  //       console.error(err);
  //       setError("Failed to delete todo.");
  //     }
  //   };

  // On mount, load todos from localStorage

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate("/");
      return;
    }

    try {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        const parsed = JSON.parse(storedTodos) as Todo[];
        dispatch({ type: "SET_TODOS", todos: parsed });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load todos from localStorage.");
    }
  }, [authState.isAuthenticated, navigate, dispatch]);

  // Whenever todos change, sync them with localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoState.todos));
  }, [todoState.todos]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setEditTodoId(null);
    setCompleted(false);
    setError("");
  };

  const handleOpenModalForCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

   const result = todoSchema.safeParse({
     title,
     description,
     dueDate: dueDate || undefined, // if empty string, make it undefined
     completed,
   });

   if (!result.success) {
     setError(result.error.issues[0].message);
     return;
   }

    if (editTodoId !== null) {
      const updatedTodo: Todo = {
        id: editTodoId,
        title,
        description,
        dueDate,
        completed,
      };
      toast({
        title: "Todo Updated successfully!",
        variant: "success",
      });
      dispatch({ type: "UPDATE_TODO", todo: updatedTodo });
    } else {
      const newId =
        todoState.todos.length > 0
          ? Math.max(...todoState.todos.map((t) => t.id)) + 1
          : 1;

      const newTodo: Todo = {
        id: newId,
        title,
        description,
        dueDate,
        completed,
      };
      toast({
        title: "Todo Created successfully!",
        variant: "success",
      });
      dispatch({ type: "ADD_TODO", todo: newTodo });
    }

    resetForm();
    setShowModal(false);
  };

  const handleOpenModalForEdit = (todo: Todo) => {
    setEditTodoId(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    setDueDate(todo.dueDate);
    setCompleted(todo.completed);
    setError("");
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Todo Deleted successfully!",
      variant: "success",
    });
    dispatch({ type: "DELETE_TODO", id });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast({
      title: "Logged out successfully!!",
    });
    authDispatch({ type: "LOGOUT" });
    navigate("/");
  };

  const handleToggleCompletion = (todo: Todo) => {
    const updatedTodo: Todo = { ...todo, completed: !todo.completed };
    dispatch({ type: "UPDATE_TODO", todo: updatedTodo });
    toast({
      title: `Todo marked as ${
        updatedTodo.completed ? "completed" : "incomplete"
      }!`,
      variant: "success",
    });
  };

  const displayedTodos = useMemo(() => {
    let filtered = [...todoState.todos];

    if (completionFilter === "completed") {
      filtered = filtered.filter((t) => t.completed);
    } else if (completionFilter === "notCompleted") {
      filtered = filtered.filter((t) => !t.completed);
    }

    if (dueDateFilter) {
      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        const todoDate = new Date(t.dueDate);
        const filterDate = new Date(dueDateFilter);
        return todoDate <= filterDate;
      });
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          t.description.toLowerCase().includes(lowerSearch)
      );
    }

    filtered.sort((a, b) => {
      const compare = a.title.localeCompare(b.title, "en", {
        sensitivity: "base",
      });
      return sortOrder === "asc" ? compare : -compare;
    });

    return filtered;
  }, [todoState.todos, completionFilter, dueDateFilter, sortOrder, searchTerm]);

  return (
    <div className="p-4 max-w-2xl mx-auto text-card-foreground">
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">My Todos</h2>
        <div>
          <ModeToggle />
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-2 rounded hover:bg-red-700 ml-4"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Nav Bar */}
      <nav className="flex items-center justify-between mb-6 bg-accent p-4 rounded shadow">
        <button
          onClick={handleOpenModalForCreate}
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Create Todo
        </button>
        <input
          type="text"
          placeholder="Search todos..."
          className="border border-gray-300 text-black rounded-lg p-2 w-1/2"
          disabled={displayedTodos.length === 0 && true}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </nav>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-6 bg-accent p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Filters & Sorting</h3>
        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
          <div className="mb-4 md:mb-0">
            <label
              htmlFor="completionFilter"
              className="block mb-1 font-medium"
            >
              Completion
            </label>
            <select
              id="completionFilter"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={completionFilter}
              onChange={(e) =>
                setCompletionFilter(
                  e.target.value as "all" | "completed" | "notCompleted"
                )
              }
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="notCompleted">Not Completed</option>
            </select>
          </div>

          <div className="mb-4 md:mb-0">
            <label htmlFor="dueDateFilter" className="block mb-1 font-medium">
              Due Before or On
            </label>
            <input
              id="dueDateFilter"
              type="date"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="sortOrder" className="block mb-1 font-medium">
              Sort by Title
            </label>
            <select
              id="sortOrder"
              className="border border-gray-300 rounded p-2 w-full text-black"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {displayedTodos.length === 0 ? (
        <div className="text-foreground text-center text-3xl font-bold">
          No Created Todos yet!
        </div>
      ) : (
        <ul className="space-y-4">
          {displayedTodos.map((todo) => (
            <li
              key={todo.id}
              className="bg-accent p-4 rounded shadow flex justify-between items-start"
            >
              <div>
                <div className="flex items-center mb-2">
                  <h4
                    className={`text-lg font-semibold ${
                      todo.completed
                        ? "line-through decoration-4 decoration-green-700"
                        : ""
                    }`}
                  >
                    {todo.title}
                  </h4>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleCompletion(todo)}
                    className="ml-4"
                  />
                </div>
                <p
                  className={`text-sm ${
                    todo.completed
                      ? "line-through decoration-4 decoration-green-700"
                      : ""
                  }`}
                >
                  {todo.description}
                </p>
                <p
                  className={`text-sm mb-4 ${
                    todo.completed
                      ? "line-through decoration-4 decoration-green-700"
                      : ""
                  }`}
                >
                  Due: {todo.dueDate}
                </p>
                <p
                  className={`text-sm ${
                    todo.completed ? "text-green-800" : ""
                  }`}
                >
                  {todo.completed ? "Completed" : "Not Completed"}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenModalForEdit(todo)}
                  className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700">
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to{" "}
                        <span className="text-red-600">Delete</span>?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your todo and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(todo.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-accent p-6 rounded shadow w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-4">
              {editTodoId ? "Edit Todo" : "Add New Todo"}
            </h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1 font-medium">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  className="border border-gray-300 rounded w-full p-2 text-black"
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
                  className="border border-gray-300 rounded w-full p-2 text-black"
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
                  className="border border-gray-300 rounded w-full p-2 text-black"
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

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                  {editTodoId ? "Update Todo" : "Add Todo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoList;
