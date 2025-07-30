
import { semesters } from './semesters.js';

const wrapper=document.getElementById('malla-wrapper');
const semContainer=document.getElementById('semesters');
const canvas=document.getElementById('linesCanvas');
const progressEl=document.getElementById('progress');
const ctx=canvas.getContext('2d');

const TOTAL_CREDITS=semesters.flatMap(s=>s.courses).reduce((a,c)=>a+c.credits,0);
let approved=JSON.parse(localStorage.getItem('mallaApproved')||'[]');
const elems={};

const CAT_MAP={
  'MAT':'math','EST':'math','IIC':'math',
  'EAE':'econ','EAZ':'econ',
  'EAF':'fin',
  'EAA':'adm',
  'FGN':'fg','THE':'fg','DEP':'fg','PLB':'fg','PL201':'fg',
};
function getCat(code,explicit){
  if(explicit) return explicit.toLowerCase();
  const prefix=code.slice(0,3).toUpperCase();
  return CAT_MAP[prefix]||'pc';
}
const isUnlocked=c=>c.prereq.every(p=>approved.includes(p));
function save(){localStorage.setItem('mallaApproved',JSON.stringify(approved));}

function toggle(code){
  approved=approved.includes(code)?approved.filter(c=>c!==code):[...approved,code];
  save();render();
}

function render(){
  semContainer.innerHTML='';
  semesters.forEach((sem,si)=>{
    const sec=document.createElement('section');
    sec.innerHTML=`<h2 class="text-xl font-semibold mb-4">Semestre ${si+1}</h2>`;
    const list=document.createElement('div');
    list.className='space-y-4';
    sem.courses.forEach(course=>{
      const unlocked=isUnlocked(course);
      const done=approved.includes(course.code);
      const btn=document.createElement('button');
      const cat=getCat(course.code,course.cat);
      btn.className=`subject ${unlocked?'':'locked'} cat-${cat} ${done?'done':''}`;
      btn.innerHTML=`
        <span class="font-medium">${course.code}</span><br>
        <span class="text-xs">${course.name}</span><br>
        <span class="text-[10px]">${course.credits} cr.</span>`;
      if(unlocked||done) btn.addEventListener('click',()=>toggle(course.code));
      list.appendChild(btn);
      elems[course.code]=btn;
    });
    sec.appendChild(list);
    semContainer.appendChild(sec);
  });

  const earned=semesters.flatMap(s=>s.courses).filter(c=>approved.includes(c.code)).reduce((a,c)=>a+c.credits,0);
  const pct=Math.round(earned/TOTAL_CREDITS*100);
  progressEl.innerHTML=`Créditos aprobados: <span class="text-green-400">${earned}</span> / ${TOTAL_CREDITS} (${pct}% completado)`;

  requestAnimationFrame(drawLines);
}

function drawArrow(x1,y1,x2,y2){
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();

  // arrow head
  const angle=Math.atan2(y2-y1,x2-x1);
  const head=6;
  ctx.beginPath();
  ctx.moveTo(x2,y2);
  ctx.lineTo(x2-head*Math.cos(angle-Math.PI/6), y2-head*Math.sin(angle-Math.PI/6));
  ctx.lineTo(x2-head*Math.cos(angle+Math.PI/6), y2-head*Math.sin(angle+Math.PI/6));
  ctx.closePath();
  ctx.fill();
}

function drawLines(){
  const rect=wrapper.getBoundingClientRect();
  canvas.width=rect.width;
  canvas.height=rect.height;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.lineWidth=2;
  ctx.strokeStyle='#64748b8f';
  ctx.fillStyle='#64748b8f';

  semesters.forEach(sem=>{
    sem.courses.forEach(course=>{
      const src=elems[course.code];if(!src)return;
      const sr=src.getBoundingClientRect();
      const x1=sr.left+sr.width/2-rect.left;
      const y1=sr.bottom-rect.top;
      semesters.forEach(s2=>{
        s2.courses.forEach(c2=>{
          if(c2.prereq.includes(course.code)){
            const tgt=elems[c2.code];if(!tgt)return;
            const tr=tgt.getBoundingClientRect();
            const x2=tr.left+tr.width/2-rect.left;
            const y2=tr.top-rect.top;
            drawArrow(x1,y1,x2,y2);
          }
        });
      });
    });
  });
}

window.addEventListener('resize',()=>requestAnimationFrame(drawLines));

render();
