/* =============================================
   TASK DESK - JAVASCRIPT
   ============================================= */

const SUPABASE_URL = 'https://bpdksprvbbsebdyvftja.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_pjWoYaDTfRTAO1nwVRfHnA_GbLS3_WR';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const sessionUser = document.getElementById('session-user');
const logoutBtn = document.getElementById('logout-btn');
const authTabs = document.querySelectorAll('[data-auth-tab]');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

const tabButtons = document.querySelectorAll('[data-tab]');
const addTaskBtn = document.getElementById('add-task-btn');
const taskTableBody = document.getElementById('task-table-body');
const emptyState = document.getElementById('empty-state');

const taskModal = document.getElementById('task-modal');
const taskModalTitle = document.getElementById('task-modal-title');
const taskForm = document.getElementById('task-form');
const taskIdInput = document.getElementById('task-id');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskDeadlineInput = document.getElementById('task-deadline');
const taskCancelBtn = document.getElementById('task-cancel');
const taskCloseBtn = document.getElementById('task-close');

const confirmModal = document.getElementById('confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const confirmCancelBtn = document.getElementById('confirm-cancel');
const confirmCloseBtn = document.getElementById('confirm-close');

let activeTab = 'all';
let pendingDeleteId = null;
let currentUser = null;
let cachedTasks = [];

const setMessage = (element, message, isError = false) => {
   element.textContent = message;
   element.classList.toggle('error', isError);
   element.classList.toggle('success', !isError && message.length > 0);
};

const setModalOpen = (modal, isOpen) => {
   modal.classList.toggle('open', isOpen);
   modal.setAttribute('aria-hidden', (!isOpen).toString());
};

const resetTaskForm = () => {
   taskIdInput.value = '';
   taskTitleInput.value = '';
   taskDescInput.value = '';
   taskDeadlineInput.value = '';
};

const closeTaskModal = () => {
   setModalOpen(taskModal, false);
   resetTaskForm();
};

const formatStatus = (completed) => (completed ? 'Completed' : 'Open');

const renderTasks = () => {
   let tasks = cachedTasks.slice();

   if (activeTab === 'open') {
      tasks = tasks.filter((task) => !task.completed);
   } else if (activeTab === 'completed') {
      tasks = tasks.filter((task) => task.completed);
   }

   tasks = tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

   taskTableBody.innerHTML = '';

   if (tasks.length === 0) {
      emptyState.hidden = false;
      return;
   }

   emptyState.hidden = true;
   tasks.forEach((task) => {
      const row = document.createElement('tr');

      const titleCell = document.createElement('td');
      titleCell.textContent = task.title;

      const descCell = document.createElement('td');
      descCell.textContent = task.description ? task.description : '-';

      const deadlineCell = document.createElement('td');
      deadlineCell.textContent = task.deadline;

      const statusCell = document.createElement('td');
      const statusBadge = document.createElement('span');
      statusBadge.className = `status ${task.completed ? 'done' : 'open'}`;
      statusBadge.textContent = formatStatus(task.completed);
      statusCell.appendChild(statusBadge);

      const actionsCell = document.createElement('td');
      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'row-actions';

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'btn small ghost';
      toggleBtn.dataset.action = 'toggle';
      toggleBtn.dataset.id = task.id;
      toggleBtn.textContent = task.completed ? 'Mark Open' : 'Complete';

      const editBtn = document.createElement('button');
      editBtn.className = 'btn small';
      editBtn.dataset.action = 'edit';
      editBtn.dataset.id = task.id;
      editBtn.textContent = 'Edit';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn small danger';
      deleteBtn.dataset.action = 'delete';
      deleteBtn.dataset.id = task.id;
      deleteBtn.textContent = 'Delete';

      actionsWrap.append(toggleBtn, editBtn, deleteBtn);
      actionsCell.appendChild(actionsWrap);

      row.append(titleCell, descCell, deadlineCell, statusCell, actionsCell);
      taskTableBody.appendChild(row);
   });
};

const updateView = () => {
   const isLoggedIn = Boolean(currentUser);
   authView.hidden = isLoggedIn;
   appView.hidden = !isLoggedIn;
   logoutBtn.hidden = !isLoggedIn;
   sessionUser.textContent = isLoggedIn ? currentUser.email : 'Guest';
   if (isLoggedIn) {
      fetchTasks();
   } else {
      cachedTasks = [];
      renderTasks();
   }
};

const fetchTasks = async () => {
   if (!currentUser) {
      return;
   }

   const { data, error } = await supabaseClient
      .from('tasks')
      .select('*')
      .eq('user_id', currentUser.id)
      .order('deadline', { ascending: true });

   if (error) {
      cachedTasks = [];
      emptyState.hidden = false;
      return;
   }

   cachedTasks = data || [];
   renderTasks();
};

authTabs.forEach((tab) => {
   tab.addEventListener('click', () => {
      authTabs.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-auth-tab');
      loginForm.hidden = target !== 'login';
      registerForm.hidden = target !== 'register';
      setMessage(loginMessage, '');
      setMessage(registerMessage, '');
   });
});

loginForm.addEventListener('submit', async (event) => {
   event.preventDefault();
   const email = document.getElementById('login-email').value.trim();
   const password = document.getElementById('login-password').value;

   if (!email) {
      setMessage(loginMessage, 'Enter your email.', true);
      return;
   }

   const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
   if (error) {
      setMessage(loginMessage, error.message, true);
      return;
   }

   loginForm.reset();
   setMessage(loginMessage, 'Welcome back!', false);
});

registerForm.addEventListener('submit', async (event) => {
   event.preventDefault();
   const email = document.getElementById('register-email').value.trim();
   const password = document.getElementById('register-password').value;
   const confirm = document.getElementById('register-confirm').value;

   if (!email) {
      setMessage(registerMessage, 'Enter your email.', true);
      return;
   }

   if (password !== confirm) {
      setMessage(registerMessage, 'Passwords do not match.', true);
      return;
   }

   const { error } = await supabaseClient.auth.signUp({ email, password });
   if (error) {
      setMessage(registerMessage, error.message, true);
      return;
   }

   registerForm.reset();
   setMessage(registerMessage, 'Account created. Check your email to confirm.', false);
   authTabs[0].click();
});

logoutBtn.addEventListener('click', async () => {
   await supabaseClient.auth.signOut();
});

tabButtons.forEach((tab) => {
   tab.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tab.classList.add('active');
      activeTab = tab.getAttribute('data-tab');
      renderTasks();
   });
});

