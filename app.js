/* =====================================================================
   SESETTI OPHIR EARNEST — HYBRID PORTFOLIO INTERACTIVITY ENGINE
   ===================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if loaded
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initAudioSynth();
  initCanvasBackground();
  initStatCounters();
  initDualTrackFilter();
  initModals();
  initEmailClipboard();
  initContactForm();
  initMobileNav();
  initNavbarScroll();
});

/* ---------------------------------------------------------------------
   1. PROCEDURAL WEB AUDIO SFX (Tactile Cybernetic Audio)
   --------------------------------------------------------------------- */
let audioCtx = null;
let sfxEnabled = false;

function initAudioSynth() {
  const sfxToggleBtn = document.getElementById('sfxToggle');
  const sfxIcon = document.getElementById('sfxIcon');
  const sfxLabel = document.getElementById('sfxLabel');

  if (!sfxToggleBtn) return;

  sfxToggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
      sfxToggleBtn.classList.add('badge-cyan');
      sfxToggleBtn.classList.remove('text-gray-400');
      sfxLabel.textContent = 'SFX: ON';
      playCyberSound('beep');
    } else {
      sfxToggleBtn.classList.remove('badge-cyan');
      sfxToggleBtn.classList.add('text-gray-400');
      sfxLabel.textContent = 'SFX: OFF';
    }
  });

  // Attach sound triggers to interactive elements
  document.querySelectorAll('button, a, .game-card, .project-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (sfxEnabled) playCyberSound('hover');
    });
    el.addEventListener('click', () => {
      if (sfxEnabled) playCyberSound('click');
    });
  });
}

function playCyberSound(type) {
  if (!sfxEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(1240, now + 0.08);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'beep') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(1200, now + 0.06);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (e) {
    // Graceful fallback if audio is restricted
  }
}

/* ---------------------------------------------------------------------
   2. INTERACTIVE CYBERNETIC CANVAS
   --------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('cyberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 60 : 30, 80);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(0, 240, 255, ' : 'rgba(255, 0, 85, '
    });
  }

  let mouseX = -1000;
  let mouseY = -1000;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse repulsion subtle effect
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        p.x -= (dx / dist) * 1.5;
        p.y -= (dy / dist) * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (pDist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(100, 150, 255, ${0.12 * (1 - pDist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ---------------------------------------------------------------------
   3. ANIMATED STAT COUNTERS
   --------------------------------------------------------------------- */
