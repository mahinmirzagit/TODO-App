const infoTab1 = document.getElementById("infoTab");
const editForm = document.getElementById("edit-form");
const viewFields = document.getElementById("viewFields");
const modalHeading = document.getElementById("modal-title");
const modalBodyText = document.getElementById("modal-body-text");
const editTitleInput = document.getElementById("editTitle");
const editDescInput = document.getElementById("editDesc");
const editStatusInput = document.getElementById("editStatus");

let editingTask = null;
let promtText = document.querySelector(".prompttext");
let descrip = document.querySelector(".note-descrip");
let addBtn = document.querySelector(".submitresponse");

const taskTabButtons = document.querySelectorAll(".navlinks .tabbtns");
const taskTabContents = document.querySelectorAll("[data-tab-content]");

const sideTabButtons = document.querySelectorAll(".sidetabnavs .sidetabbtns");
const infoTab = document.getElementById("infoTab");
const notesTab1 = document.getElementById("notesTab");

let activeTab = "daily";

const progressCircle = document.querySelector(".progress");
const progressText = document.querySelector(".progresspercent");

const modal = document.getElementById("modalbox");
const modalTitle = document.getElementById("modal-task-title");
const modalDesc = document.getElementById("modal-task-desc");
const confirmBtn = document.getElementById("confirmDelete");
const cancelBtn = document.getElementById("cancelDelete");

let taskToDelete = null;
let isNoteMode = false;
let completedTaskTitle = "";
const notesTab = document.getElementById("notesTab");

taskTabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    taskTabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    taskTabContents.forEach((list) => {
      list.classList.toggle("hidden", list.id !== activeTab);
    });
    updateProgress();
  });
});
sideTabButtons.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    sideTabButtons.forEach((b) => b.classList.remove("active2"));
    btn.classList.add("active2");

    const tabs = [infoTab, notesTab];
    tabs.forEach((tab, i) => {
      tab.classList.toggle("hidden", i !== index);
    });
  });
});

addBtn.addEventListener("click", function () {
  const title = promtText.value.trim();
  const note = descrip.value.trim();

  if (title === "") return;

  if (isNoteMode) {
    const noteItem = document.createElement("li");
    noteItem.classList.add("infocard");

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateString = now.toLocaleDateString();
    const weekday = now.toLocaleDateString(undefined, { weekday: "long" });

    const matchingTask = Array.from(
      document.querySelectorAll(".tasklist li")
    ).find(
      (task) =>
        task.querySelector(".tasktitle")?.textContent === completedTaskTitle
    );

    const taskDescription =
      matchingTask?.getAttribute("data-desc") || "(no description)";

    noteItem.innerHTML = `
    <h3 class="infotitle">${completedTaskTitle}</h3>
    <span class="infodesc"><strong>Task Description:</strong> ${taskDescription}</span>
    <span class="infodesc"><strong>Note:</strong> ${
      note || "(no note provided)"
    }</span>
    <div class="infostatus">Saved on ${weekday}, ${dateString} at ${timeString}</div>
  `;

    notesTab.appendChild(noteItem);

    promtText.value = "";
    descrip.value = "";
    descrip.placeholder = "Description";
    addBtn.textContent = "Add New Task";
    isNoteMode = false;
    completedTaskTitle = "";
  } else {
    addTask(promtText);
    promtText.value = "";
    descrip.value = "";
  }
});

function addTask(promt) {
  const taskList = document.getElementById(activeTab);
  let newTask = document.createElement("li");
  newTask.setAttribute("data-desc", descrip.value.trim());
  newTask.innerHTML = `
    <input type="checkbox" class="checkbox" />
    <span class="tasktitle">${promt.value || "No Title"}</span>
    <button class="sequencer btn">
      <i class="fa fa-bars" style="color: #fff"></i>
    </button>
    <button class="deletetaskbtn btn">
      <i class="fa fa-trash" style="color: rgb(194, 0, 0)"></i>
    </button>
  `;

  taskList.prepend(newTask);

  new Sortable(taskList, {
    animation: 200,
    handle: ".sequencer",
    ghostClass: "dragging",
    filter: ".disabled",
    onMove: function (evt) {
      return !evt.related.classList.contains("disabled");
    },
  });

  const checkbox = newTask.querySelector(".checkbox");
  checkbox.addEventListener("change", function () {
    if (this.checked) {
      newTask.classList.add("disabled");
      taskList.appendChild(newTask);
      updateProgress();

      promtText.value = newTask.querySelector(".tasktitle").textContent;
      descrip.placeholder = "Write note here...";
      addBtn.textContent = "Add Note";
      isNoteMode = true;
      completedTaskTitle = promtText.value;
    } else {
      newTask.classList.remove("disabled");
      refreshInfoTab();

      updateProgress();
    }
  });

  const deleteBtn = newTask.querySelector(".deletetaskbtn");
  attachDeleteEvent(deleteBtn, newTask);

  updateProgress();
}

