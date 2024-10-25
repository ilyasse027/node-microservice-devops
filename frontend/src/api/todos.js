const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/todos';

export const todoApi = {
  async getAll() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched todos:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch todos:', error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch todo ${id}:`, error.message);
      throw error;
    }
  },

  async create(todo) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Created todo:', data);
      return data;
    } catch (error) {
      console.error('Failed to create todo:', error.message);
      throw error;
    }
  },

  async update(id, todo) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Updated todo:', data);
      return data;
    } catch (error) {
      console.error(`Failed to update todo ${id}:`, error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log(`Deleted todo ${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to delete todo ${id}:`, error.message);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      const todo = await this.getById(id);
      return await this.update(id, {
        ...todo,
        completed: !todo.completed,
      });
    } catch (error) {
      console.error(`Failed to toggle todo ${id}:`, error.message);
      throw error;
    }
  }
};