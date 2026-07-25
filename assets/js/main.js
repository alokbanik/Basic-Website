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

// ---------- Nav scroll state + mobile menu ----------
const nav = document.getElementById('nav');
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

navBurger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ---------- Magnetic buttons ----------
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

// ---------- Tilt on work cards ----------
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
  });
});

// ---------- Blob parallax ----------
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  document.querySelectorAll('.blob').forEach((blob, i) => {
    const factor = (i + 1) * 0.4;
    blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});

// ---------- GSAP reveals ----------
function initReveals() {
  gsap.registerPlugin(ScrollTrigger);

  // Hero title lines
  gsap.to('.hero-title .line', {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.12,
    ease: 'power4.out',
    delay: 0.1
  });
  gsap.set('.hero-title .line', { y: 40, opacity: 0 });
  gsap.to('.hero-title .line', {
    y: 0, opacity: 1, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.1
  });

  gsap.utils.toArray('.hero .reveal-up').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.6 + i * 0.12
    });
  });

  // Scroll-triggered reveals
  gsap.utils.toArray('.reveal-up:not(.hero .reveal-up)').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Counter animation
  gsap.utils.toArray('.stat-num').forEach(el => {
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
