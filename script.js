/* =============================================================
   Belated Birthday Surprise — script
   Sections:
     1. Background petals + glowing particles
     2. Envelope click → transition to birthday scene
     3. Birthday scene start: balloons + typewriter message
     4. Buttons: "Maaf Krdo" reaction & "Don't Maaf" runaway
     5. Confetti animation (canvas)
     6. Music toggle (muted by default)
   ============================================================= */

(() => {
  'use strict';

  /* ---------- 1. Background petals + glowing particles ---------- */
  const petalsBox = document.getElementById('petals');
  const petalChars = ['🌸', '🌺', '💮', '🌷', '✿', '❀'];

  function makeFloater({ char, sparkle = false, minDur = 9, maxDur = 18 }) {
    const el = document.createElement('div');
    el.className = sparkle ? 'petal sparkle' : 'petal';
    el.textContent = char;

    const size = sparkle ? (10 + Math.random() * 14) : (14 + Math.random() * 22);
    el.style.fontSize = size + 'px';
    el.style.left = Math.random() * 100 + 'vw';

    const dur = minDur + Math.random() * (maxDur - minDur);
    el.style.animationDuration = dur + 's';
    el.style.animationDelay = -Math.random() * dur + 's';
    el.style.opacity = (sparkle ? 0.6 : 0.5) + Math.random() * 0.4;

    petalsBox.appendChild(el);
    setTimeout(() => el.remove(), dur * 1000 + 200);
  }

  // Initial seed so the screen isn't empty on load
  for (let i = 0; i < 28; i++) {
    makeFloater({ char: petalChars[i % petalChars.length] });
  }
  for (let i = 0; i < 14; i++) {
    makeFloater({ char: '✦', sparkle: true });
  }

  // Continual spawn
  setInterval(() => {
    makeFloater({ char: petalChars[Math.floor(Math.random() * petalChars.length)] });
  }, 750);
  setInterval(() => {
    makeFloater({ char: '✦', sparkle: true, minDur: 10, maxDur: 16 });
  }, 1100);

  /* ---------- 2. Envelope click → birthday scene ---------- */
  const envelope       = document.getElementById('envelope');
  const envelopeScene  = document.getElementById('envelopeScene');
  const birthdayScene  = document.getElementById('birthdayScene');

  let opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');

    // After the letter slides up, fade out scene 1 and show scene 2
    setTimeout(() => {
      envelopeScene.style.opacity = '0';
      setTimeout(() => {
        envelopeScene.classList.add('hidden');
        birthdayScene.classList.remove('hidden');
        // soft fade-in
        birthdayScene.style.opacity = '0';
        requestAnimationFrame(() => {
          birthdayScene.style.opacity = '1';
        });
        startBirthdayScene();
      }, 900);
    }, 1700);
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  /* ---------- 3. Birthday scene: balloons + typewriter ---------- */
  const balloonsBox = document.getElementById('balloons');
  const balloonColors = [
    'radial-gradient(circle at 30% 30%, #ffd1dc, #ff8fab)',
    'radial-gradient(circle at 30% 30%, #e0c3fc, #c8a8e9)',
    'radial-gradient(circle at 30% 30%, #ffe4b5, #ffd6a5)',
    'radial-gradient(circle at 30% 30%, #cfeaff, #a8d8f0)',
    'radial-gradient(circle at 30% 30%, #ffe9f0, #ffb3c6)',
    'radial-gradient(circle at 30% 30%, #fffacd, #ffe066)',
  ];

  function spawnBalloon() {
    if (birthdayScene.classList.contains('hidden')) return;
    const b = document.createElement('div');
    b.className = 'balloon';
    b.style.left = (Math.random() * 100) + 'vw';
    b.style.background = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const dur = 9 + Math.random() * 7;
    b.style.animationDuration = dur + 's';
    const w = 30 + Math.random() * 22;
    b.style.width  = w + 'px';
    b.style.height = (w * 1.25) + 'px';
    balloonsBox.appendChild(b);
    setTimeout(() => b.remove(), dur * 1000 + 500);
  }

  function typewriter(target, text, speed = 45) {
    return new Promise(resolve => {
      let i = 0;
      target.textContent = '';
      function tick() {
        if (i <= text.length) {
          target.textContent = text.slice(0, i);
          i++;
          // Slow down a bit on punctuation
          const ch = text[i - 1] || '';
          const delay = (ch === ',' || ch === '.' || ch === '…' || ch === '\n') ? speed * 6 : speed;
          setTimeout(tick, delay);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  let birthdayStarted = false;
  function startBirthdayScene() {
    if (birthdayStarted) return;
    birthdayStarted = true;

    // Initial wave of balloons, then a steady stream
    for (let i = 0; i < 10; i++) setTimeout(spawnBalloon, i * 350);
    setInterval(spawnBalloon, 700);

    // Typewriter the heartfelt message — for one of my closest friends
    const msg =
`Happy Belated Birthday to one of the most special people in my life ❤️
I know I'm late… but you matter way too much for me to let your day pass quietly.
You're not just a friend — you're family I got to choose.
Thank you for every memory, every laugh, and every random late-night talk.
I want to treasure this friendship all the way through my life. 🌷
Now… maaf krdo? 🥺`;

    const target = document.getElementById('message');
    const caret = document.getElementById('caret');
    setTimeout(() => {
      typewriter(target, msg, 45).then(() => caret.classList.add('done'));
    }, 700);
  }

  /* ---------- 4. Buttons ---------- */
  const btnYes    = document.getElementById('btnYes');
  const btnNo     = document.getElementById('btnNo');
  const reaction  = document.getElementById('reaction');
  const buttonsEl = document.getElementById('buttons');

  btnYes.addEventListener('click', () => {
    reaction.classList.remove('hidden');
    buttonsEl.style.display = 'none';
    launchConfetti(220);
    // A second burst for extra delight
    setTimeout(() => launchConfetti(120), 600);
    setTimeout(() => launchConfetti(80), 1400);
    reaction.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  // The runaway "Don't Maaf" button
  function moveBtnNo() {
    const margin = 16;
    const rect = btnNo.getBoundingClientRect();
    const maxX = window.innerWidth  - rect.width  - margin * 2;
    const maxY = window.innerHeight - rect.height - margin * 2;
    const x = margin + Math.random() * Math.max(0, maxX);
    const y = margin + Math.random() * Math.max(0, maxY);
    btnNo.style.position = 'fixed';
    btnNo.style.left = x + 'px';
    btnNo.style.top  = y + 'px';
    btnNo.style.right = 'auto';
    btnNo.style.bottom = 'auto';
    // tiny tilt for cuteness
    btnNo.style.transform = `rotate(${(Math.random() * 20 - 10).toFixed(1)}deg)`;
  }

  // Run away on multiple events (covers desktop & mobile)
  ['mouseenter', 'mouseover', 'pointerover', 'focus'].forEach(ev =>
    btnNo.addEventListener(ev, moveBtnNo)
  );
  // On touch devices, run as soon as a finger gets near it
  btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); moveBtnNo(); }, { passive: false });
  // Last-ditch defence: even if a click somehow lands, just move and ignore
  btnNo.addEventListener('click', (e) => { e.preventDefault(); moveBtnNo(); });

  /* ---------- 5. Confetti animation ---------- */
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const confettiColors = ['#ff8fab', '#c8a8e9', '#ffd6a5', '#a8d8f0', '#ffe066', '#ffc1d6', '#b56aff'];
  let pieces = [];
  let animating = false;

  function launchConfetti(count = 180) {
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 7,
        vy: 2 + Math.random() * 5,
        size: 5 + Math.random() * 7,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        shape: Math.random() < 0.35 ? 'circle' : 'rect',
        wobble: Math.random() * Math.PI * 2,
      });
    }
    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter(p => p.y < canvas.height + 30);

    pieces.forEach(p => {
      p.wobble += 0.1;
      p.x += p.vx + Math.sin(p.wobble) * 0.6;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.vrot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
      }
      ctx.restore();
    });

    if (pieces.length > 0) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
    }
  }

  /* ---------- 5b. Lightbox: full-size photo viewer ---------- */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev  = document.getElementById('lightboxPrev');
  const lightboxNext  = document.getElementById('lightboxNext');

  // Collect photo polaroids in document order (skip the STEP note)
  const photoPolaroids = Array.from(
    document.querySelectorAll('.polaroid:not(.polaroid-note)')
  );
  const photos = photoPolaroids.map(p => {
    const img = p.querySelector('img');
    return { src: img.src, alt: img.alt || '' };
  });
  let lightboxIndex = 0;

  function showAt(i) {
    if (!photos.length) return;
    lightboxIndex = (i + photos.length) % photos.length;
    const p = photos[lightboxIndex];
    lightboxImg.src = p.src;
    lightboxImg.alt = p.alt;
  }

  function openLightbox(i) {
    showAt(i);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  photoPolaroids.forEach((el, i) => {
    el.addEventListener('click', () => openLightbox(i));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev .addEventListener('click', (e) => { e.stopPropagation(); showAt(lightboxIndex - 1); });
  lightboxNext .addEventListener('click', (e) => { e.stopPropagation(); showAt(lightboxIndex + 1); });

  // Click on backdrop (but not on the photo or controls) closes it
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard: Esc closes, arrows navigate
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    else if (e.key === 'ArrowLeft')  showAt(lightboxIndex - 1);
    else if (e.key === 'ArrowRight') showAt(lightboxIndex + 1);
  });

  // Swipe support on touch devices
  let touchStartX = 0;
  let touchStartY = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      showAt(lightboxIndex + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  /* ---------- 6. Music toggle ---------- */
  const music   = document.getElementById('bgMusic');
  const musicBtn = document.getElementById('musicToggle');

  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      const playPromise = music.play();
      if (playPromise && playPromise.then) {
        playPromise.then(() => {
          musicBtn.classList.remove('muted');
          musicBtn.textContent = '🎵';
        }).catch(() => {
          // Autoplay policy may block — let user know with a small shake
          musicBtn.animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' },
             { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }],
            { duration: 250 }
          );
        });
      }
    } else {
      music.pause();
      musicBtn.classList.add('muted');
      musicBtn.textContent = '🔇';
    }
  });
})();