function initStatCounters() {
  const statElements = document.querySelectorAll('[data-counter]');
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statElements.forEach((el) => {
            const target = parseFloat(el.getAttribute('data-counter'));
            const isFloat = el.getAttribute('data-is-float') === 'true';
            const suffix = el.getAttribute('data-suffix') || '';
            const prefix = el.getAttribute('data-prefix') || '';
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
              const currentVal = target * easeProgress;

              if (isFloat) {
                el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
              } else {
                el.textContent = `${prefix}${Math.round(currentVal)}${suffix}`;
              }

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                if (isFloat) {
                  el.textContent = `${prefix}${target.toFixed(1)}${suffix}`;
                } else {
                  el.textContent = `${prefix}${target}${suffix}`;
                }
              }
            }

            requestAnimationFrame(updateCounter);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  const statsSection = document.getElementById('statsBanner');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ---------------------------------------------------------------------
   4. DUAL-TRACK MODE FILTER (Scholar & Developer vs Competitive Gamer)
   --------------------------------------------------------------------- */
function initDualTrackFilter() {
  const filterButtons = document.querySelectorAll('.track-filter-btn');
  const scholarElements = document.querySelectorAll('.track-scholar');
  const gamerElements = document.querySelectorAll('.track-gamer');
  const modeStatusPill = document.getElementById('activeModePill');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => {
        b.classList.remove('active-all', 'active-scholar', 'active-gamer', 'bg-white/10', 'text-white');
        b.classList.add('text-gray-400');
      });

      const mode = btn.getAttribute('data-mode');
      btn.classList.remove('text-gray-400');

      if (mode === 'all') {
        btn.classList.add('active-all');
        scholarElements.forEach((el) => {
          el.style.display = '';
          el.classList.remove('opacity-40');
        });
        gamerElements.forEach((el) => {
          el.style.display = '';
          el.classList.remove('opacity-40');
        });
        if (modeStatusPill) modeStatusPill.innerHTML = '<span class="text-cyan-400">SCHOLAR</span> <span class="text-gray-500">&amp;</span> <span class="text-pink-500">GAMER DUAL MATRIX</span>';
      } else if (mode === 'scholar') {
        btn.classList.add('active-scholar');
        scholarElements.forEach((el) => {
          el.style.display = '';
          el.classList.remove('opacity-40');
        });
        gamerElements.forEach((el) => {
          el.classList.add('opacity-40');
        });
        if (modeStatusPill) modeStatusPill.innerHTML = '<span class="text-cyan-400">SCHOLAR &amp; DEV MODE ACTIVE</span>';
      } else if (mode === 'gamer') {
        btn.classList.add('active-gamer');
        gamerElements.forEach((el) => {
          el.style.display = '';
          el.classList.remove('opacity-40');
        });
        scholarElements.forEach((el) => {
          el.classList.add('opacity-40');
        });
        if (modeStatusPill) modeStatusPill.innerHTML = '<span class="text-pink-500">COMPETITIVE GAMER MODE ACTIVE</span>';
      }
    });
  });
}

/* ---------------------------------------------------------------------
   5. INTERACTIVE MODALS FOR GAMES & CODING PROJECTS
   --------------------------------------------------------------------- */
