import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { todoApi } from '../api/todos';

// Mock the todoApi
vi.mock('../api/todos', () => ({
  todoApi: {
    getAll: vi.fn(),
    create: vi.fn()
  }
}));

describe('App', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  it('should show loading state initially', async () => {
    todoApi.getAll.mockImplementation(() => new Promise(() => {})); // Never resolves
    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show empty state when no todos exist', async () => {
    todoApi.getAll.mockResolvedValue([]);
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('No todos found. Add your first todo!')).toBeInTheDocument();
    });
  });

  it('should display todos when they exist', async () => {
    const mockTodos = [
      {
        _id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        deadline: '2024-10-26',
        completed: false
      }
    ];

    todoApi.getAll.mockResolvedValue(mockTodos);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  it('should be able to open and close the add todo form', async () => {
    todoApi.getAll.mockResolvedValue([]);
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Add New Todo')).toBeInTheDocument();
    });

    // Open form
    fireEvent.click(screen.getByText('Add New Todo'));
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();

    // Close form
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();
  });

  it('should be able to add a new todo', async () => {
    const newTodo = {
      _id: '1',
      title: 'New Todo',
      description: 'New Description',
      deadline: '2024-10-26',
      completed: false
    };

    todoApi.getAll.mockResolvedValue([]);
    todoApi.create.mockResolvedValue(newTodo);
    
    render(<App />);

    // Wait for initial load and click add button
    await waitFor(() => {
      fireEvent.click(screen.getByText('Add New Todo'));
    });

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New Todo' }
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'New Description' }
    });

    // Get the date input by its type attribute
    const dateInput = screen.getByDisplayValue(new Date().toISOString().split('T')[0]);
    fireEvent.change(dateInput, {
      target: { value: '2024-10-26' }
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Add Todo' }));

    // Verify todo was added
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
      expect(screen.getByText('New Description')).toBeInTheDocument();
    });

    // Verify API was called correctly
    expect(todoApi.create).toHaveBeenCalledWith({
      title: 'New Todo',
      description: 'New Description',
      deadline: '2024-10-26'
    });
  });

  it('should handle API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    todoApi.getAll.mockRejectedValue(new Error('API Error'));
    
    render(<App />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading todos:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});