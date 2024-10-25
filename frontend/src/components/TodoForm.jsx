import { useState } from 'react';

export default function TodoForm({ onSubmit, initialData }) {
  const [todo, setTodo] = useState(initialData || {
    title: '',
    description: '',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(todo);
    if (!initialData) {
      setTodo({ title: '', description: '', deadline: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={todo.title}
        onChange={(e) => setTodo({...todo, title: e.target.value})}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={todo.description}
        onChange={(e) => setTodo({...todo, description: e.target.value})}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="datetime-local"
        value={todo.deadline}
        onChange={(e) => setTodo({...todo, deadline: e.target.value})}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
        {initialData ? 'Update Todo' : 'Add Todo'}
      </button>
    </form>
  );
}   