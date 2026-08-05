document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Setup
    const LS_KEY = 'chifaa_music_preference';
    let isPlaying = false;
    let hasAsked = localStorage.getItem(LS_KEY) !== null;
    let allowed = localStorage.getItem(LS_KEY) === 'true';

    // 2. Add Audio Element globally
    const audio = new Audio('assets/music.mp3');
    audio.loop = true;
    audio.volume = 0.35; // nice background volume

    // 3. Inject Sound Toggle Icon next to Theme Toggle
    const headerActions = document.querySelector('.header-actions');
    if (headerActions) {
        const soundBtn = document.createElement('div');
        soundBtn.className = 'theme-toggle sound-toggle';
        soundBtn.setAttribute('title', 'Toggle music');
        soundBtn.setAttribute('role', 'button');
        
        // SVG for volume-up / volume-mute
        soundBtn.innerHTML = `
            <svg class="sound-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path class="sound-waves" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;
        
        // Insert before the hamburger or after theme-toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.parentNode.insertBefore(soundBtn, themeToggle.nextSibling);
            }

        // Toggle logic
        soundBtn.addEventListener('click', () => {
             if (isPlaying) {
                 audio.pause();
                 isPlaying = false;
                 localStorage.setItem(LS_KEY, 'false');
                 updateIcon(false);
             } else {
                 audio.play().then(() => {
                     isPlaying = true;
                     localStorage.setItem(LS_KEY, 'true');
                     updateIcon(true);
                 }).catch(e => console.log('Playback prevented', e));
             }
        });

        function updateIcon(playing) {
            const waves = soundBtn.querySelector('.sound-waves');
            if (waves) {
                waves.style.display = playing ? 'block' : 'none';
                soundBtn.style.color = playing ? '#C4687E' : '';
            }
        }
        
        // Initial state icon
        updateIcon(allowed);
    }

    // 4. Background Modal functionality
    if (!hasAsked) {
        // Inject nicely styled modal
        const modalHtml = `
            <div id="music-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 99999; opacity: 0; transition: opacity 0.4s ease;">
                <div class="music-modal-box" style="background: var(--bg, #fff); text-align: center; padding: 40px 30px; border-radius: 28px; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.15); transform: translateY(20px); transition: transform 0.4s ease;">
                    <img src="assets/images/bfmusic.png" alt="Music Icon" style="width: 80px; height: auto; margin: 0 auto 20px; display: block;" />
                    <h2 style="font-size: 24px; font-weight: 800; color: var(--ink, #060507); margin-bottom: 12px;">Immersive Experience</h2>
                    <p style="color: var(--muted, #5D5257); margin-bottom: 32px; font-size: 15px; line-height: 1.6;">Would you like to play background music to enhance your journey through CHIFAA? You can mute it anytime.</p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button id="btn-decline-music" style="padding: 14px 28px; border-radius: 99px; border: 1.5px solid rgba(6,5,7,0.12); background: transparent; cursor: pointer; font-weight: 600; color: var(--ink, #060507); font-size: 15px; transition: all 0.2s ease;">No thanks</button>
                        <button id="btn-accept-music" style="padding: 14px 28px; border-radius: 99px; border: none; background: #C4687E; color: white; cursor: pointer; font-weight: 600; font-size: 15px; box-shadow: 0 8px 16px rgba(196,104,126,0.3); transition: all 0.2s ease;">Play Music</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        const musicModal = document.getElementById('music-modal-overlay');
        const modalBox = musicModal.querySelector('.music-modal-box');
        const acceptBtn = document.getElementById('btn-accept-music');
        const declineBtn = document.getElementById('btn-decline-music');

        // Dark mode adaptation via existing CSS vars or brute overrides
        if (document.body.classList.contains('dark-mode')) {
             modalBox.style.background = '#0F1115';
             modalBox.style.color = '#F0F0F0';
             modalBox.querySelector('h2').style.color = '#F0F0F0';
             modalBox.querySelector('p').style.color = '#AAB2C0';
             declineBtn.style.color = '#F0F0F0';
             declineBtn.style.borderColor = 'rgba(255,255,255,0.2)';
        }

        // Animate In
        setTimeout(() => {
            musicModal.style.opacity = '1';
            modalBox.style.transform = 'translateY(0)';
        }, 100);

        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(LS_KEY, 'true');
            audio.play().then(() => {
                isPlaying = true;
                const waves = document.querySelector('.sound-waves');
                if (waves) {
                    waves.style.display = 'block';
                    document.querySelector('.sound-toggle').style.color = '#C4687E';
                }
            }).catch(e => console.log(e));
            closeModal();
        });

        declineBtn.addEventListener('click', () => {
            localStorage.setItem(LS_KEY, 'false');
            closeModal();
        });

        // Hover effects on buttons
        acceptBtn.onmouseenter = () => acceptBtn.style.transform = 'translateY(-2px)';
        acceptBtn.onmouseleave = () => acceptBtn.style.transform = 'translateY(0)';
        declineBtn.onmouseenter = () => declineBtn.style.transform = 'translateY(-2px)';
        declineBtn.onmouseleave = () => declineBtn.style.transform = 'translateY(0)';

        function closeModal() {
            musicModal.style.opacity = '0';
            modalBox.style.transform = 'translateY(20px)';
            setTimeout(() => musicModal.remove(), 400);
        }
    } else if (allowed) {
        // User previously allowed, try to play
        audio.play().then(() => {
             isPlaying = true;
             const waves = document.querySelector('.sound-waves');
             if (waves) {
                 waves.style.display = 'block';
                 document.querySelector('.sound-toggle').style.color = '#C4687E';
             }
        }).catch(() => {
             // Browser blocked autoplay on reload. Do NOT show it as muted.
             // We'll keep the icon active and attach an invisible listener.
             isPlaying = false; // Internal state is false until interaction 

             const playOnAnyInteraction = (e) => {
                 // Try not to conflict if the user clicks the sound button specifically
                 const isBtn = e.target && e.target.closest && e.target.closest('.sound-toggle');
                 if (isBtn) return;
                 
                 audio.play().catch(err => console.log('Wait longer:', err));
                 isPlaying = true;
                 
                 const waves = document.querySelector('.sound-waves');
                 if (waves) waves.style.display = 'block';
                 const sBtn = document.querySelector('.sound-toggle');
                 if (sBtn) sBtn.style.color = '#C4687E';

                 document.removeEventListener('click', playOnAnyInteraction);
                 document.removeEventListener('keydown', playOnAnyInteraction);
             };
             
             document.addEventListener('click', playOnAnyInteraction);
             document.addEventListener('keydown', playOnAnyInteraction);
        });
    }
});
