/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer } from "react";
import { Todo } from "@/types/Todo";

type TodoState = {
  todos: Todo[];
};

type TodoAction =
  | { type: "SET_TODOS"; todos: Todo[] }
  | { type: "ADD_TODO"; todo: Todo }
  | { type: "UPDATE_TODO"; todo: Todo }
  | { type: "DELETE_TODO"; id: number };

const initialState: TodoState = {
  todos: [],
};

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case "SET_TODOS":
      return { ...state, todos: action.todos };
    case "ADD_TODO":
      return { ...state, todos: [action.todo, ...state.todos] };
    case "UPDATE_TODO":
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.todo.id ? action.todo : t
        ),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((t) => t.id !== action.id),
      };
    default:
      return state;
  }
}

type TodoContextProps = {
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
};

export const TodoContext = createContext<TodoContextProps | null>(null);

type TodoProviderProps = {
  children: React.ReactNode;
};

export function TodoProvider({ children }: TodoProviderProps) {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}
