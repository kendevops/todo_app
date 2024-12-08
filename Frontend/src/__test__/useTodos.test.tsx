import React from "react";
import { render, screen } from "@testing-library/react";
import { TodoProvider } from "../context/TodoContext";
import { useTodos } from "../hooks/useTodos";
const TestTodoComponent = () => {
  const { state, dispatch } = useTodos();

  React.useEffect(() => {
    dispatch({
      type: "ADD_TODO",
      todo: {
        id: 1,
        title: "Test",
        description: "",
        dueDate: "",
        completed: false,
      },
    });
  }, [dispatch]);

  return <p data-testid="count">{state.todos.length}</p>;
};

describe("useTodos", () => {
  it("should add a todo on mount", () => {
    render(
      <TodoProvider>
        <TestTodoComponent />
      </TodoProvider>
    );
    expect(screen.getByTestId("count").textContent).toBe("1");
  });
});
