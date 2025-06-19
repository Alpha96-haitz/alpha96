// ===== TYPEWRITER EFFECT =====
const textes = [
    "Bienvenue Chez Haitz-empire",
    "Je suis Mamadou Alpha Barry",
    "Développeur Web & Administrateur de Base de Données"
  ];
  
  let texteIndex = 0;
  let lettreIndex = 0;
  let isDeleting = false;
  const speed = 100;
  const delayBetweenTexts = 2000;
  
  const typewriter = document.getElementById("typewriter");
  
  function effetTypewriter() {
    const texteActuel = textes[texteIndex];
  
    if (isDeleting) {
      lettreIndex--;
    } else {
      lettreIndex++;
    }
  
    typewriter.textContent = texteActuel.substring(0, lettreIndex);
  
    if (!isDeleting && lettreIndex === texteActuel.length) {
      isDeleting = true;
      setTimeout(effetTypewriter, delayBetweenTexts);
    } else if (isDeleting && lettreIndex === 0) {
      isDeleting = false;
      texteIndex = (texteIndex + 1) % textes.length;
      setTimeout(effetTypewriter, 500);
    } else {
      setTimeout(effetTypewriter, speed);
    }
  }
  
  document.addEventListener("DOMContentLoaded", effetTypewriter);
  
  // ===== HAMBURGER MENU TOGGLE =====
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
  
  // ===== FERMETURE DU MENU APRÈS CLIC SUR UN LIEN (mobile) =====
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove("show");
    });
  });
  
  // ===== DÉFILEMENT FLUIDE VERS LES SECTIONS =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  
  //affichage du message àpres l'envoi

  const form = document.querySelector(".contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    fetch(form.action,{
        method: "POST",
        body: data,
        headers:{
            'Accept': 'application/json'
        }
    }).then(response =>{
        if (response.ok){
            form.innerHTML = "<p style='color:green;'>Merci ! votre message a bien été envoyer chez Haitz-empire.</p>";
        }else{
            form.innerHTML = "<p style = 'color: red;'> Une erreur s'est produite. Réessayez plus tard.</p>";
        }
    });
  });

  // realilsation
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute('data-target');
        let count = 0;
        const step = target / 50;
  
        const updateCounter = () => {
          if (count < target) {
            count += step;
            counter.textContent = Math.ceil(count);
            setTimeout(updateCounter, 20);
          } else {
            counter.textContent = target;
          }
        };
  
        updateCounter();
        observer.unobserve(counter); // pour ne pas recommencer
      }
    });
  }, {
    threshold: 0.5
  });
  
  // Observer chaque compteur
  counters.forEach(counter => observer.observe(counter));
  
  // ⚠️ Corrige le problème de "chargé mais pas scrollé"
  window.addEventListener("load", () => {
    counters.forEach(counter => {
      observer.observe(counter); // relance l'observation au chargement
    });
  });
  const fadeElements = document.querySelectorAll('.fade-in');

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });
  
  fadeElements.forEach(el => fadeObserver.observe(el));
  