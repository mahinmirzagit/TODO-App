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
    const items = document.querySelectorAll("#tasklist li");
    taskData[currentTab] = Array.from(items).map((li) => li.outerHTML);
  },
});

function addTask() {
  const title = document.getElementById("prompttext").value.trim();
  const desc = document.getElementById("txtarea").value.trim();

  if (!title) return alert("Please enter a task title.");

  const li = document.createElement("li");
  li.innerHTML = `
      <input type="checkbox" class="checkbox" />
      <span class="tasktitle">${title}</span>
      <button class="sequencer btn">
        <i class="fa fa-bars" style="color: #fff; font-size: small"></i>
      </button>
      <button class="deletetaskbtn btn">
        <i class="fa fa-trash" style="color: rgb(194, 0, 0); font-size: medium"></i>
      </button>
    `;

  document.getElementById("tasklist").appendChild(li);
  taskData[currentTab].push(li.outerHTML);
  document.getElementById("prompttext").value = "";
  document.getElementById("txtarea").value = "";

  updateProgress();
}

document.querySelector(".submitresponse").addEventListener("click", addTask);

document.querySelector("#tasklist").addEventListener("click", (e) => {
  const target = e.target;
  const li = target.closest("li");

  if (target.closest(".deletetaskbtn")) {
    li.remove();
    saveTasks();
    updateProgress();
  }

  if (target.classList.contains("checkbox")) {
    li.classList.toggle("disabled", target.checked);
    updateProgress();
  }
});

function updateProgress() {
  const tasks = document.querySelectorAll(".tasklist li");
  const completed = document.querySelectorAll(".tasklist .checkbox:checked");
  const progress = document.querySelector(".progress");
  const percent = tasks.length ? (completed.length / tasks.length) * 100 : 0;
  const dashOffset = 56.52 - (percent / 100) * 56.52;
  progress.style.strokeDashoffset = dashOffset.toFixed(2);
}

function saveTasks() {
  const items = document.querySelectorAll("#tasklist li");
  taskData[currentTab] = Array.from(items).map((li) => li.outerHTML);
}

const tabButtons = document.querySelectorAll(".tabbtns");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    currentTab = btn.innerText;
    loadTasks();
  });
});

function loadTasks() {
  const list = document.getElementById("tasklist");
  list.innerHTML = taskData[currentTab].join("");
  updateProgress();
}

loadTasks();
