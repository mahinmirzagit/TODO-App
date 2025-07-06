new Sortable(document.querySelector(".tasklist"), {
  animation: 200,
  handle: ".sequencer",
  ghostClass: "dragging",
  filter: ".disabled",
  onMove: function (evt) {
    return !evt.related.classList.contains("disabled");
  },
  // onEnd: function () {
  //   const items = document.querySelectorAll("#tasklist li");
  //   taskData[currentTab] = Array.from(items).map((li) => li.outerHTML);
  // },
});
