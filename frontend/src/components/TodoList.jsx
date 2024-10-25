export default function TodoList({ todos, onUpdate, onDelete }) {
    return (
      <div className="space-y-4">
        {todos.map(todo => (
          <div key={todo._id} className="p-4 border rounded">
            <h3 className="font-bold">{todo.title}</h3>
            <p>{todo.description}</p>
            <p className="text-sm text-gray-500">
              Deadline: {new Date(todo.deadline).toLocaleString()}
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => onUpdate(todo)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }