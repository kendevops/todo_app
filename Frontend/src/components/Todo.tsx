// import { useState, useEffect } from "react";
// import api from "../utils/api";
// import { Todo } from "../types/todo";
// import { ToastContainer, toast } from "react-toastify";

// export default function Todos() {
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [newTodo, setNewTodo] = useState({
//     title: "",
//     description: "",
//     dueDate: "",
//   });
//   const [editTodo, setEditTodo] = useState<Todo | null>(null);

//   // Fetch all todos
//   const fetchTodos = async () => {
//     try {
//       const { data } = await api.get("/todos");
//       setTodos(data);
//     } catch (error) {
//       toast.error("Failed to fetch todos.");
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchTodos();
//   }, []);

//   // Create a new todo
//   const handleCreateTodo = async () => {
//     if (!newTodo.title || !newTodo.dueDate) {
//       toast.error("Title and due date are required.");
//       return;
//     }

//     try {
//       const { data } = await api.post("/todos", newTodo);
//       setTodos([...todos, data]);
//       setNewTodo({ title: "", description: "", dueDate: "" });
//       toast.success("Todo created successfully.");
//     } catch (error) {
//       toast.error("Failed to create todo.");
//       console.error(error);
//     }
//   };

//   // Update an existing todo
//   const handleUpdateTodo = async () => {
//     if (!editTodo) return;

//     try {
//       const { data } = await api.put(`/todos/${editTodo.id}`, editTodo);
//       setTodos(todos.map((todo) => (todo.id === data.id ? data : todo)));
//       setEditTodo(null);
//       toast.success("Todo updated successfully.");
//     } catch (error) {
//       toast.error("Failed to update todo.");
//       console.error(error);
//     }
//   };

//   // Delete a todo
//   const handleDeleteTodo = async (id: number) => {
//     try {
//       await api.delete(`/todos/${id}`);
//       setTodos(todos.filter((todo) => todo.id !== id));
//       toast.success("Todo deleted successfully.");
//     } catch (error) {
//       toast.error("Failed to delete todo.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen p-4 bg-gray-100">
//       <h1 className="text-2xl font-bold mb-4">Todo List</h1>

//       {/* Create Todo */}
//       <div className="bg-white p-4 rounded shadow mb-4">
//         <h2 className="font-bold mb-2">Add New Todo</h2>
//         <input
//           type="text"
//           placeholder="Title"
//           value={newTodo.title}
//           onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <textarea
//           placeholder="Description"
//           value={newTodo.description}
//           onChange={(e) =>
//             setNewTodo({ ...newTodo, description: e.target.value })
//           }
//           className="w-full mb-2 p-2 border rounded"
//         ></textarea>
//         <input
//           type="date"
//           value={newTodo.dueDate}
//           onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
//           className="w-full mb-2 p-2 border rounded"
//         />
//         <button
//           onClick={handleCreateTodo}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Add Todo
//         </button>
//       </div>

//       {/* List Todos */}
//       <div>
//         {todos.map((todo) => (
//           <div
//             key={todo.id}
//             className="bg-white p-4 rounded shadow mb-2 flex justify-between"
//           >
//             <div>
//               <h3 className="font-bold">{todo.title}</h3>
//               <p>{todo.description}</p>
//               <p className="text-sm text-gray-500">
//                 Due: {new Date(todo.dueDate).toLocaleDateString()}
//               </p>
//               <p>
//                 Status:{" "}
//                 {todo.status ? (
//                   <span className="text-green-500">Completed</span>
//                 ) : (
//                   <span className="text-red-500">Pending</span>
//                 )}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setEditTodo(todo)}
//                 className="text-blue-500 underline"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDeleteTodo(todo.id)}
//                 className="text-red-500 underline"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Edit Todo Modal */}
//       {editTodo && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded shadow">
//             <h2 className="font-bold mb-2">Edit Todo</h2>
//             <input
//               type="text"
//               value={editTodo.title}
//               onChange={(e) =>
//                 setEditTodo({ ...editTodo, title: e.target.value })
//               }
//               className="w-full mb-2 p-2 border rounded"
//             />
//             <textarea
//               value={editTodo.description}
//               onChange={(e) =>
//                 setEditTodo({ ...editTodo, description: e.target.value })
//               }
//               className="w-full mb-2 p-2 border rounded"
//             ></textarea>
//             <input
//               type="date"
//               value={editTodo.dueDate}
//               onChange={(e) =>
//                 setEditTodo({ ...editTodo, dueDate: e.target.value })
//               }
//               className="w-full mb-2 p-2 border rounded"
//             />
//             <button
//               onClick={handleUpdateTodo}
//               className="bg-green-500 text-white px-4 py-2 rounded mr-2"
//             >
//               Save
//             </button>
//             <button
//               onClick={() => setEditTodo(null)}
//               className="bg-gray-500 text-white px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       <ToastContainer />
//     </div>
//   );
// }
