<template>
  <div class="app-container">
    <!-- Sidebar principal -->
    <div class="sidebar">
      <h2 class="sidebar-title">Categorías</h2>
      <div class="category-list">
        <!-- Botón para añadir categorías -->
        <div class="add-category">
          <input
            type="text"
            v-model="newCategoryName"
            placeholder="Nueva categoría"
            @keyup.enter="addCategory"
          />
          <button class="add-btn" @click="addCategory">+</button>
        </div>

        <!-- Lista de categorías -->
        <div
          class="category-item"
          v-for="category in categories"
          :key="category.id"
          @click="filterTasksByCategory(category.id)"
          :class="{ active: selectedCategory === category.id }"
        >
          <span>{{ category.name }}</span>
          <button class="add-btn" @click.stop="deleteCategory(category.id)">
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar de edición -->
    <div class="edit-sidebar" v-if="selectedTask">
      <div class="sidebar-header">
        <h3>Editar Tarea</h3>
        <button class="close-btn" @click="closeEdit">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="sidebar-content">
        <div class="form-group">
          <label>Título de la tarea</label>
          <input type="text" class="form-input" v-model="selectedTask.task" />
        </div>

        <div class="form-group">
          <label>Categoría</label>
          <select v-model="selectedTask.category" class="form-input">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Estado</label>
          <div class="status-buttons">
            <button
              v-for="status in avilablestatus"
              :key="status"
              class="status-btn"
              :class="{
                active: selectedTask.status === status,
                [status.toLowerCase().replace(' ', '-')]: true,
              }"
              @click="updateStatus(status)"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <div class="action-buttons">
          <button class="save-btn" @click="saveChanges">Guardar cambios</button>
          <button class="cancel-btn" @click="closeEdit">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="main-content" :class="{ 'sidebar-open': selectedTask }">
      <div class="header">
        <h1 class="app-title">Mi día</h1>
        <div class="date">sábado, 8 de marzo</div>

        <div class="input-container">
          <input
            type="text"
            placeholder="Agregar una tarea"
            v-model="TaskText"
            @keyup.enter="AddTask"
          />
          <button class="add-task-btn" @click="AddTask">Agregar</button>
        </div>
      </div>

      <div class="task-list">
        <div class="task-item" v-for="task in filteredTasks" :key="task.id">
          <div class="task-content">
            <div
              class="checkbox"
              :class="{ checked: task.status === 'Done' }"
              @click="done(task.id)"
            >
              <i class="fas fa-check"></i>
            </div>

            <span
              class="task-text"
              :class="{ completed: task.status === 'Done' }"
            >
              {{ task.task }}
            </span>

            <div class="status-pill" :class="statusClass(task.status)">
              {{ task.status }}
            </div>
          </div>

          <div class="task-actions">
            <button class="icon-btn edit-btn" @click="edit(task.id)">
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="icon-btn delete-btn" @click="deleteTask(task.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/axios';
import axios from 'axios';
export default {
  name: 'MicrosoftTodoClone',
  data() {
    return {
      selectedTask: null,
      TaskText: '',
      apidata: [],
      editedtask: null,
      avilablestatus: ['To Do', 'In Progress', 'Done'],
      categories: [],
      selectedCategory: null,
      newCategoryName: '',
    };
  },
  computed: {
    // Filtra las tareas según la categoría seleccionada
    filteredTasks() {
      if (this.selectedCategory) {
        return this.apidata.filter(
          (task) => task.category === this.selectedCategory
        );
      }
      return this.apidata;
    },
  },
  methods: {
    // Obtiene las categorías desde el backend
    async fetchCategories() {
      try {
        const response = await api.get('/categories/');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    // Añade una nueva categoría
    async addCategory() {
      if (!this.newCategoryName) return;
      try {
        const response = await api.post('/categories/', {
          name: this.newCategoryName,
        });
        this.categories.push(response.data);
        this.newCategoryName = '';
      } catch (error) {
        console.error('Error adding category:', error);
      }
    },
    // Elimina una categoría
    async deleteCategory(categoryId) {
      try {
        await api.delete(`/categories/${categoryId}/`);
        this.categories = this.categories.filter(
          (cat) => cat.id !== categoryId
        );
        if (this.selectedCategory === categoryId) {
          this.selectedCategory = null;
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    // Filtra las tareas por categoría
    filterTasksByCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.listapitasks();
    },
    // Prepara la edición de una tarea
    edit(taskId) {
      this.selectedTask = {
        ...this.apidata.find((task) => task.id === taskId),
      };
      this.TaskText = '';
      this.editedtask = null;
    },
    // Guarda los cambios de edición
    async saveChanges() {
      try {
        await api.put(`/editTask/${this.selectedTask.id}`, {
          task: this.selectedTask.task,
          status: this.selectedTask.status,
          category: this.selectedTask.category,
        });
        this.listapitasks();
        this.closeEdit();
      } catch (error) {
        console.error('Error saving changes:', error);
      }
    },
    updateStatus(newStatus) {
      this.selectedTask.status = newStatus;
    },
    closeEdit() {
      this.selectedTask = null;
    },
    statusClass(status) {
      return {
        'To-Do': status === 'To Do',
        'In-Progress': status === 'In Progress',
        Done: status === 'Done',
      };
    },
    // Lista las tareas desde el backend
    async listapitasks() {
      try {
        const params = this.selectedCategory
          ? { category: this.selectedCategory }
          : {};
        const response = await api.get('/tasks/', { params });
        this.apidata = response.data;
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    // Crea una nueva tarea
    async AddTask() {

      if (!this.TaskText) return;
      try {
        await api.post('/create/', {
          task: this.TaskText,
          status: 'To Do',
          category: this.selectedCategory,
        });
        this.listapitasks();
        this.TaskText = '';
      } catch (error) {
        console.error('Error creating task:', error);
        console.log(error.response.data);
      }
    },
    // Elimina una tarea
    async deleteTask(id) {
      try {
        await api.delete(`/editTask/${id}`);
        this.listapitasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    // Cambia el estado de la tarea cíclicamente
    async changestatus(id) {
      const task = this.apidata.find((task) => task.id === id);
      if (!task) return;
      const currentIndex = this.avilablestatus.indexOf(task.status);
      const newIndex = (currentIndex + 1) % this.avilablestatus.length;
      try {
        await api.patch(`/editTask/${id}`, {
          status: this.avilablestatus[newIndex],
        });
        this.listapitasks();
      } catch (error) {
        console.error('Error updating status:', error);
      }
    },
    // Marca la tarea como completada
    async done(id) {
      try {
        await api.patch(`/editTask/${id}`, {
          status: 'Done',
        });
        this.listapitasks();
      } catch (error) {
        console.error('Error completing task:', error);
      }
    },
  },
  mounted() {
    this.listapitasks();
    this.fetchCategories();
  },
};
</script>

<style>
:root {
  --primary-color: #2564cf;
  --background: #f5f5f5;
  --surface: #ffffff;
  --text-primary: #323130;
  --text-secondary: #605e5c;
  --border-color: #edebe9;
  --danger: #d13438;
  --success: #107c10;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', sans-serif;
}

.app-container {
  display: flex;
  min-height: 100vh;
  background: var(--background);
}

.sidebar {
  width: 280px;
  background: var(--surface);
  padding: 20px;
  border-right: 1px solid var(--border-color);
}

.sidebar-title {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 4px;
  border-radius: 4px;
  color: var(--text-primary);
  transition: background 0.2s;
}

.category-item:hover {
  background: #f3f2f1;
}

.add-btn {
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 4px;
}

.main-content {
  flex: 1;
  padding: 32px 40px;
  max-width: 800px;
}

.app-title {
  color: var(--text-primary);
  margin-bottom: 8px;
}

.date {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.input-container {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

input {
  flex: 1;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 100, 207, 0.2);
}

.add-task-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.add-task-btn:hover {
  background: #215aba;
}

.task-list {
  background: var(--surface);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--text-secondary);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox i {
  color: white;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.checkbox.checked i {
  opacity: 1;
}

.task-text {
  color: var(--text-primary);
  flex: 1;
}

.task-text.completed {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.status-pill {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 500;
}

.status-pill.To-Do {
  background: #eff6fc;
  color: var(--primary-color);
}

.status-pill.In-Progress {
  background: #fff4ce;
  color: #8a6f00;
}

.status-pill.Done {
  background: #dff6dd;
  color: var(--success);
}

.task-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-secondary);
}

.icon-btn:hover {
  background: #f3f2f1;
}

.delete-btn:hover {
  color: var(--danger);
}

.recently-added {
  margin-top: 32px;
  background: var(--surface);
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.recently-added h3 {
  color: var(--text-primary);
  font-size: 14px;
  margin-bottom: 12px;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.suggestion-category {
  color: var(--text-secondary);
  font-size: 12px;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.task-item {
  padding: 12px 16px;
}

.checkbox {
  width: 18px;
  height: 18px;
}

.status-pill {
  font-size: 11px;
  padding: 3px 8px;
  margin-left: 12px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.2rem;
}

.sidebar-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-top: 8px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  margin-top: 8px;
}

.status-buttons {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.status-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.status-btn.active {
  box-shadow: inset 0 0 0 2px var(--primary-color);
}

.status-btn.to-do {
  background: #eff6fc;
  color: var(--primary-color);
}

.status-btn.in-progress {
  background: #fff4ce;
  color: #8a6f00;
}

.status-btn.done {
  background: #dff6dd;
  color: var(--success);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 2rem;
}

.save-btn {
  background: var(--primary-color);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn {
  background: none;
  color: var(--text-secondary);
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  cursor: pointer;
}

.main-content.sidebar-open {
  margin-right: 400px;
  transition: margin 0.3s ease;
}

.edit-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100%;
  background: var(--surface);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  transition: transform 0.3s ease;
}

.main-content.sidebar-open {
  margin-right: 400px;
  transition: margin 0.3s ease;
}

.add-category {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.add-category input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.category-item.active {
  background-color: #e3f2fd;
}

.category-item .add-btn {
  color: var(--danger);
  font-size: 1rem;
  padding: 0 6px;
}

.empty-state {
  padding: 20px;
  text-align: center;
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 8px;
  margin: 20px;
}
</style>