const gamesData = {
  gow: {
    title: "God of War (Norse Saga / Ragnarök)",
    genre: "Action-Adventure | Mythological Hack & Slash",
    platform: "PlayStation / PC",
    masteryBadge: "VALKYRIE & BERSERKER CRUSHER",
    accentColor: "border-crimson",
    overview: "Mastered high-difficulty parrying, precision Leviathan Axe throwing/recalling, dual Blades of Chaos crowd management, and high-tier boss attack pattern decoding across the Nine Realms.",
    mechanics: [
      { name: "Precision Parry Timing", value: "98%", desc: "Sub-frame shield parry consistency against Valkyrie Queen Gná & Sigrun" },
      { name: "Combo Synergy & Weapon Switching", value: "95%", desc: "Fluid transitions between Leviathan Axe, Blades of Chaos, and Draupnir Spear" },
      { name: "Runic Optimization & Build Craft", value: "94%", desc: "Custom realm-shift cooldown loadouts engineered for burst damage" }
    ],
    highlight: "Completed on 'Give Me God of War' difficulty, decoding untelegraphed boss combos and executing flawless stance switches under maximum pressure."
  },
  gtav: {
    title: "Grand Theft Auto V & GTA Online",
    genre: "Open-World Action | Strategic Heists & Tactical Crime",
    platform: "Console / PC",
    masteryBadge: "MASTERMIND HEIST TACTICIAN",
    accentColor: "border-amber-500",
    overview: "High-level open-world strategy, precision escape driving/flying mechanics, and coordinated multi-stage heist execution with zero casualty protocols.",
    mechanics: [
      { name: "High-Speed Pursuit Navigation", value: "96%", desc: "Tight angle cornering, traffic threading, and aerial evasion" },
      { name: "Multi-Stage Heist Planning", value: "97%", desc: "Flawless stealth prep, team loadout assignments, and synchronized hacks" },
      { name: "Combat Snap-Aim & Cover Flow", value: "92%", desc: "Fast headshot snap-targeting from vehicle and behind cover" }
    ],
    highlight: "Executed high-stakes criminal mastermind and elite challenge heist operations with tactical route planning and rapid response calls."
  },
  re_village: {
    title: "Resident Evil Village",
    genre: "Survival Horror | Resource Management & Tactical Combat",
    platform: "Console / PC",
    masteryBadge: "VILLAGE SURVIVAL SPECIALIST",
    accentColor: "border-red-500",
    overview: "Survival horror resource management, puzzle decoding under pressure, and high-accuracy combat in intense, claustrophobic boss encounters.",
    mechanics: [
      { name: "Inventory Tetris & Resource Economy", value: "98%", desc: "Calculated ammo crafting, herb conservation, and merchant trade optimization" },
      { name: "Pressure Puzzle Decoding", value: "95%", desc: "Rapid spatial and cryptic puzzle solutions while under pursuit" },
      { name: "Critical Weakspot Sniping", value: "94%", desc: "High-accuracy hits on fast lycans and armored mutant threats" }
    ],
    highlight: "Mastered Hardcore/Village of Shadows difficulty runs requiring absolute ammo conservation and calculated defensive parrying."
  },
  ac_series: {
    title: "Assassin's Creed Series",
    genre: "Stealth Action | Historic Parkour & Tactical Infiltration",
    platform: "Console / PC",
    masteryBadge: "SHADOW MASTER INFILTRATOR",
    accentColor: "border-cyan-400",
    overview: "Stealth mechanics, tactical parkour navigation, environmental awareness, synchronized assassination chains, and melee counter mastery.",
    mechanics: [
      { name: "Tactical Pathfinding & Parkour", value: "96%", desc: "Fluid 3D rooftop navigation and high-momentum escape routes" },
      { name: "Ghost Stealth & Line-of-Sight", value: "95%", desc: "Zero-detection infiltration of heavily fortified strongholds" },
      { name: "Synchronized Kill Chains", value: "93%", desc: "Calculated multi-target assassination sequences" }
    ],
    highlight: "Achieved 100% synchronization across multiple historical eras, prioritizing complete stealth and non-lethal ghost runs where required."
  },
  detroit: {
    title: "Detroit: Become Human",
    genre: "Interactive Drama | Branching Narrative & Tactical Reflex",
    platform: "PlayStation / PC",
    masteryBadge: "100% FLOWCHART STRATEGIST",
    accentColor: "border-blue-400",
    overview: "Complex branching-narrative analysis, quick-time reflex mastery, high-speed behavioral deduction, and calculated ethical dilemma resolution.",
    mechanics: [
      { name: "Branching Logic Deductions", value: "99%", desc: "Forensic reconstruction and anticipating cascading timeline consequences" },
      { name: "QTE Reflex Consistency", value: "97%", desc: "Zero-error mechanical quick-time inputs in life-or-death scenarios" },
      { name: "Dialogue & Morality Optimization", value: "95%", desc: "Engineered perfect survivor endings across all three android protagonists" }
    ],
    highlight: "Completed comprehensive flowchart pathways, demonstrating meticulous logic mapping akin to algorithmic state-machine debugging."
  },
  rdr2_spiderman: {
    title: "Red Dead Redemption 2 & Marvel's Spider-Man",
    genre: "Open-World Immersion & Aerial Combat Mastery",
    platform: "PlayStation / PC",
    masteryBadge: "DYNAMIC MOVEMENT VIRTUOSO",
    accentColor: "border-amber-400",
    overview: "Open-world immersion, fast-paced aerial/combat combos, gadget weaving, and precision Dead Eye aiming in fast cinematic showdowns.",
    mechanics: [
      { name: "Aerial Acrobatic Combo Flow", value: "98%", desc: "Flawless web-swing momentum and aerial juggle dominance in Spider-Man" },
      { name: "Dead Eye Quickdraw Precision", value: "95%", desc: "Multi-target tagging and fast holster draws in RDR2 frontier gunfights" },
      { name: "World Immersion & Detail Mastery", value: "96%", desc: "Wildlife tracking, weapon degradation upkeep, and gadget loadouts" }
    ],
    highlight: "Mastered Spider-Man Ultimate difficulty combat challenges and RDR2 survival/sharpshooter master rankings."
  },
  tlou_ghostoftsushima: {
    title: "The Last of Us & Ghost of Tsushima",
    genre: "Tactical Stealth-Action | Lethal Stance-Switching",
    platform: "PlayStation",
    masteryBadge: "LETHAL STANCE & SURVIVAL VETERAN",
    accentColor: "border-purple-500",
    overview: "Tactical stealth-action, lethal katana stance-switching mechanics, brick/bottle distraction loops, and adaptive survival gameplay.",
    mechanics: [
      { name: "Instant Stance Adaptability", value: "97%", desc: "Fluid transitions between Stone, Water, Wind, and Moon stances in Tsushima" },
      { name: "Lethal Parry & Dodge Timing", value: "96%", desc: "Precision parry windows on Lethal+ difficulty with zero armor crutches" },
      { name: "Scavenge & Improvised Warfare", value: "94%", desc: "Resource craft in The Last of Us Grounded difficulty under extreme scarcity" }
    ],
    highlight: "Conquered Ghost of Tsushima on Lethal+ mode with zero damage duels and cleared TLOU Grounded difficulty through disciplined stealth."
  }
};

