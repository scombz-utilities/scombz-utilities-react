const showClassroom = () => {
  const tooltipDivs = document.querySelectorAll('div[data-toggle="tooltip"]');

  tooltipDivs.forEach((div) => {
    const classroom = div.querySelector("div");
    const title = div.getAttribute("title");
    classroom.innerText = title;
  });
};

export const customizeTimetable = () => {
  showClassroom();
};
