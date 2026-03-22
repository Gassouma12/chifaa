document.addEventListener("DOMContentLoaded", function() {
  // Get a reference to the logo element
  const logo = document.getElementById("logo");

  if (logo) {
    // Listen for the mouseover event on the logo
    logo.addEventListener("mouseover", function() {
      // Change the class to trigger the transition
      logo.classList.add("fade-out");

      // After a delay, change the source of the logo to the yellow version
      setTimeout(function() {
        logo.src = "assets/images/logo-yellow.png";

        // Change the class to trigger the fade-in transition
        setTimeout(function() {
          logo.classList.remove("fade-out");
        }, 50); // Adjust this delay to match the CSS transition duration
      }, 50); // Adjust this delay to match the CSS transition duration
    });

    // Listen for the mouseout event on the logo
    logo.addEventListener("mouseout", function() {
      // Change the class to trigger the transition
      logo.classList.add("fade-out");

      // After a delay, change the source of the logo back to the black version
      setTimeout(function() {
        logo.src = "assets/images/logo-black.png";

        // Change the class to trigger the fade-in transition
        setTimeout(function() {
          logo.classList.remove("fade-out");
        }, 50); // Adjust this delay to match the CSS transition duration
      }, 50); // Adjust this delay to match the CSS transition duration
    });
  }

  // Add click listener for box2b navigation
  const box2b = document.querySelector('.box2b');
  if (box2b) {
    box2b.style.cursor = 'pointer'; // Add a visual cue that it's clickable
    box2b.addEventListener('click', function() {
      window.location.href = 'on-founders.html';
    });
  }

  // --- Seamless Play Button Rotation ---
  const playButton = document.querySelector(".box2 .box2text img");

  if (playButton) {
      let currentAngle = 0;
      let rotationSpeed = 0.2; // Slow speed
      const fastSpeed = 0.4; // Faster speed on hover
      const slowSpeed = 0.2;

      function animate() {
          currentAngle += rotationSpeed;
          const scale = playButton.matches(':hover') ? 1.1 : 1;
          playButton.style.transform = `scale(${scale}) rotate(${currentAngle}deg)`;
          requestAnimationFrame(animate);
      }

      playButton.addEventListener('mouseover', () => {
          rotationSpeed = fastSpeed;
      });

      playButton.addEventListener('mouseout', () => {
          rotationSpeed = slowSpeed;
      });

      // Start the animation
      animate();
  }
});

// Sticky header on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});




document.addEventListener('DOMContentLoaded', function() {
  const words = ['Healing', 'Hope', 'Dignity', 'Resilience', 'Women Empowerment', 'Human-Centered AI', 'Renaissance', 'Transformation \u00B7 Rebirth \u00B7 Courage'];
  let wordIndex = 0;
  let isDeleting = false;
  let text = '';
  let isFading = false;
  const el = document.getElementById('typewriter-text');
  if(!el) return;

  function type() {
    const currentWord = words[wordIndex];
    
    if(isFading) {
      el.style.opacity = 0;
      setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        text = '';
        el.innerText = '\u00A0';
        isFading = false;
        el.style.opacity = 1;
        setTimeout(type, 200);
      }, 500);
      return;
    }

    text = currentWord.substring(0, text.length + 1);
    el.innerText = text;

    let typeSpeed = 100;
    
    if (text === currentWord) {
      typeSpeed = 2000; // Pause after typing
      isFading = true;
    }

    setTimeout(type, typeSpeed);
  }
  
  setTimeout(type, 500);
});

