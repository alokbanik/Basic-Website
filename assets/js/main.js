// ---------- Preloader ----------
const preloader = document.getElementById('preloader');
const preloaderCount = document.getElementById('preloaderCount');
let count = 0;
const countInterval = setInterval(() => {
  count += Math.ceil(Math.random() * 12);
  if (count >= 100) {
    count = 100;
    clearInterval(countInterval);
    preloaderCount.textContent = count;
    setTimeout(() => {
      preloader.style.transition = 'transform .8s cubic-bezier(.77,0,.18,1)';
      preloader.style.transform = 'translateY(-100%)';
      setTimeout(() => preloader.remove(), 900);
      document.body.classList.add('loaded');
      initReveals();
    }, 300);
  } else {
    preloaderCount.textContent = count;
  }
}, 90);

// ---------- Custom cursor ----------
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.18;
  ringY += (mouseY - ringY) * 0.18;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('[data-hover]').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ---------- Mobile menu ----------
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---------- Featured cards: cursor-driven parallax tilt ----------
document.querySelectorAll('[data-parallax]').forEach(card => {
  const inner = card.querySelector('.featured-card-inner');
  const img = card.querySelector('img');

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    inner.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
    img.style.transform = `translate(${-x * 16}px, ${-y * 16}px) scale(1.08)`;
  });

  card.addEventListener('mouseleave', () => {
    inner.style.transform = 'rotateY(0) rotateX(0) scale(1)';
    img.style.transform = 'translate(0, 0) scale(1)';
  });
});

// ---------- Work list hover preview image ----------
const workPreview = document.getElementById('workPreview');
const workList = document.getElementById('workList');

if (workPreview && workList) {
  const workPreviewImg = workPreview.querySelector('img');
  let previewX = 0, previewY = 0, targetX = 0, targetY = 0;

  document.querySelectorAll('.work-row').forEach(row => {
    row.addEventListener('mouseenter', () => {
      workPreviewImg.src = row.dataset.img;
      workPreview.classList.add('active');
    });
    row.addEventListener('mouseleave', () => {
      workPreview.classList.remove('active');
    });
  });

  workList.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function animatePreview() {
    previewX += (targetX - previewX) * 0.15;
    previewY += (targetY - previewY) * 0.15;
    workPreview.style.transform = `translate(${previewX}px, ${previewY}px) translate(-50%, -50%) scale(${workPreview.classList.contains('active') ? 1 : 0.9})`;
    requestAnimationFrame(animatePreview);
  }
  animatePreview();
}

// ---------- GSAP reveals ----------
function initReveals() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.set('.hero-name .hero-word', { y: 60, opacity: 0 });
  gsap.to('.hero-name .hero-word', {
    y: 0, opacity: 1, duration: 1.1, stagger: 0.15, ease: 'back.out(1.6)', delay: 0.1
  });

  gsap.utils.toArray('.hero .reveal-up').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 + i * 0.12
    });
  });

  gsap.fromTo('.hero-scribble', { drawProgress: 0 }, {
    opacity: 1, duration: 0.1
  });
  const scribblePath = document.querySelector('.hero-scribble path');
  if (scribblePath) {
    const len = scribblePath.getTotalLength();
    scribblePath.style.strokeDasharray = len;
    scribblePath.style.strokeDashoffset = len;
    gsap.to(scribblePath, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: 0.7 });
  }

  gsap.utils.toArray('.reveal-up:not(.hero .reveal-up)').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Counter animation
  gsap.utils.toArray('.stats-figure span[data-count]').forEach(el => {
    const target = +el.dataset.count;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.floor(this.targets()[0].val);
          }
        });
      }
    });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
