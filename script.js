const subjects = {
  math: { number:'01', name:'Math', title:'Math helps us<br><em>find the way.</em>', desc:'Before a rocket can leave Earth, someone has to calculate the perfect path. Angles, distance, speed, and time all work together to find an orbit.', learn:'Use a launch angle to reach orbit.' },
  science: { number:'02', name:'Science', title:'Science helps us<br><em>read the clues.</em>', desc:'Every planet leaves evidence behind. Scientists use rocks, light, temperature, and gravity to work out what a world is made of—and whether it could support life.', learn:'Use clues to identify a planet.' },
  language: { number:'03', name:'Language arts', title:'Words help us<br><em>share the mission.</em>', desc:'A mission needs storytellers. Clear writing helps a team solve problems, make decisions, and tell people on Earth what they discovered out there.', learn:'Write a message for mission control.' },
  art: { number:'04', name:'Art + design', title:'Art helps us<br><em>see what’s next.</em>', desc:'Before anything is built, someone imagines it. Designers turn big “what if?” questions into sketches, shapes, colors, and tools people can actually use.', learn:'Sketch a spacecraft for the future.' },
  engineering: { number:'05', name:'Engineering', title:'Engineering helps us<br><em>make it real.</em>', desc:'Engineers turn an idea into a machine that can survive launch, travel far, and do its job. They test, learn, adjust, and try again.', learn:'Balance the parts of a mission.' }
};
const app = document.querySelector('#app');
const visitStorageKey = 'spaceIsForEveryone.visitedSubjects';
const nameStorageKey = 'spaceIsForEveryone.explorerName';
let visitedSubjects = new Set();
let activeSubjectKey = null;
try { visitedSubjects = new Set(JSON.parse(localStorage.getItem(visitStorageKey) || '[]').filter(key => subjects[key])); } catch (error) { visitedSubjects = new Set(); }
function saveVisits(){ try { localStorage.setItem(visitStorageKey, JSON.stringify([...visitedSubjects])); } catch (error) {} }
function markVisited(key){ if(!subjects[key]) return; visitedSubjects.add(key); saveVisits(); updateMissionProgress(); }
function updateMissionProgress(){
  const count = visitedSubjects.size;
  const complete = count === Object.keys(subjects).length;
  const remaining = Object.values(subjects).filter(subject => !visitedSubjects.has(Object.keys(subjects).find(key => subjects[key] === subject))).map(subject => subject.name);
  const countEl = document.querySelector('#visited-count');
  const fillEl = document.querySelector('#progress-fill');
  const statusEl = document.querySelector('#mission-status');
  const remainingEl = document.querySelector('#remaining-subjects');
  const certificateButton = document.querySelector('#certificate-button');
  if(countEl) countEl.textContent = count;
  if(fillEl) fillEl.style.width = `${count / Object.keys(subjects).length * 100}%`;
  if(statusEl) statusEl.textContent = complete ? 'Mission complete. Your certificate is ready!' : count ? `${remaining.length} ${remaining.length === 1 ? 'world remains' : 'worlds remain'}: ${remaining.join(' · ')}` : 'Your first planet is waiting.';
  if(remainingEl) remainingEl.textContent = complete ? 'All five subject worlds visited. Nice exploring!' : `${remaining.length} ${remaining.length === 1 ? 'subject world remains' : 'subject worlds remain'} to complete your tour.`;
  if(certificateButton){ certificateButton.disabled = !complete; certificateButton.innerHTML = complete ? 'Open certificate <span>✦</span>' : 'Certificate locked <span>▣</span>'; }
  document.querySelectorAll('.map-planet,.subject-card').forEach(element=>{ const isVisited = visitedSubjects.has(element.dataset.subject); element.classList.toggle('visited',isVisited); const state = element.querySelector('.card-status'); if(state) state.textContent = isVisited ? 'Visited ✓' : 'Not visited'; });
}
function openCertificate(){
  if(visitedSubjects.size !== Object.keys(subjects).length) return;
  const modal = document.querySelector('#certificate-modal');
  modal.hidden = false; document.body.classList.add('modal-open');
  const nameInput = document.querySelector('#explorer-name');
  try { nameInput.value = localStorage.getItem(nameStorageKey) || ''; } catch (error) {}
  document.querySelector('#certificate-name').textContent = nameInput.value.trim() || 'Space Explorer';
  nameInput.focus();
}
function closeCertificate(){ document.querySelector('#certificate-modal').hidden = true; document.body.classList.remove('modal-open'); }
function celebrateCompletion(){ const layer=document.createElement('div'); layer.className='celebration-layer'; for(let i=0;i<34;i++){const piece=document.createElement('i');piece.style.setProperty('--x',`${Math.random()*100}vw`);piece.style.setProperty('--delay',`${Math.random()*.35}s`);piece.style.setProperty('--hue',`${Math.floor(Math.random()*360)}deg`);layer.append(piece);}document.body.append(layer);setTimeout(()=>layer.remove(),2200); }
function updateCompletionControl(){
  const button = document.querySelector('#complete-mission');
  const message = document.querySelector('#completion-message');
  if(!button || !activeSubjectKey) return;
  const completed = visitedSubjects.has(activeSubjectKey);
  button.innerHTML = completed ? 'Choose another planet <span>→</span>' : 'Finish mission &amp; choose another planet <span>→</span>';
  message.textContent = completed ? `${subjects[activeSubjectKey].name} is already marked visited.` : 'Finish the activity to mark this planet visited.';
}
function goTo(hash){
  const id = hash.replace('#','');
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active-page',p.id===id));
  document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===hash));
  window.scrollTo({top:0,behavior:'smooth'});
  document.querySelector('.main-nav').classList.remove('open');
}
function loadSubject(key){
  const s=subjects[key];
  activeSubjectKey = key;
  document.querySelector('#detail-eyebrow').innerHTML=`<span class="eyebrow-dot"></span> Mission ${s.number} / ${s.name}`;
  document.querySelector('#detail-title').innerHTML=s.title;
  document.querySelector('#detail-description').textContent=s.desc;
  document.querySelector('#detail-learn').textContent=s.learn;
  document.querySelector('#activity-panel').innerHTML=activityMarkup(key,s);
  goTo('#detail'); setupActivity(key); updateCompletionControl();
}
function activityMarkup(key,s){
  if(key==='science') return `<div class="activity-header"><span>FIELD NOTES / 02</span><span>PLANET DETECTIVE</span></div><h3>Which planet is hiding here?</h3><p class="activity-note">Read the clues, then tap the planet you think our probe found.</p><div class="planet-lab" id="planet-lab"><div class="planet-lab-stars">✦ &nbsp; · &nbsp; ✧</div><div class="planet-lab-world"><i></i><b></b></div><div class="planet-lab-scan"></div><span id="science-signal">SCAN READY</span></div><div class="planet-row"><button class="planet-choice" data-answer="wrong"><div class="planet-dot"></div>KEPLER</button><button class="planet-choice" data-answer="correct"><div class="planet-dot"></div>MARS</button><button class="planet-choice" data-answer="wrong"><div class="planet-dot"></div>VENUS</button><button class="planet-choice" data-answer="wrong"><div class="planet-dot"></div>NEPTUNE</button></div><p class="activity-result" id="activity-result">CLUE 01: It has rusty red rocks and two tiny moons.</p>`;
  if(key==='language') return `<div class="activity-header"><span>MISSION LOG / 03</span><span>TRANSMISSION DRAFT</span></div><h3>Say it like mission control.</h3><p class="activity-note">Write one sentence that tells the crew what to do next. Keep it clear and calm.</p><div class="transmission-visual" id="transmission-visual"><div class="signal-bars"><i></i><i></i><i></i><i></i><i></i></div><span>WAITING FOR YOUR WORDS</span><div class="signal-dot"></div></div><textarea id="mission-text" maxlength="120" placeholder="Crew, your next step is…"></textarea><div class="word-count"><span>YOUR TRANSMISSION</span><span id="count">0 / 120</span></div><button class="small-button send-button" id="send-transmission" disabled>Send transmission <span>↗</span></button><p class="activity-result" id="activity-result">A great mission message gives a team one clear next step.</p>`;
  if(key==='art') return `<div class="activity-header"><span>DESIGN LAB / 04</span><span>YOUR TURN</span></div><h3>Design the next spacecraft.</h3><p class="activity-note">Use your cursor or finger to draw a machine that could explore somewhere new.</p><div class="art-toolbar"><span>INK COLOR</span><button class="color-choice active" data-color="#ff6b4a" style="--swatch:#ff6b4a"></button><button class="color-choice" data-color="#4d9ca2" style="--swatch:#4d9ca2"></button><button class="color-choice" data-color="#8f75bd" style="--swatch:#8f75bd"></button><button class="clear-drawing" id="clear-drawing">Clear canvas</button></div><div class="draw-canvas" id="draw-canvas"></div><p class="activity-result">Every bold design starts as a line. What does yours do?</p>`;
  if(key==='engineering') return `<div class="activity-header"><span>BUILD LAB / 05</span><span>MISSION READY?</span></div><h3>Balance the booster.</h3><p class="activity-note">Adjust the fuel and science load. Find a combination that lifts off without tipping.</p><div class="booster-stage" id="booster-stage"><div class="booster-flame"></div><div class="booster-body"><i></i><b></b></div><div class="booster-stars">✦ &nbsp; · &nbsp; ✦</div><span>TEST STAND 05</span></div><div class="meter"><div class="meter-fill" id="meter-fill"></div></div><div class="meter-label"><span>STABILITY</span><span id="meter-label">50%</span></div><div class="activity-controls"><input id="fuel" type="range" min="0" max="100" value="50"><button class="small-button" id="boost">Test launch</button></div><p class="activity-result" id="activity-result">A balanced build is ready for a test.</p>`;
  return `<div class="activity-header"><span>ORBIT LAB / 01</span><span>YOUR TURN</span></div><h3>Find the launch angle.</h3><p class="activity-note">A rocket needs the right angle to find its orbit. Try a number between 1° and 90°.</p><div class="orbit-stage" id="orbit-stage"><span class="stage-star one">✦</span><span class="stage-star two">·</span><div class="stage-planet"><i></i></div><div class="stage-orbit"></div><div class="stage-rocket">▲</div><span class="stage-caption">LIVE TRAJECTORY</span></div><div class="meter"><div class="meter-fill" id="meter-fill"></div></div><div class="meter-label"><span>ORBIT PATH</span><span id="meter-label">50°</span></div><div class="activity-controls"><input id="angle" type="number" min="1" max="90" value="50"><button class="small-button" id="check-angle">Plot path</button></div><p class="activity-result" id="activity-result">Hint: 42° is the sweet spot for this mission.</p>`;
}
function setupActivity(key){
  if(key==='science') document.querySelectorAll('.planet-choice').forEach(b=>b.addEventListener('click',()=>{const result=document.querySelector('#activity-result'),lab=document.querySelector('#planet-lab'),signal=document.querySelector('#science-signal');document.querySelectorAll('.planet-choice').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const correct=b.dataset.answer==='correct';lab.classList.toggle('scan-success',correct);signal.textContent=correct?'SIGNAL MATCH: MARS':'SIGNAL MISMATCH';result.textContent=correct?'TRANSMISSION RECEIVED: Correct! Mars is the red planet.':'Not quite—read the clue about rusty rocks again.'}));
  if(key==='language'){const t=document.querySelector('#mission-text'),send=document.querySelector('#send-transmission'),visual=document.querySelector('#transmission-visual');t.addEventListener('input',()=>{const length=t.value.length;document.querySelector('#count').textContent=`${length} / 120`;send.disabled=length<8;visual.style.setProperty('--signal',Math.min(5,Math.ceil(length/18)));});send.addEventListener('click',()=>{visual.classList.add('transmission-sent');document.querySelector('#activity-result').textContent='TRANSMISSION SENT! Clear words help the whole crew move forward.';send.textContent='Transmission sent ✓';});}
  if(key==='art'){const c=document.querySelector('#draw-canvas');let down=false,inkColor='#ff6b4a',ctx=c.getContext?.('2d');if(!ctx){const canvas=document.createElement('canvas');canvas.width=c.offsetWidth;canvas.height=c.offsetHeight;canvas.style='width:100%;height:100%';c.append(canvas);ctx=canvas.getContext('2d');}document.querySelectorAll('.color-choice').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.color-choice').forEach(x=>x.classList.remove('active'));button.classList.add('active');inkColor=button.dataset.color;}));document.querySelector('#clear-drawing').addEventListener('click',()=>{ctx.clearRect(0,0,c.offsetWidth,c.offsetHeight);c.classList.remove('has-drawing');});c.addEventListener('pointerdown',e=>{down=true;c.classList.add('has-drawing');ctx.beginPath();ctx.moveTo(e.offsetX,e.offsetY)});c.addEventListener('pointerup',()=>down=false);c.addEventListener('pointerleave',()=>down=false);c.addEventListener('pointermove',e=>{if(down){ctx.lineTo(e.offsetX,e.offsetY);ctx.strokeStyle=inkColor;ctx.lineWidth=3;ctx.lineCap='round';ctx.stroke()}});}
  if(key==='engineering'){const range=document.querySelector('#fuel'),fill=document.querySelector('#meter-fill'),label=document.querySelector('#meter-label'),stage=document.querySelector('#booster-stage');const update=()=>{fill.style.width=range.value+'%';label.textContent=range.value+'%';stage.style.setProperty('--lift',Math.abs(range.value-50)/2+'px');stage.classList.toggle('unstable',Math.abs(range.value-50)>18)};range.addEventListener('input',update);update();document.querySelector('#boost').addEventListener('click',()=>{const n=+range.value,success=n>43&&n<58;stage.classList.toggle('launch-success',success);document.querySelector('#activity-result').textContent=success?'LIFTOFF! Your build is balanced and ready to explore.':'Almost! Adjust the load closer to 50% stability.'});}
  if(key==='math'){const input=document.querySelector('#angle'),fill=document.querySelector('#meter-fill'),label=document.querySelector('#meter-label'),stage=document.querySelector('#orbit-stage');const update=()=>{const value=Math.max(1,Math.min(90,+input.value||1));fill.style.width=(value/90*100)+'%';label.textContent=value+'°';stage.style.setProperty('--angle',value+'deg');stage.classList.toggle('near-target',Math.abs(value-42)<=3)};input.addEventListener('input',update);update();document.querySelector('#check-angle').addEventListener('click',()=>{const n=+input.value;const success=Math.abs(n-42)<=3;stage.classList.toggle('success',success);document.querySelector('#activity-result').textContent=success?'ORBIT FOUND! That angle gives our rocket a smooth path.':'The path is wobbling. Try getting closer to 42°.'});}
}
document.querySelectorAll('[data-scroll]').forEach(el=>el.addEventListener('click',()=>goTo(el.dataset.scroll)));
document.querySelectorAll('.subject-card,[data-subject]').forEach(el=>el.addEventListener('click',()=>loadSubject(el.dataset.subject)));
window.addEventListener('hashchange',()=>{const hash=location.hash||'#home'; if(hash==='#detail')return; goTo(hash)});
document.querySelector('.menu-toggle').addEventListener('click',e=>{const nav=document.querySelector('.main-nav');nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',nav.classList.contains('open'))});
const prompts=['Ask your students: “If you could send one thing into space to help people on Earth, what would it be—and how would it work?”','Ask your students: “What would a robot need to know before it explored a brand-new planet?”','Ask your students: “How could a story help a team stay brave during a long mission?”']; let promptIndex=0;document.querySelector('#new-prompt').addEventListener('click',()=>{promptIndex=(promptIndex+1)%prompts.length;document.querySelector('.prompt-card p').textContent=prompts[promptIndex]});
document.querySelector('#certificate-button').addEventListener('click',openCertificate);
document.querySelectorAll('[data-close-certificate]').forEach(element=>element.addEventListener('click',closeCertificate));
document.querySelector('#explorer-name').addEventListener('input',event=>{const name=event.target.value.trim()||'Space Explorer';document.querySelector('#certificate-name').textContent=name;try{localStorage.setItem(nameStorageKey,event.target.value)}catch(error){}});
document.querySelector('#print-certificate').addEventListener('click',()=>window.print());
document.querySelector('#reset-progress').addEventListener('click',()=>{visitedSubjects.clear();saveVisits();updateMissionProgress();});
document.querySelector('#complete-mission').addEventListener('click',()=>{if(!activeSubjectKey)return;const wasComplete=visitedSubjects.size===Object.keys(subjects).length;markVisited(activeSubjectKey);if(!wasComplete&&visitedSubjects.size===Object.keys(subjects).length)celebrateCompletion();goTo('#subjects');document.querySelector('#subject-map').scrollIntoView({behavior:'smooth',block:'start'});});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.querySelector('#certificate-modal').hidden)closeCertificate();});
updateMissionProgress();
