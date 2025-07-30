
# Malla Interactiva – Ingeniería Comercial UC

Planner 100 % estático para visualizar los ramos, prerrequisitos y avance de la carrera.  
Funciona out‑of‑the‑box en GitHub Pages, Cloudflare Pages, Netlify, Vercel, etc.

## 🗂 Estructura
```
malla-github/
│
├─ index.html          # Entrada del sitio
├─ js/
│   ├─ semesters.js    # Data de la malla (export const semesters = [...])
│   └─ app.js          # Lógica de renderizado + líneas
└─ data/               # (opcional) JSON extra si quisieras separar data
```

## 🚀 Deploy rápido en GitHub Pages
1. `git clone https://github.com/tu-usuario/malla-interactiva.git`
2. Copia todo el contenido de esta carpeta dentro del repo.
3. `git add . && git commit -m "first commit" && git push`
4. En *Settings → Pages* selecciona **Branch: `main`, Folder: `/`**.
5. Abre `https://tu-usuario.github.io/malla-interactiva/` y listo.

## 🤘 Customización
* Edita **`js/semesters.js`** para agregar/eliminar ramos o cambiar créditos/prerrequisitos.
* Estilos → Tailwind CDN en `index.html`. Cambia clases o añade las tuyas.

¡A craquearla! 😎