const projectsData = {
  logic_decoder: {
    title: "Logic Decoder & Algorithmic Problem Solver",
    stack: "C++ | Python | Data Structures & Algorithms",
    badge: "CORE SPECIALTY: CODING & DECODING",
    overview: "Engineered a high-performance algorithmic suite capable of processing, encoding, and decoding complex data strings, ciphered patterns, and bitwise transformations. Implemented custom hashing and tree-based decoders to resolve data structures with minimal time complexity.",
    features: [
      "Dynamic Pattern Recognition: Detects recurring algorithmic structures across alphanumeric datasets.",
      "Bitwise Logic Engine: Performs low-level masking, parity verification, and binary manipulations.",
      "Optimized Complexity: Reduced search and decode lookups to O(log n) using balanced binary structures.",
      "Interactive Terminal & Benchmarks: Displays processing throughput, cycle counts, and decoded streams."
    ],
    codeSnippet: `// C++ Bitwise Decryption & Pattern Lookup Kernel
#include <iostream>
#include <string>
#include <vector>

class LogicDecoder {
public:
    static std::string decodePattern(const std::string& input, uint8_t key) {
        std::string decoded = input;
        for (size_t i = 0; i < decoded.size(); ++i) {
            // Apply reverse cyclic bitwise XOR and positional parity
            decoded[i] = (decoded[i] ^ key) ^ static_cast<char>((i * 7) % 256);
        }
        return decoded;
    }
};`
  },
  java_web_suite: {
    title: "Interactive Web & Java Application Suite",
    stack: "Java (OOP, Exception Handling, AWT) | HTML5 | CSS3 | JavaScript",
    badge: "MODULAR FULL-STACK ARCHITECTURE",
    overview: "Constructed a cohesive software suite integrating responsive web interfaces with robust desktop Java utilities. Employs strict Object-Oriented principles, custom event dispatchers, and fault-tolerant exception hierarchies to ensure rock-solid stability.",
    features: [
      "Rigorous OOP Architecture: Encapsulation, polymorphic handlers, and clean interface segregation.",
      "Custom Event-Driven Model: Utilizes AWT/Swing event listeners alongside modern DOM async handlers.",
      "Resilient Exception Recovery: Hierarchical try-catch cascades preventing runtime state corruption.",
      "Responsive Glassmorphic UI: Front-end client styled with modern dark aesthetics and real-time validation."
    ],
    codeSnippet: `// Java Exception-Safe Modular Application Controller
public class TacticalAppSuite {
    public static void executeSecureTransaction(DataPayload payload) {
        try {
            validatePayload(payload);
            EventListenerManager.dispatch(new SystemEvent("SYSTEM_READY", payload));
        } catch (DataValidationException | NetworkIOException ex) {
            Logger.logTacticalError("Execution halted safely", ex);
        } finally {
            ResourcePool.cleanup();
        }
    }
}`
  },
  electronics_microcontroller: {
    title: "Electronics & Microcontroller System Models",
    stack: "8051 Microcontroller | Digital Electronics | Embedded C | Logic Gates",
    badge: "HARDWARE-SOFTWARE SYNERGY",
    overview: "Comprehensive coursework and lab implementations exploring the direct intersection of low-level digital logic and software instructions. Built 8051 assembly/C routines to simulate real-world hardware interfaces, timers, interrupts, and logic state machines.",
    features: [
      "8051 Microcontroller Programming: Configured timers, SFR registers, baud rates, and external interrupts.",
      "Digital Logic Circuit Design: Mapped boolean expressions to optimized NAND/NOR gate matrices.",
      "Mathematical Modeling: Modeled electrical behavior and signal propagation delays.",
      "Embedded C Firmware: Structured lean low-level routines with zero heap allocation overhead."
    ],
    codeSnippet: `// 8051 Microcontroller Timer & Interrupt Driver in Embedded C
#include <reg51.h>

void Timer0_Init(void) {
    TMOD &= 0xF0;     // Clear Timer 0 bits
    TMOD |= 0x01;     // Set Timer 0 in 16-bit Timer Mode
    TH0 = 0xFC;       // 1ms delay reload constant @ 11.0592MHz
    TL0 = 0x66;
    ET0 = 1;          // Enable Timer 0 Interrupt
    EA  = 1;          // Enable Global Interrupt
    TR0 = 1;          // Start Timer 0
}

void Timer0_ISR(void) interrupt 1 {
    TH0 = 0xFC;
    TL0 = 0x66;
    P1 ^= 0x01;       // Toggle Pin 1.0 (Square Wave Generation)
}`
  }
};

