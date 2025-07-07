let promtText = document.querySelector(".prompttext");
let descrip = document.querySelector(".note-descrip");
let addBtn = document.querySelector(".submitresponse");

const tabButtons = document.querySelectorAll(".tabbtns");
const tabContents = document.querySelectorAll("[data-tab-content]");
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

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.tab) {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeTab = btn.dataset.tab;
      tabContents.forEach((list) => {
        list.classList.toggle("hidden", list.id !== activeTab);
      });
      updateProgress();
    }
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

    noteItem.innerHTML = `
      <h3 class="infotitle">${title}</h3>
      <span class="infodesc">${note || "(no content)"}</span>
      <div class="infostatus">Saved on ${weekday}, ${dateString} at ${timeString}</div>
      <button class="btn infoeditbtn">Edit</button>
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
    taskToDelete = taskItem;
    modal.classList.add("show");
  });
}

confirmBtn.addEventListener("click", () => {
  if (taskToDelete) {
    taskToDelete.remove();
    taskToDelete = null;
    modal.classList.remove("show");
    updateProgress();
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

updateProgress();