function updateProgress() {
  const list = document.getElementById(activeTab);
  const tasks = list.querySelectorAll("li");
  const completed = list.querySelectorAll("li .checkbox:checked");

  const total = tasks.length;
  const done = completed.length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  progressText.textContent = `${percent}%`;

  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;

  if (percent < 40) {
    progressCircle.style.stroke = "#ff4d4d";
  } else if (percent < 80) {
    progressCircle.style.stroke = "#ffb84d";
  } else {
    progressCircle.style.stroke = "#4dff4d";
  }
}

function attachDeleteEvent(btn, taskItem) {
  btn.addEventListener("click", () => {
    const title = taskItem.querySelector(".tasktitle").textContent.trim();
    const desc = taskItem.getAttribute("data-desc") || "(no description)";
    modalTitle.textContent = `Title: ${title}`;
    modalDesc.textContent = `Description: ${desc}`;

    modalHeading.textContent = "Delete?";
    modalBodyText.style.display = "block";
    viewFields.style.display = "flex";
    editForm.style.display = "none";
    confirmBtn.style.display = "inline-block";

    taskToDelete = taskItem;
    editingTask = null;
    modal.classList.add("show");
  });
}
function attachEditEvent(btn, taskItem) {
  btn.addEventListener("click", () => {
    const title = taskItem.querySelector(".tasktitle").textContent.trim();
    const desc = taskItem.getAttribute("data-desc") || "";

    modalHeading.textContent = "Edit Task";
    modalBodyText.style.display = "none";
    viewFields.style.display = "none";
    editForm.style.display = "flex";
    confirmBtn.textContent = "Save";
    confirmBtn.style.display = "inline-block";

    editTitleInput.value = title;
    editDescInput.value = desc;
    editStatusInput.value = taskItem.classList.contains("disabled")
      ? "complete"
      : "incomplete";

    editingTask = taskItem;
    modal.classList.add("show");
  });
}

confirmBtn.addEventListener("click", () => {
  if (taskToDelete) {
    taskToDelete.remove();
    taskToDelete = null;
    modal.classList.remove("show");
    updateProgress();
    refreshInfoTab();
  } else if (editingTask) {
    const newTitle = editTitleInput.value.trim();
    const newDesc = editDescInput.value.trim();
    const newStatus = editStatusInput.value;

    if (newTitle !== "") {
      editingTask.querySelector(".tasktitle").textContent = newTitle;
      editingTask.setAttribute("data-desc", newDesc);

      if (newStatus === "complete") {
        editingTask.classList.add("disabled");
        editingTask.querySelector(".checkbox").checked = true;
      } else {
        editingTask.classList.remove("disabled");
        editingTask.querySelector(".checkbox").checked = false;
      }

      modal.classList.remove("show");
      updateProgress();
      refreshInfoTab();
    }
  }
});

cancelBtn.addEventListener("click", () => {
  taskToDelete = null;
  modal.classList.remove("show");
});

document.querySelectorAll(".tasklist li").forEach((task) => {
  const deleteBtn = task.querySelector(".deletetaskbtn");
  if (deleteBtn) attachDeleteEvent(deleteBtn, task);
});

function refreshInfoTab() {
  infoTab.innerHTML = "";
  const taskList = document.getElementById(activeTab);
  const tasks = taskList.querySelectorAll("li");

  tasks.forEach((task) => {
    const title = task.querySelector(".tasktitle")?.textContent || "Untitled";
    const desc = task.getAttribute("data-desc") || "(no description)";
    const status = task.querySelector(".checkbox")?.checked
      ? "Completed"
      : "Incompleted";

    const infoItem = document.createElement("li");
    infoItem.classList.add("infocard");
    infoItem.innerHTML = `
      <h3 class="infotitle">${title}</h3>
      <span class="infodesc"><strong>Description:</strong> ${desc}</span>
      <div class="infostatus">
        Status:
        <i class="fa ${
          status === "Completed" ? "fa-check-circle" : "fa-cancel"
        }" style="color: ${
      status === "Completed" ? "greenyellow" : "red"
    }"></i> ${status}
      </div>
      <button class="btn infoeditbtn">Edit</button>
    `;
    const editBtn = infoItem.querySelector(".infoeditbtn");
    attachEditEvent(editBtn, task);
    infoTab.appendChild(infoItem);
  });
}

updateProgress();
