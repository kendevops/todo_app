import { TodoAction, todoReducer } from '@/context/TodoContext'; // assuming it's exported for testing

describe('todoReducer', () => {
    const initialState = { todos: [] };

    it('should set todos', () => {
        const todos = [{ id: 1, title: 'Test Todo', description: '', dueDate: '', completed: false }];
        const action: TodoAction = { type: 'SET_TODOS', todos };
        const newState = todoReducer(initialState, action);
        expect(newState.todos).toEqual(todos);
    });

    it('should add a todo', () => {
        const newTodo = { id: 2, title: 'New Todo', description: '', dueDate: '', completed: false };
        const action: TodoAction = { type: 'ADD_TODO', todo: newTodo };
        const newState = todoReducer(initialState, action);
        expect(newState.todos).toContainEqual(newTodo);
    });

    it('should update a todo', () => {
        const initial = { todos: [{ id: 3, title: 'Old Title', description: '', dueDate: '', completed: false }] };
        const updatedTodo = { id: 3, title: 'Updated Title', description: '', dueDate: '', completed: true };
        const action: TodoAction = { type: 'UPDATE_TODO', todo: updatedTodo };
        const newState = todoReducer(initial, action);
        expect(newState.todos[0]).toEqual(updatedTodo);
    });

    it('should delete a todo', () => {
        const initial = { todos: [{ id: 4, title: 'To be deleted', description: '', dueDate: '', completed: false }] };
        const action: TodoAction = { type: 'DELETE_TODO', id: 4 };
        const newState = todoReducer(initial, action);
        expect(newState.todos.length).toBe(0);
    });
});