const line = document.querySelector(".timeline-innerline");
const timelineEvents = document.querySelectorAll(".timeline ul li");
let currentIndex = 0, nextIndex = 1;

function showTime(event) {
  if (event) {
    event.setAttribute("done", "true");

    const timelinePoint = event.querySelector(".timeline-point");
    const dateElement = event.querySelector(".date");
    const paragraph = event.querySelector("p");

    if (timelinePoint) timelinePoint.style.background = "blue";
    if (dateElement) dateElement.style.opacity = "100%";
    if (paragraph) {
      paragraph.style.opacity = "100%";
      paragraph.style.transform = "translateY(0px)";
    }
  }
}

function hideTime(event) {
  if (event) {
    event.removeAttribute("done");

    const timelinePoint = event.querySelector(".timeline-point");
    const dateElement = event.querySelector(".date");
    const paragraph = event.querySelector("p");

    if (timelinePoint) timelinePoint.style.background = "rgb(228, 228, 228)";
    if (dateElement) dateElement.style.opacity = "0%";
    if (paragraph) {
      paragraph.style.opacity = "0%";
      paragraph.style.transform = "translateY(-10px)";
    }
  }
}

function slowLoop() {
  setTimeout(() => {
    if (timelineEvents[currentIndex]) {
      showTime(timelineEvents[currentIndex]);
      timelineProgress(currentIndex + 1);
      currentIndex++;
      if (currentIndex < timelineEvents.length) slowLoop();
    }
  }, 800);
}

function timelineProgress(value) {
  if (line) {
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
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;

        if (window.matchMedia("(min-width: 728px)").matches) {
          slowLoop();
        } else {
          if (target) {
            showTime(target);
            timelineProgress(nextIndex++);
          }
        }
        observer.unobserve(target);
      }
    });
  },
  { threshold: 0.9, rootMargin: "0px 0px -50px 0px" }
);

const timelineList = document.querySelector(".timeline ul");
const timelineItems = document.querySelectorAll(".timeline ul li");
const isWideScreen = window.matchMedia("(min-width: 728px)").matches;

if (timelineList) {
  if (isWideScreen) {
    observer.observe(timelineList);
  } else {
    timelineItems.forEach((item) => observer.observe(item));
  }
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
