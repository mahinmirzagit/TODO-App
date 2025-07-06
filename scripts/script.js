const taskData = {
  Daily: [],
  Weekly: [],
  Monthly: [],
};

let currentTab = "Daily";

new Sortable(document.querySelector(".tasklist"), {
  animation: 200,
  handle: ".sequencer",
  ghostClass: "dragging",
  filter: ".disabled",
  onMove: function (evt) {
    return !evt.related.classList.contains("disabled");
  },
  onEnd: function () {
    saveTasks();
  },
});

function sentenceCase(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addTask() {
  const titleInput = document.getElementById("prompttext");
  const descInput = document.getElementById("txtarea");

  const title = sentenceCase(titleInput.value.trim());
  const desc = sentenceCase(descInput.value.trim());

  if (!title) return alert("Please enter a task title.");

  const newTask = {
    title,
    description: desc,
    completed: false,
  };

  const firstCompletedIndex = taskData[currentTab].findIndex(
    (task) => task.completed
  );

  if (firstCompletedIndex === -1) {
    taskData[currentTab].push(newTask);
  } else {
    taskData[currentTab].splice(firstCompletedIndex, 0, newTask);
  }

  titleInput.value = "";
  descInput.value = "";

  saveTasks();
  loadTasks();
  updateProgress();
}

document.querySelector(".submitresponse").addEventListener("click", addTask);

document.querySelector("#tasklist").addEventListener("click", (e) => {
  const target = e.target;
  const li = target.closest("li");
  const index = li.dataset.index;

  if (target.closest(".deletetaskbtn")) {
    taskData[currentTab].splice(index, 1);
    saveTasks();
    loadTasks();
    updateProgress();
  }

  if (target.classList.contains("checkbox")) {
    taskData[currentTab][index].completed = target.checked;

    taskData[currentTab].sort((a, b) => a.completed - b.completed);

    saveTasks();
    loadTasks();
    updateProgress();
  }
});

function saveTasks() {}

function loadTasks() {
  const list = document.getElementById("tasklist");
  list.innerHTML = "";

  taskData[currentTab].forEach((task, idx) => {
    const li = document.createElement("li");
    li.dataset.index = idx;
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${
        task.completed ? "checked" : ""
      } />
      <span class="tasktitle">${task.title}</span>
      <button class="sequencer btn">
        <i class="fa fa-bars" style="color: #fff; font-size: small"></i>
      </button>
      <button class="deletetaskbtn btn">
        <i class="fa fa-trash" style="color: rgb(194, 0, 0); font-size: medium"></i>
      </button>
    `;
    if (task.completed) li.classList.add("disabled");
    list.appendChild(li);
  });
}

const tabButtons = document.querySelectorAll(".tabbtns");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentTab = btn.innerText;
    loadTasks();
    updateProgress();
  });
});

function updateProgress() {
  const total = taskData[currentTab].length;
  const completed = taskData[currentTab].filter(
    (task) => task.completed
  ).length;

  const percent = total ? (completed / total) * 100 : 0;
  const dashOffset = 56.52 - (percent / 100) * 56.52;
  document.querySelector(".progress").style.strokeDashoffset =
    dashOffset.toFixed(2);
}
loadTasks();