addTaskBtn.addEventListener('click', () => {
   resetTaskForm();
   taskModalTitle.textContent = 'Add Task';
   setModalOpen(taskModal, true);
});

taskCancelBtn.addEventListener('click', closeTaskModal);
taskCloseBtn.addEventListener('click', closeTaskModal);

taskForm.addEventListener('submit', async (event) => {
   event.preventDefault();
   if (!currentUser) {
      return;
   }

   const id = taskIdInput.value;
   const title = taskTitleInput.value.trim();
   const description = taskDescInput.value.trim() || null;
   const deadline = taskDeadlineInput.value;

   if (id) {
      const { error } = await supabaseClient
         .from('tasks')
         .update({ title, description, deadline })
         .eq('id', id)
         .eq('user_id', currentUser.id);

      if (error) {
         return;
      }
   } else {
      const { error } = await supabaseClient
         .from('tasks')
         .insert({
            user_id: currentUser.id,
            title,
            description,
            deadline,
            completed: false
         });

      if (error) {
         return;
      }
   }

   closeTaskModal();
   fetchTasks();
});

taskTableBody.addEventListener('click', async (event) => {
   const target = event.target;
   if (!(target instanceof HTMLElement)) {
      return;
   }

   const action = target.getAttribute('data-action');
   const id = target.getAttribute('data-id');
   if (!action || !id || !currentUser) {
      return;
   }

   const task = cachedTasks.find((item) => item.id === id);
   if (!task) {
      return;
   }

   if (action === 'toggle') {
      const { error } = await supabaseClient
         .from('tasks')
         .update({ completed: !task.completed })
         .eq('id', id)
         .eq('user_id', currentUser.id);

      if (!error) {
         fetchTasks();
      }
      return;
   }

   if (action === 'edit') {
      taskIdInput.value = task.id;
      taskTitleInput.value = task.title;
      taskDescInput.value = task.description || '';
      taskDeadlineInput.value = task.deadline;
      taskModalTitle.textContent = 'Edit Task';
      setModalOpen(taskModal, true);
      return;
   }

   if (action === 'delete') {
      pendingDeleteId = task.id;
      setModalOpen(confirmModal, true);
   }
});

const closeConfirm = () => {
   pendingDeleteId = null;
   setModalOpen(confirmModal, false);
};

confirmCancelBtn.addEventListener('click', closeConfirm);
confirmCloseBtn.addEventListener('click', closeConfirm);

confirmDeleteBtn.addEventListener('click', async () => {
   if (!currentUser || !pendingDeleteId) {
      closeConfirm();
      return;
   }

   const { error } = await supabaseClient
      .from('tasks')
      .delete()
      .eq('id', pendingDeleteId)
      .eq('user_id', currentUser.id);

   closeConfirm();
   if (!error) {
      fetchTasks();
   }
});

supabaseClient.auth.onAuthStateChange((_event, session) => {
   currentUser = session?.user ?? null;
   updateView();
});

const init = async () => {
   const { data } = await supabaseClient.auth.getSession();
   currentUser = data?.session?.user ?? null;
   updateView();
};

init();
