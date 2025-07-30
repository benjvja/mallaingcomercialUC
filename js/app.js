import { semesters } from './semesters.js';

const wrapper = document.getElementById('malla-wrapper');
const semContainer = document.getElementById('semesters');
const canvas = document.getElementById('linesCanvas');
const ctx = canvas.getContext('2d');
const progressFill = document.getElementById('progress-fill');

const TOTAL = semesters.flatMap(s => s.courses).reduce((a,c) => a + c.credits, 0);
let approved = JSON.parse(localStorage.getItem('mallaApproved')||'[]');
const CAT_MAP = {'MAT':'math','EST':'math','IIC':'math','EAE':'econ','EAZ':'econ','EAF':'fin','EAA':'adm','FGN':'fg','THE':'fg','DEP':'fg','FIL':'fg','VRA':'fg'};

function getCat(code){
  const p = code.slice(0,3).toUpperCase();
  return CAT_MAP[p] || 'pc';
}
function save(){ localStorage.setItem('mallaApproved', JSON.stringify(approved)); }
function toggle(code){ approved.includes(code) ? approved = approved.filter(c=>c!==code) : approved.push(code); save(); render(); }

function render(){
  semContainer.innerHTML = '';
  semesters.forEach((sem,i)=>{
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>Sem ${i+1}</h2>`;
    semContainer.appendChild(sec);
    sem.courses.forEach(c=>{
      const unlocked = c.prereq.every(r=>approved.includes(r));
      const done = approved.includes(c.code);
      const btn = document.createElement('button');
      btn.setAttribute('data-code', c.code);
      btn.setAttribute('data-prereqs', c.prereq.length);
      btn.classList.add('subject', `cat-${getCat(c.code)}`);
      if(!unlocked && !done) btn.classList.add('locked');
      if(done) btn.classList.add('done');
      btn.innerHTML = `<strong>${c.code}</strong><br><small>${c.name}</small><br><small>${c.credits} cr.</small>`;
      if(unlocked||done) btn.onclick = ()=>toggle(c.code);
      sec.appendChild(btn);
    });
  });
  const earned = semesters.flatMap(s=>s.courses).filter(c=>approved.includes(c.code)).reduce((a,c)=>a+c.credits,0);
  const pct = Math.round((earned/TOTAL)*100);
  progressFill.style.width = pct + '%';
  drawLines();
}

function drawLines(){
  const rect = wrapper.getBoundingClientRect();
  canvas.width = rect.width; canvas.height = rect.height;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = '#64748b7f'; ctx.fillStyle = '#64748b7f'; ctx.lineWidth=2;
  semesters.forEach((sem,si)=>{
    sem.courses.forEach(c=>{
      const src = document.querySelector(`[data-code="${c.code}"]`);
      if(!src) return;
      const sr = src.getBoundingClientRect();
      const x1 = sr.left + sr.width/2 - rect.left, y1 = sr.bottom - rect.top;
      semesters.forEach((sem2,sj)=>{
        sem2.courses.forEach(c2=>{
          if(c2.prereq.includes(c.code)){
            const tgt = document.querySelector(`[data-code="${c2.code}"]`);
            if(!tgt) return;
            const tr = tgt.getBoundingClientRect();
            const x2 = tr.left + tr.width/2 - rect.left, y2 = tr.top - rect.top;
            // draw arrow
            ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
            const ang = Math.atan2(y2-y1,x2-x1), h=6;
            ctx.beginPath();
            ctx.moveTo(x2,y2);
            ctx.lineTo(x2-h*Math.cos(ang-Math.PI/6), y2-h*Math.sin(ang-Math.PI/6));
            ctx.lineTo(x2-h*Math.cos(ang+Math.PI/6), y2-h*Math.sin(ang+Math.PI/6));
            ctx.closePath();
            ctx.fill();
          }
        });
      });
    });
  });
}

window.addEventListener('resize', render);
render();