function initModals() {
  const modalContainer = document.getElementById('inspectModal');
  const modalBody = document.getElementById('modalContentBody');
  const modalCloseBtn = document.getElementById('closeModalBtn');

  if (!modalContainer || !modalBody) return;

  function closeModal() {
    modalContainer.classList.add('hidden');
    modalContainer.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  modalContainer.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Attach game card clicks
  document.querySelectorAll('[data-game-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const gameId = card.getAttribute('data-game-id');
      const data = gamesData[gameId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="space-y-6">
          <div class="border-b border-gray-800 pb-4">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="badge-crimson text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">${data.genre}</span>
              <span class="badge-violet text-xs font-mono px-3 py-1 rounded-full">${data.platform}</span>
              <span class="text-amber-400 text-xs font-mono border border-amber-500/30 bg-amber-500/10 px-3 py-1 rounded-full">${data.masteryBadge}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">${data.title}</h2>
          </div>

          <div>
            <h4 class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-pink-500"></span> Combat &amp; Strategy Analysis
            </h4>
            <p class="text-gray-300 leading-relaxed text-sm sm:text-base">${data.overview}</p>
          </div>

          <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
            <h4 class="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Tactical Mechanics Proficiency</h4>
            <div class="space-y-4">
              ${data.mechanics.map(m => `
                <div>
                  <div class="flex justify-between text-xs font-mono mb-1">
                    <span class="text-gray-300">${m.name}</span>
                    <span class="text-pink-400 font-bold">${m.value}</span>
                  </div>
                  <div class="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full" style="width: ${m.value};"></div>
                  </div>
                  <p class="text-xs text-gray-400 mt-1">${m.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="p-4 rounded-xl bg-pink-950/20 border border-pink-500/30">
            <span class="text-xs font-mono text-pink-400 uppercase tracking-wider block mb-1">High-Stakes Highlight:</span>
            <p class="text-sm text-gray-200 italic">"${data.highlight}"</p>
          </div>
        </div>
      `;

      modalContainer.classList.remove('hidden');
      modalContainer.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Attach project card clicks
  document.querySelectorAll('[data-project-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const projId = card.getAttribute('data-project-id');
      const data = projectsData[projId];
      if (!data) return;

      modalBody.innerHTML = `
        <div class="space-y-6">
          <div class="border-b border-gray-800 pb-4">
            <div class="flex items-center gap-2 mb-2 flex-wrap">
              <span class="badge-cyan text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">${data.badge}</span>
              <span class="text-xs font-mono text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700">${data.stack}</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide">${data.title}</h2>
          </div>

          <div>
            <h4 class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span> Technical Architecture &amp; Execution
            </h4>
            <p class="text-gray-300 leading-relaxed text-sm sm:text-base">${data.overview}</p>
          </div>

          <div class="bg-gray-900/60 p-4 rounded-xl border border-gray-800">
            <h4 class="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Key Technical Features</h4>
            <ul class="space-y-2 text-sm text-gray-300">
              ${data.features.map(f => `
                <li class="flex items-start gap-2">
                  <span class="text-cyan-400 mt-1">&bull;</span>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <div>
            <h4 class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Core Code Implementation</h4>
            <pre class="bg-black/90 p-4 rounded-xl border border-cyan-500/30 overflow-x-auto text-xs font-mono text-cyan-300 leading-relaxed"><code>${escapeHtml(data.codeSnippet)}</code></pre>
          </div>
        </div>
      `;

      modalContainer.classList.remove('hidden');
      modalContainer.classList.add('flex');
      document.body.style.overflow = 'hidden';
      if (window.lucide) window.lucide.createIcons();
    });
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ---------------------------------------------------------------------
   6. EMAIL CLIPBOARD & TOAST NOTIFICATION
   --------------------------------------------------------------------- */
function initEmailClipboard() {
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const emailText = "sesettiophirearnest@gmail.com";

  let toastTimeout;

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText).then(() => {
        showToast("Tactical Uplink: sesettiophirearnest@gmail.com copied to clipboard!");
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = emailText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast("Email address copied to clipboard!");
      });
    });
  });

  function showToast(msg) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = msg;

    toast.classList.remove('translate-y-24', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3800);
  }
}

/* ---------------------------------------------------------------------
   7. INTERACTIVE CONTACT FORM
   --------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('tacticalContactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const statusMsg = document.getElementById('formStatusMsg');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const email = document.getElementById('formEmail').value.trim();
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value.trim();

    if (!name || !email || !message) {
      if (statusMsg) {
        statusMsg.textContent = "Error: Please complete all required telemetry fields.";
        statusMsg.className = "text-sm font-mono text-red-400 mt-3 block";
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-cyan-400 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg> Transmitting Signal...
      `;
    }

    // Simulate instant secure dispatch
    setTimeout(() => {
      if (statusMsg) {
        statusMsg.innerHTML = `&check; Transmission successfully routed to <strong>sesettiophirearnest@gmail.com</strong>. We will establish contact promptly.`;
        statusMsg.className = "text-sm font-mono text-cyan-400 mt-3 block p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-lg";
      }

      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Dispatch Tactical Message</span> &rarr;`;
      }
    }, 1200);
  });
}

/* ---------------------------------------------------------------------
   8. MOBILE NAVIGATION & SMOOTH SCROLLING
   --------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = mobileMenu.classList.contains('hidden');
    if (isExpanded) {
      mobileMenu.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
    }
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ---------------------------------------------------------------------
   9. NAVBAR SCROLL EFFECT
   --------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('bg-black/85', 'backdrop-blur-xl', 'border-b', 'border-white/10', 'py-3');
      navbar.classList.remove('bg-transparent', 'py-5');
    } else {
      navbar.classList.remove('bg-black/85', 'border-b', 'border-white/10', 'py-3');
      navbar.classList.add('bg-transparent', 'py-5');
    }
  });
}
