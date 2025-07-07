function addTask(promt) {
  let newTask = document.createElement("li");
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

  // Add to top
  taskList.prepend(newTask);

  // Bind checkbox event for new task
  newTask.querySelector(".checkbox").addEventListener("change", function () {
    if (this.checked) {
      newTask.classList.add("disabled");
      taskList.appendChild(newTask); // Move to bottom
    } else {
      newTask.classList.remove("disabled");
    }
  });
}


let promtText = document.querySelector(".prompttext");
let descrip = document.querySelector(".note-descrip");
let taskList = document.querySelector(".tasklist");
let addBtn = document.querySelector(".submitresponse");
let checkBox = document.querySelectorAll(".checkbox");

new Sortable(document.querySelector(".tasklist"), {
  animation: 200,
  handle: ".sequencer",
  ghostClass: "dragging",
  filter: ".disabled",
  onMove: function (evt) {
    return !evt.related.classList.contains("disabled");
  },
});
addBtn.addEventListener("click", function () {
  if (promtText.value.trim() !== "") {
    addTask(promtText);
    promtText.value = "";
    descrip.value = "";
  }
});

document.querySelectorAll(".checkbox").forEach((btn) => {
  btn.addEventListener("change", function () {
    let taskItem = btn.parentElement;
    if (btn.checked) {
      taskItem.classList.add("disabled");
      taskItem.classList.add("disabled");
      taskList.appendChild(taskItem); // Move to bottom
    } else {
      taskItem.classList.remove("disabled");
    }
  });
});
