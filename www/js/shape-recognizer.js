document.addEventListener('DOMContentLoaded', () => {
    const box3 = document.querySelector('.box3');
    if (!box3) return;

    const LAST_PLAYED_KEY = 'chifaa_drawing_game_last_played';
    let hasWon = false;
    let timerInterval = null;

    const renderTimerOverlay = (lastTime) => {
        const timeSince = Date.now() - parseInt(lastTime, 10);
        const timeLeft = 86400000 - timeSince;

        if (timeLeft <= 0) {
            localStorage.removeItem(LAST_PLAYED_KEY);
            window.location.reload();
            return;
        }

        const h = Math.floor(timeLeft / (1000 * 60 * 60));
        const m = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((timeLeft % (1000 * 60)) / 1000);

        box3.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; padding:20px; text-align:center; color:#ffffff !important;">
                <h3 style="font-size:1.2rem; margin-bottom:10px; line-height: 1.4; color:#ffffff !important;">Thank you for spreading your light today 🤍</h3>
                <p style="font-size:0.85rem; opacity:0.85; margin-bottom:12px; color:#ffffff !important;">Next drawing prompt in:</p>
                <div style="background:rgba(0,0,0,0.2); padding:8px 16px; border-radius:12px; font-weight:bold; font-size:1.1rem; font-variant-numeric: tabular-nums; color:#ffffff !important;">
                    ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}
                </div>
                <!-- Temp button to clear localStorage -->
                <button onclick="localStorage.removeItem('${LAST_PLAYED_KEY}'); window.location.reload();" style="margin-top:15px; background:none; border:none; cursor:pointer;" title="Temp clear timer">
                    <img src="assets/images/heart.png" alt="clear timer" style="width: 20px; opacity: 0.5; filter: grayscale(100%);">
                </button>
            </div>
        `;
    };

    const startTimerOverlay = (lastTime) => {
        renderTimerOverlay(lastTime);
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            renderTimerOverlay(lastTime);
        }, 1000);
    };

    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY);
    if (lastPlayed) {
        const timeSince = Date.now() - parseInt(lastPlayed, 10);
        if (timeSince < 86400000) {
            hasWon = true; 
            startTimerOverlay(lastPlayed);
            return;
        }
    }

    const SHAPES = [
        {
            name: 'Heart',
            path: 'M 50,25 C 50,25 20,0 0,30 C -20,60 50,100 50,100 C 50,100 120,60 100,30 C 80,0 50,25 50,25 Z'
        },
        {
            name: 'Cancer Ribbon',
            path: 'M 25,95 C 35,70 45,60 50,50 C 60,35 80,25 75,15 C 70,-5 30,-5 25,15 C 20,25 40,35 50,50 C 55,60 65,70 75,95' 
        },
        {
            name: 'Star',
            path: 'M 50,5 L 61,35 L 95,35 L 67,55 L 78,85 L 50,65 L 22,85 L 33,55 L 5,35 L 39,35 Z'
        },
        {
            name: 'Crescent Moon',
            path: 'M 60,10 C 20,20 20,80 60,90 C 40,70 40,30 60,10 Z'
        },
        {
            name: 'Raindrop',
            path: 'M 50,10 C 50,10 20,50 20,70 A 30,30 0 0,0 80,70 C 80,50 50,10 50,10 Z'
        },
        {
            name: 'Cloud',
            path: 'M 35,70 C 15,70 15,45 35,45 C 35,15 75,15 75,45 C 95,45 95,70 75,70 Z'
        },
        {
            name: 'Diamond',
            path: 'M 50,10 L 90,50 L 50,90 L 10,50 Z'
        },
        {
            name: 'Leaf',
            path: 'M 50,90 C 10,90 10,10 50,10 C 90,10 90,90 50,90 Z'
        }
    ];

    const currentShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    box3.innerHTML = `
        <div style="position:absolute; top:12px; left:0; width:100%; text-align:center; color:rgba(255,255,255,0.9); font-size:12px; font-weight:600; z-index:10; pointer-events:none;">
            Draw a ${currentShape.name}
            <div style="font-size:10px; opacity:0.7; font-weight:400; margin-top:2px;" id="draw-status">Trace the outline!</div>
        </div>
        <button id="clear-canvas" style="position:absolute; bottom:12px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.2); border:none; color:white; padding:4px 12px; border-radius:12px; font-size:11px; cursor:pointer; z-index:10;">Clear</button>
        <canvas id="drawing-canvas" style="width:100%; height:100%; touch-action:none; display:block;"></canvas>
        <svg id="hidden-svg" width="100" height="100" style="display:none;">
            <path id="hidden-path" d="${currentShape.path}"></path>
        </svg>
    `;

    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clear-canvas');
    const statusText = document.getElementById('draw-status');
    const hiddenPath = document.getElementById('hidden-path');

    let width, height;
    let targetPoints = [];
    let userPoints = [];
    let isDrawing = false;
    let checkTimeout;

    const resizeCanvas = () => {
        if(hasWon) return;
        const rect = box3.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        canvas.width = width;
        canvas.height = height;
        generateTargetPoints();
        drawAll();
    };

    const generateTargetPoints = () => {
        targetPoints = [];
        const length = hiddenPath.getTotalLength();
        const steps = 100;
        
        const scale = Math.min(width, height) * 0.007; 
        const offsetX = width / 2 - (50 * scale);
        const offsetY = height / 2 - (50 * scale);

        for (let i = 0; i <= steps; i++) {
            const pt = hiddenPath.getPointAtLength((i / steps) * length);
            targetPoints.push({
                x: pt.x * scale + offsetX,
                y: pt.y * scale + offsetY
            });
        }
    };

    const drawAll = () => {
        if(hasWon) return;
        ctx.clearRect(0, 0, width, height);
        
        ctx.beginPath();
        if (targetPoints.length > 0) {
            ctx.moveTo(targetPoints[0].x, targetPoints[0].y);
            for (let i = 1; i < targetPoints.length; i++) {
                ctx.lineTo(targetPoints[i].x, targetPoints[i].y);
            }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash([8, 12]); 
        ctx.stroke();
        ctx.setLineDash([]); 

        if (userPoints.length > 0) {
            ctx.beginPath();
            ctx.moveTo(userPoints[0].x, userPoints[0].y);
            for (let i = 1; i < userPoints.length; i++) {
                const dx = userPoints[i].x - userPoints[i-1].x;
                const dy = userPoints[i].y - userPoints[i-1].y;
                if(Math.sqrt(dx*dx + dy*dy) > 50) {
                    ctx.moveTo(userPoints[i].x, userPoints[i].y);
                } else {
                    ctx.lineTo(userPoints[i].x, userPoints[i].y);
                }
            }
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 4;
            ctx.stroke();
        }
    };

    const startDraw = (e) => {
        if(hasWon) return;
        isDrawing = true;
        clearTimeout(checkTimeout);
        addPoint(e);
    };

    const moveDraw = (e) => {
        if (!isDrawing || hasWon) return;
        addPoint(e);
        drawAll();
    };

    const endDraw = () => {
        isDrawing = false;
        if(hasWon) return;
        if(userPoints.length > 10) {
            statusText.innerText = "Checking...";
            checkTimeout = setTimeout(evaluateDrawing, 1000);
        }
    };

    const addPoint = (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        if(userPoints.length > 0) {
            const last = userPoints[userPoints.length - 1];
            const dx = x - last.x;
            const dy = y - last.y;
            if(Math.sqrt(dx*dx + dy*dy) < 5) return;
        }
        
        userPoints.push({x, y});
    };

    const runSuccessSequence = () => {
        hasWon = true;
        statusText.innerText = "Beautiful! 🤍";
        
        const nowStr = Date.now().toString();
        localStorage.setItem(LAST_PLAYED_KEY, nowStr);

        showAffirmationModal();
        
        // Wait a bit, then swap the canvas for the timer
        setTimeout(() => {
            box3.style.transition = 'opacity 0.5s ease';
            box3.style.opacity = '0';
            setTimeout(() => {
                startTimerOverlay(nowStr);
                box3.style.opacity = '1';
            }, 500);
        }, 1500);
    };

    const evaluateDrawing = () => {
        if(hasWon) return;
        
        const DIST_THRESHOLD = 25; 
        
        let targetCovered = 0;
        let accurateUserPts = 0;

        for (const tp of targetPoints) {
            let found = false;
            for (const up of userPoints) {
                const d = Math.sqrt(Math.pow(tp.x - up.x, 2) + Math.pow(tp.y - up.y, 2));
                if (d < DIST_THRESHOLD) {
                    found = true;
                    break;
                }
            }
            if (found) targetCovered++;
        }

        for (const up of userPoints) {
            let found = false;
            for (const tp of targetPoints) {
                const d = Math.sqrt(Math.pow(tp.x - up.x, 2) + Math.pow(tp.y - up.y, 2));
                if (d < DIST_THRESHOLD) {
                    found = true;
                    break;
                }
            }
            if (found) accurateUserPts++;
        }

        const coverageScore = targetCovered / targetPoints.length;
        const accuracyScore = accurateUserPts / userPoints.length;

        if (coverageScore > 0.7 && accuracyScore > 0.6) {
            runSuccessSequence();
        } else {
            statusText.innerText = "Keep trying...";
        }
    };

    const showAffirmationModal = () => {
        const affirmations = [
            "There is a quiet strength within you, woven from every moment you chose to keep going.",
            "Even the stars need the dark to be seen. Your journey is uniquely yours, and it is beautiful.",
            "Healing is rarely a straight line. Give yourself the grace to rest, and the courage to begin again.",
            "Your presence alone is a remarkable gift to the world. Breathe, you are exactly where you need to be.",
            "Like a deeply rooted tree, you are weathering the storms, and tomorrow, you will bloom again.",
            "You carry a boundless sky within you. Never underestimate the healing power of your own heart.",
            "The gentle act of trying is a quiet victory. Your light is returning, even if you can't see it yet.",
            "It’s okay to pause and simply be. You are doing enough just by being here today.",
            "Your soul speaks a language of pure resilience. Trust its whispers and allow yourself to heal softly.",
            "The heaviest rain eventually becomes the lifeblood of the forest. Your tears are watering your future blooming.",
            "You do not need to be whole to be worthy. Every fractured piece of you reflects a profound, sacred light.",
            "Walk gently through your own seasons. You are growing in spaces you cannot yet see.",
            "Some days, bravery is simply taking another breath. You are so much braver than you know.",
            "You are not falling behind; you are gathering the profound wisdom that only stillness can teach.",
            "May you find solace in the spaces between your thoughts. You are safely held by the universe.",
            "Your spirit is a fierce and tender flame. No shadow can ever truly extinguish what you are.",
            "Forgive yourself for the days you felt you unraveled. Even the ocean must retreat before it rises again.",
            "You are an alchemy of stardust and strength. Trust the process of your own beautiful becoming.",
            "There is no timeline for healing a heart. Wrap yours in compassion and take all the time you need.",
            "You hold an ocean of unconditional love within. Let its gentle waves wash over your deepest wounds.",
            "Your vulnerability is a powerful bridge to the divine. Do not fear your own beautiful depths.",
            "Step out of the rushing river of time and rest on its banks. You are allowed to simply exist.",
            "The light you are seeking is already entirely within you. You are the beacon you've been waiting for.",
            "Like a flower closing its petals at night, it is safe to fold inward to protect your delicate heart.",
            "Release the weight of all that you are trying to hold. You are caught, you are anchored, you are safe.",
            "Every unhurried step you take is sacred soil. You are cultivating a garden of profound peace.",
            "Trace the map of your journey with pure reverence. You have traversed mountains with striking grace.",
            "Even when the skies feel entirely grey, your inherent worth remains perfectly illuminated."
        ];
        const text = affirmations[Math.floor(Math.random() * affirmations.length)];
        
        let modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.6)';
        modal.style.backdropFilter = 'blur(4px)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '999999';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.4s ease';

        modal.innerHTML = `
            <div style="background:var(--bg, #fff); padding:40px 32px; border-radius:24px; text-align:center; max-width:440px; box-shadow:0 20px 40px rgba(0,0,0,0.2); transform:translateY(20px); transition:transform 0.4s ease;">
                <img src="assets/images/heart.png" alt="Heart" style="width: 120px; margin-bottom:16px; display:inline-block;">
                <h2 style="font-size:20px; font-weight:800; color:var(--ink, #060507); margin-bottom:20px;">A gentle reminder...</h2>
                <p style="font-size:17px; color:#C4687E; font-weight:600; line-height:1.6;">"${text}"</p>
                <button id="close-affirmation" style="margin-top:32px; background:#060507; color:#fff; border:none; padding:12px 32px; border-radius:999px; font-weight:600; cursor:pointer; font-size:15px; transition:transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">Thank you 🤍</button>
            </div>
        `;
        document.body.appendChild(modal);

        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modal.firstElementChild.style.transform = 'translateY(0)';
        });

        document.getElementById('close-affirmation').addEventListener('click', (e) => {
            e.stopPropagation(); // prevent window mouseup
            modal.style.opacity = '0';
            modal.firstElementChild.style.transform = 'translateY(20px)';
            setTimeout(() => {
                modal.remove();
            }, 400);
        });
    };

    clearBtn.addEventListener('click', () => {
        if(hasWon) return;
        userPoints = [];
        statusText.innerText = "Trace the outline!";
        clearTimeout(checkTimeout);
        drawAll();
    });

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, {passive: false});
    canvas.addEventListener('touchmove', moveDraw, {passive: false});
    window.addEventListener('touchend', endDraw);

    window.addEventListener('resize', resizeCanvas);
    
    resizeCanvas();
});