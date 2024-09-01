const line = document.querySelector(".timeline-innerline");
const timelineEvents = document.querySelectorAll("ul li");
let currentIndex = 0, nextIndex = 1;

function showTime(event) {
  event.setAttribute("done", "true");
  event.querySelector(".timeline-point").style.background = "blue";
  event.querySelector(".date").style.opacity = "100%";
  event.querySelector("p").style.opacity = "100%";
  event.querySelector("p").style.transform = "translateY(0px)";
}

function hideTime(event) {
  event.removeAttribute("done");
  event.querySelector(".timeline-point").style.background = "rgb(228, 228, 228)";
  event.querySelector(".date").style.opacity = "0%";
  event.querySelector("p").style.opacity = "0%";
  event.querySelector("p").style.transform = "translateY(-10px)";
}

function slowLoop() {
  setTimeout(() => {
    showTime(timelineEvents[currentIndex]);
    timelineProgress(currentIndex + 1);
    currentIndex++;
    if (currentIndex < timelineEvents.length) slowLoop();
  }, 800);
}

function timelineProgress(value) {
  const progress = `${(value / timelineEvents.length) * 100}%`;
  const isWideScreen = window.matchMedia("(min-width: 728px)").matches;
  if (isWideScreen) {
    line.style.width = progress;
    line.style.height = "4px";
  } else {
    line.style.height = progress;
    line.style.width = "4px";
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.9) {
        if (window.matchMedia("(min-width: 728px)").matches) {
          slowLoop();
        } else {
          showTime(entry.target);
          timelineProgress(nextIndex++);
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 1, rootMargin: "0px 0px -50px 0px" }
);

const timelineList = document.querySelector(".timeline ul");
const timelineItems = document.querySelectorAll(".timeline ul li");
const isWideScreen = window.matchMedia("(min-width: 728px)").matches;

if (isWideScreen) {
  observer.observe(timelineList);
} else {
  timelineItems.forEach((item) => observer.observe(item));
}

timelineEvents.forEach((item, index) => {
  item.addEventListener("click", () => {
    if (item.getAttribute("done")) {
      timelineProgress(index);
      timelineEvents.forEach((ev, idx) => {
        if (idx >= index) hideTime(ev);
      });
    } else {
      timelineProgress(index + 1);
      timelineEvents.forEach((ev, idx) => {
        if (idx <= index) showTime(ev);
      });
    }
  });
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    currentIndex = 0;
    slowLoop();
  }, 1200);
});
