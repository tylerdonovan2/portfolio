
const pageNavButtons = document.querySelectorAll(".page-navigator-button");
const pageViews = document.querySelectorAll(".page-view .page");
const pageTitle = document.querySelector(".page-title");

pageNavButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.id + "-page";
      const buttonText = button.textContent.trim();

      pageNavButtons.forEach((b) => {
          if(b.id === button.id) {
              b.classList.add("selected");
          } else{
              b.classList.remove("selected");
          }
      })

      pageViews.forEach((page) => {
        if (page.id === targetId) {
          page.classList.remove("hidden");
        } else {
          page.classList.add("hidden");
        }
      });

      pageTitle.textContent = buttonText;
    });
});

window.addEventListener('DOMContentLoaded', () => {
  const mainContainer = document.querySelector('.main-container');
  mainContainer.classList.add('loaded');
});
