import { useState, useEffect } from 'react';
import { todoApi } from './api/todos';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const created = await todoApi.create(newTodo);
      setTodos([created, ...todos]);
      setShowForm(false);
      setNewTodo({
        title: '',
        description: '',
        deadline: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>Todo List</h1>
      
      {showForm && (
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #646cff', borderRadius: '8px' }}>
          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              placeholder="Title"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #646cff' }}
              required
            />
            <textarea
              placeholder="Description"
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #646cff' }}
              required
            />
            <input
              type="date"
              value={newTodo.deadline}
              onChange={(e) => setNewTodo({ ...newTodo, deadline: e.target.value })}
              style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#1a1a1a', color: 'white', border: '1px solid #646cff' }}
              required
            />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit">Add Todo</button>
            </div>
          </form>
        </div>
      )}

      {todos.length === 0 && !showForm ? (
        <p>No todos found. Add your first todo!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {todos.map(todo => (
            <div 
              key={todo._id} 
              style={{
                border: '1px solid #646cff',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#1a1a1a'
              }}
            >
              <h3 style={{ fontSize: '1.5em', marginBottom: '0.5rem' }}>
                {todo.title}
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>{todo.description}</p>
              <p style={{ fontSize: '0.9em', color: '#888' }}>
                Deadline: {new Date(todo.deadline).toLocaleDateString()}
              </p>
              <button
                onClick={() => console.log('Todo clicked:', todo._id)}
                style={{ marginTop: '1rem' }}
              >
                Mark as {todo.completed ? 'Incomplete' : 'Complete'}
              </button>
            </div>
          ))}
        </div>
      )}

      {!showForm && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button onClick={() => setShowForm(true)}>
            Add New Todo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;