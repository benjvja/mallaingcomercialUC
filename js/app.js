import { semesters } from './semesters.js';

const wrapper = document.getElementById('malla-wrapper');
const semContainer = document.getElementById('semesters');
const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');
const progressFill = document.getElementById('progress-fill');

const TOTAL = semesters.flatMap(s => s.courses).reduce((a,c) => a + c.credits, 0);
let approved = JSON.parse(localStorage.getItem('mallaApproved')||'[]');

const CAT_MAP = {
  'MAT':'math','EST':'math','IIC':'math',
  'EAE':'econ','EAZ':'econ',
  'EAF':'fin','EAA':'adm',
  'FGN':'fg','THE':'fg','DEP':'fg','FIL':'fg','VRA':'fg'
};

function getCat(code){
  const p = code.slice(0,3).toUpperCase();
  return 'pc' in CAT_MAP? 'pc' : (CAT_MAP[p] || 'pc');
}

function save(){ localStorage.setItem('mallaApproved', JSON.stringify(approved)); }

function toggle(code){
  approved = approved.includes(code) ? approved.filter(c=>c!==code) : [...approved,code];
  save(); render();
}

function render(){
  semContainer.innerHTML = '';
  semesters.forEach((sem,i) => {
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>Sem ${i+1}</h2>`;
    semContainer.appendChild(sec);
    sem.courses.forEach(c => {
      const unlocked = c.prereq.every(r=>approved.includes(r));
      const done = approved.includes(c.code);
      const btn = document.createElement('button');
      btn.classList.add('subject', `cat-${CAT_MAP[c.code.slice(0,3)]||'pc'}`);
      if(!unlocked && !done) btn.classList.add('locked');
      if(done) btn.classList.add('done');
      btn.setAttribute('data-prereqs', c.prereq.length);
      btn.innerHTML = `<strong>${c.code}</strong><br><small>${c.name}</small><br><small>${c.credits} cr.</small>`;
      if(unlocked||done) btn.onclick = ()=>toggle(c.code);
      sec.appendChild(btn);
    });
  });
  // progress
  const earned = semesters.flatMap(s=>s.courses)
    .filter(c=>approved.includes(c.code))
    .reduce((a,c)=>a+c.credits,0);
  const pct = Math.round(earned/TOTAL*100);
  progressFill.style.width = pct+'%';

  drawLines();
}

function drawLines(){
  const rect = wrapper.getBoundingClientRect();
  canvas.width = rect.width; canvas.height = rect.height;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = '#64748b7f'; ctx.fillStyle = '#64748b7f'; ctx.lineWidth=2;
  semesters.forEach((sem) => {
    sem.courses.forEach(c => {
      const el = document.querySelector(`[data-code="${c.code}"]`);
    });
  });
  // simplified: arrow drawing omitted for brevity
}

window.addEventListener('resize', () => render());
render();
