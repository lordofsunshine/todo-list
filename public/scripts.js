document.addEventListener('DOMContentLoaded', () => {
  initializeMarkdownContent();
  initializeCustomSelects();
  updateTaskListVisibility();
});

function initializeMarkdownContent() {
  document.querySelectorAll('.task-content').forEach(element => {
    const markdown = decodeURIComponent(element.getAttribute('data-markdown'));
    element.innerHTML = marked.parse(markdown);
  });
}

function initializeCustomSelects() {
  const customSelects = document.querySelectorAll('.custom-select');

  customSelects.forEach(select => {
    const selected = select.querySelector('.select-selected');
    const items = select.querySelector('.select-items');

    selected.addEventListener('click', event => {
      event.stopPropagation();
      items.classList.toggle('select-hide');
      selected.classList.toggle('select-arrow-active');
    });

    items.querySelectorAll('div').forEach(option => {
      option.addEventListener('click', () => {
        selected.innerHTML = option.innerHTML;
        const hiddenInput = select.closest('form').querySelector('input[type="hidden"][name="priority"]');
        hiddenInput.value = option.getAttribute('data-value');
        items.classList.add('select-hide');
        selected.classList.remove('select-arrow-active');
      });
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.matches('.select-selected')) {
      customSelects.forEach(select => {
        select.querySelector('.select-items').classList.add('select-hide');
        select.querySelector('.select-selected').classList.remove('select-arrow-active');
      });
    }
  });
}

function openAddTaskModal() {
  document.getElementById('addTaskModal').style.display = 'block';
}

function toggleDropdown() {
  const dropdown = document.querySelector('#dropdown .dropdown-content');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function openDetailModal(taskId, taskTitle, taskContent, taskPriority) {
  document.getElementById('modal-task-title').innerHTML = marked.parse(decodeURIComponent(taskTitle));
  document.getElementById('modal-task-content').innerHTML = marked.parse(decodeURIComponent(taskContent));
  document.getElementById('modal-task-priority').textContent = `Priority: ${taskPriority}`;
  document.getElementById('taskModal').style.display = 'block';
}

function openEditModal(taskId, taskTitle, taskContent, taskPriority) {
  const modalTitle = document.getElementById('edit-task-title');
  const modalContent = document.getElementById('edit-task-content');
  const selectSelected = document.querySelector('#editModal .select-selected');
  const editForm = document.getElementById('editTaskForm');

  if (modalTitle && modalContent && selectSelected && editForm) {
    modalTitle.value = decodeURIComponent(taskTitle);
    modalContent.value = decodeURIComponent(taskContent);
    selectSelected.textContent = taskPriority;

    const hiddenInput = editForm.querySelector('input[type="hidden"][name="priority"]');
    hiddenInput.value = taskPriority;

    editForm.action = `/edit/${taskId}`;
    document.getElementById('editModal').style.display = 'block';
  } else {
    console.error('One or more elements not found for the Edit Task Modal');
  }
}

function submitAddTaskForm() {
  const addForm = document.getElementById('addTaskForm');
  addForm.querySelector('.loader').style.display = 'block';
  setTimeout(() => {
    addForm.submit();
    updateTaskListVisibility();
  }, 500);
}

function submitEditTaskForm(event) {
  event.preventDefault();
  const editForm = event.target;
  editForm.querySelector('.loader').style.display = 'block';
  setTimeout(() => {
    editForm.submit();
    updateTaskListVisibility();
  }, 500);
}

function closeModal() {
  document.getElementById('addTaskModal').style.display = 'none';
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('editModal').style.display = 'none';
}

function toggleTaskDropdown(event) {
  event.stopPropagation();
  const dropdownContent = event.target.closest('.dropdown').querySelector('.dropdown-content');
  dropdownContent.classList.toggle('show');
}

function showDeleteLoader(event, taskId) {
  event.preventDefault();
  const taskElement = event.target.closest('li');
  if (taskElement) {
    const loader = document.createElement('div');
    loader.className = 'loader';
    taskElement.appendChild(loader);
  }
  setTimeout(() => {
    window.location.href = `/delete/${taskId}`;
  }, 100);
}

function deleteTask(taskId) {
  fetch(`/delete/${taskId}`, { method: 'DELETE' })
    .then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Failed to delete task');
      }
    });
}

function updateTaskListVisibility() {
  const taskList = document.getElementById('task-list');
  const nothingText = document.querySelector('.nothing');

  // Проверяем, что элементы существуют
  if (taskList && nothingText) {
    nothingText.style.display = taskList.children.length === 0 ? 'block' : 'none';
  } else {
    console.error('Не удалось найти элементы для обновления видимости задачи.');
  }  
}
