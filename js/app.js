
import { semesters } from './semesters.js';

// DOM refs
const wrapper = document.getElementById('malla-wrapper');
const semContainer = document.getElementById('semesters');
const canvas = document.getElementById('linesCanvas');
const progressEl = document.getElementById('progress');
const ctx = canvas.getContext('2d');

const TOTAL_CREDITS = semesters.flatMap(s => s.courses).reduce((a,c)=>a+c.credits,0);
let approved = JSON.parse(localStorage.getItem('mallaApproved')||'[]');
const courseElems = {};

const isUnlocked = c => c.prereq.every(p => approved.includes(p));

function save() {
  localStorage.setItem('mallaApproved', JSON.stringify(approved));
}

function toggle(code){
  approved = approved.includes(code)?approved.filter(c=>c!==code):[...approved,code];
  save();
  render();
}

function render(){
  semContainer.innerHTML='';
  semesters.forEach(sem=>{
    const sec=document.createElement('section');
    sec.innerHTML=`<h2 class="text-xl font-semibold mb-3">${sem.name}</h2>`;
    const list=document.createElement('div');
    list.className='space-y-3';
    sem.courses.forEach(course=>{
      const unlocked=isUnlocked(course);
      const done=approved.includes(course.code);
      const btn=document.createElement('button');
      btn.dataset.code=course.code;
      btn.className=`relative p-3 rounded-lg border text-left transition flex flex-col
        ${done?'bg-green-500/80 text-white':
        unlocked?'bg-white hover:bg-sky-100 dark:bg-gray-800 dark:hover:bg-gray-700':
        'bg-gray-300 text-gray-600 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'}`;
      btn.disabled=!unlocked&&!done;
      btn.innerHTML=`<span class="font-medium">${course.code}</span>
        <span class="text-sm">${course.name}</span>
        <span class="text-xs mt-1">${course.credits} cr.</span>`;
      btn.addEventListener('click',()=>toggle(course.code));
      list.appendChild(btn);
      courseElems[course.code]=btn;
    });
    sec.appendChild(list);
    semContainer.appendChild(sec);
  });

  const earned=semesters.flatMap(s=>s.courses).filter(c=>approved.includes(c.code))
                .reduce((a,c)=>a+c.credits,0);
  const pct=Math.round(earned/TOTAL_CREDITS*100);
  progressEl.innerHTML=`Créditos aprobados: <span class="text-green-500">${earned}</span> / ${TOTAL_CREDITS} (${pct}% completado)`;

  requestAnimationFrame(drawLines);
}

function drawLines(){
  const rect = wrapper.getBoundingClientRect();
  canvas.width=rect.width;
  canvas.height=rect.height;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.lineWidth=2;
  ctx.strokeStyle='#94a3b8';
  semesters.forEach(sem=>{
    sem.courses.forEach(course=>{
      const src=courseElems[course.code];
      if(!src) return;
      const sr=src.getBoundingClientRect();
      const sx=sr.left+sr.width/2-rect.left;
      const sy=sr.bottom-rect.top;
      semesters.forEach(s2=>{
        s2.courses.forEach(c2=>{
          if(c2.prereq.includes(course.code)){
            const tgt=courseElems[c2.code];
            if(!tgt) return;
            const tr=tgt.getBoundingClientRect();
            const tx=tr.left+tr.width/2-rect.left;
            const ty=tr.top-rect.top;
            ctx.beginPath();
            ctx.moveTo(sx,sy);
            ctx.lineTo(tx,ty);
            ctx.stroke();
          }
        })
      })
    })
  })
}

window.addEventListener('resize', ()=>requestAnimationFrame(drawLines));

render();
