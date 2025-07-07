function addTask(promt) {
  let newTask = document.createElement("li");
  console.log(newTask);
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
  taskList.appendChild(newTask);
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

checkBox.forEach((btn) => {
  btn.addEventListener("change", function () {
    if (btn.checked) {
      btn.parentElement.classList.add("disabled");
    } else {
      btn.parentElement.classList.remove("disabled");
    }
  });
});
