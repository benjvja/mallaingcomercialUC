// Actualización minimalista sin líneas
const Ramos = Array.from(document.querySelectorAll('.ramo'));
const ProgressFill = document.getElementById('progress-fill');
const TOTAL = Ramos.reduce((sum, r) => sum + (+r.querySelector('.creditos')?.textContent || 0), 0);

let estado = JSON.parse(localStorage.getItem('estadoUC')||'{}');

function puede(r) {
  const pre = (r.dataset.prereq||'').split(',').filter(x=>x);
  return pre.every(id => estado[id]);
}
function guardar() {
  localStorage.setItem('estadoUC', JSON.stringify(estado));
}
function actualizar() {
  let suma = 0;
  Ramos.forEach(r => {
    const id = r.dataset.id;
    const done = !!estado[id];
    if (done) {
      r.classList.add('approved');
      suma += +r.querySelector('.creditos')?.textContent || 0;
    } else {
      r.classList.remove('approved');
    }
    if (!done && !puede(r)) {
      r.classList.add('locked');
    } else {
      r.classList.remove('locked');
    }
  });
  const pct = Math.round(suma / TOTAL * 100);
  ProgressFill.style.width = pct + '%';
}

Ramos.forEach(r => {
  r.addEventListener('click', () => {
    if (r.classList.contains('locked')) return;
    estado[r.dataset.id] = !estado[r.dataset.id];
    guardar();
    actualizar();
  });
});

actualizar();
