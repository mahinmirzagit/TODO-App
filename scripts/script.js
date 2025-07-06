new Sortable(document.querySelector(".tasklist"), {
  animation: 200,
  handle: ".sequencer",
  ghostClass: "dragging",
  filter: ".disabled",
  onMove: function (evt) {
    return !evt.related.classList.contains("disabled");
  },
});
