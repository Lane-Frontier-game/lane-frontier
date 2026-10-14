
// 「矢印を押せばスライドして次の画像」  [oai_citation:7‡ディティール.pptx](sediment://file_0000000077507206badc83a0bb6e396b)
const slidesEl = document.getElementById("slides");
const slides = slidesEl ? slidesEl.querySelectorAll(".slide") : [];

let current = 0;
const intervalMs = 4500;

function show(index) {
  slides.forEach(s => s.classList.remove("is-active"));
  slides[index].classList.add("is-active");
  current = index;
}

function next() {
  if (slides.length === 0) return;
  show((current + 1) % slides.length);
}

function prev() {
  if (slides.length === 0) return;
  show((current - 1 + slides.length) % slides.length);
}

const prevBtn = document.querySelector(".slider-btn.prev");
const nextBtn = document.querySelector(".slider-btn.next");

if (slides.length > 0) {
  show(0);

  let timer = setInterval(next, intervalMs);

  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); resetTimer(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); resetTimer(); });

  const slider = document.querySelector(".slider");
  if (slider) {
    slider.addEventListener("mouseenter", stopTimer);
    slider.addEventListener("mouseleave", startTimer);
    slider.addEventListener("touchstart", stopTimer, { passive: true });
    slider.addEventListener("touchend", startTimer, { passive: true });
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function startTimer() {
    if (!timer) timer = setInterval(next, intervalMs);
  }
  function resetTimer() {
    stopTimer();
    startTimer();
  }
}

document.querySelectorAll(".has-dropdown > .nav-button").forEach(button => {
  const parent = button.parentElement;
  const dropdown = parent.querySelector(".dropdown");

  button.addEventListener("click", () => {
    const isOpen = parent.classList.contains("is-open");

    document.querySelectorAll(".has-dropdown").forEach(el => {
      el.classList.remove("is-open");
    });

    if (!isOpen) {
      parent.classList.add("is-open");
    }
  });
});

document.addEventListener("click", e => {
  if (!e.target.closest(".has-dropdown")) {
    document.querySelectorAll(".has-dropdown").forEach(el => {
      el.classList.remove("is-open");
    });
  }
});

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".menu-overlay");
const closeMenu = document.querySelector(".close-menu");

menuToggle.addEventListener("click", () => {

  mobileMenu.classList.add("open");
  overlay.classList.add("open");

});

closeMenu.addEventListener("click", () => {

  mobileMenu.classList.remove("open");
  overlay.classList.remove("open");

});

overlay.addEventListener("click", () => {

  mobileMenu.classList.remove("open");
  overlay.classList.remove("open");

});

const mobileAbout = document.querySelector(".mobile-about");
const mobileSubmenu = document.querySelector(".mobile-submenu");

if (mobileAbout && mobileSubmenu) {
  mobileAbout.addEventListener("click", () => {
    mobileAbout.classList.toggle("is-open");
    mobileSubmenu.classList.toggle("is-open");
  });
}
