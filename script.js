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
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slideshow-container .slide-img");
    let currentSlide = 0;

    if (slides.length > 1) {
      setInterval(() => {
        // Alisin ang active class sa kasalukuyang image
        slides[currentSlide].classList.remove("active");
        
        // Lumipat sa susunod na image (babalik sa 0 kapag nakarating sa dulo)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Idagdag ang active class sa bagong image
        slides[currentSlide].classList.add("active");
      }, 3000); // 3000ms = 3 seconds
    }
  });
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.carousel-container');

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const dots = carousel.querySelectorAll('.dot');
    const totalSlides = dots.length;
    let currentIndex = 0;

    // Variables para sa touch swipe at mouse drag
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    function goToSlide(index) {
      if (index < 0) index = 0;
      if (index >= totalSlides) index = totalSlides - 1;
      
      currentIndex = index;
      track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    // Click sa mga bilog (dots)
    dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(index);
      });
    });

    // Touch Events (Mobile & Tablet Swipe)
    carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isDragging = true;
      track.style.transition = 'none';
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      const containerWidth = carousel.offsetWidth;
      const movePercent = (diff / containerWidth) * 100;
      track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${movePercent}%))`;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      const diff = currentX - startX;
      const threshold = 40; // Minimum swipe distance (px)

      if (diff < -threshold && currentIndex < totalSlides - 1) {
        goToSlide(currentIndex + 1); // Swipe left -> Next
      } else if (diff > threshold && currentIndex > 0) {
        goToSlide(currentIndex - 1); // Swipe right -> Previous
      } else {
        goToSlide(currentIndex); // Balik sa current slide pag bitin ang swipe
      }
    });
  });
});