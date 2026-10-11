        const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".page-progress span");
const ring = document.querySelector(".cursor-ring");
const dot = document.querySelector(".cursor-dot");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

function updateScrollUI(){
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (scrollTop / max) * 100 : 0}%`;
  header?.classList.toggle("scrolled", scrollTop > 30);
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

if (window.matchMedia("(hover:hover) and (pointer:fine)").matches && ring && dot){
  window.addEventListener("pointermove", e => {
    dot.style.left = `${e.clientX - 3.5}px`;
    dot.style.top = `${e.clientY - 3.5}px`;
    ring.style.left = `${e.clientX - 17}px`;
    ring.style.top = `${e.clientY - 17}px`;
  });
  document.querySelectorAll("a,button,.farm-card,.product-card,.story-card,.impact-card").forEach(el=>{
    el.addEventListener("mouseenter",()=>ring.classList.add("hover"));
    el.addEventListener("mouseleave",()=>ring.classList.remove("hover"));
  });
}

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

document.querySelectorAll(".farm-grid,.product-grid,.story-grid,.impact-grid").forEach(group=>{
  [...group.querySelectorAll(".reveal")].forEach((el,i)=>el.style.transitionDelay=`${Math.min(i*70,350)}ms`);
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a:not(.nav-cta)")];
const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(link=>link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  });
},{rootMargin:"-35% 0px -55% 0px", threshold:0});
sections.forEach(section=>sectionObserver.observe(section));

document.getElementById("inquiryForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const status = document.querySelector(".form-status");
  status.textContent = "Thank you. Your inquiry is ready to be connected to the approved La Farmia email or inquiry system.";
  event.target.reset();
});
// I-initialize ang Lenis para sa buttery-smooth wheel effect
const lenis = new Lenis({
  duration: 1.2,     // Kung gaano katagal ang glide effect (taasan mo kung gusto mo mas "mahangin")
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing formula para sa smooth acceleration
  direction: 'vertical', // Vertical scroll
  smooth: true,
  wheelMultiplier: 1, // Bilis ng pag-ikot ng mouse wheel
});

// Animation frame loop (Kailangan ito para maging tuloy-tuloy ang galaw ng scroll)
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
// Mobile Sticky Fix gamit ang JS
window.addEventListener('scroll', function() {
  if (window.innerWidth <= 768) {
    const container = document.querySelector('.sticky-container');
    const imageBox = document.querySelector('.sticky-image-box');
    
    if (!container || !imageBox) return;

    const containerRect = container.getBoundingClientRect();
    const imageHeight = imageBox.offsetHeight;
    const navbarHeight = 80; // Taas ng iyong navbar + space
    
    // Sukat kung kailan dapat huminto sa ilalim (taas ng container minus taas ng image minus padding)
    const stopPoint = containerRect.height - imageHeight - 40;

    // 1. Kung naabot na ang dulo ng container sa ibaba, ilagay sa absolute bottom para walang glitch
    if (-containerRect.top >= stopPoint) {
      imageBox.classList.remove('fixed-mobile');
      imageBox.classList.add('absolute-bottom');
    } 
    // 2. Kung nasa loob pa ng section, i-fix sa itaas (may space mula sa navbar)
    else if (containerRect.top <= navbarHeight && containerRect.bottom >= (imageHeight + navbarHeight)) {
      imageBox.classList.remove('absolute-bottom');
      imageBox.classList.add('fixed-mobile');
    } 
    // 3. Kung nasa taas pa bago umabot sa section
    else {
      imageBox.classList.remove('fixed-mobile');
      imageBox.classList.remove('absolute-bottom');
    }
  }
});
