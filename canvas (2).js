// Cambie las variables scale para aumentar o reducir las dimensiones de la malla
// Se recomienda fuertemente valores NO MENORES a 0.5 ademas de no modificar mucho scaleY
var scaleX, scaleY, canvas, tipoRamo;

// variables de mensaje
var welcomeTitle, welcomeDesc;

// verificamos que malla busca
// Cambiar malla por defecto desde 'INF' (Informática) a 'ICOMA' (Comercial Administración)
// para que la página cargue una malla válida si no se especifica ningún parámetro.
var current_malla = 'ICOMA';
if (window.location.search) {
	var params = new URLSearchParams(window.location.search);
	if (params.has('m'))
		current_malla = params.get('m');
	
}
if (d3.select(".canvas")._groups[0][0]) {
	
	scaleX = 1;
	scaleY = 1;
	canvas = d3.select(".canvas");
	tipoRamo = Ramo;
	welcomeTitle = `¡Bienvenido a la Malla Interactiva de `
	welcomeDesc = `Puedes tachar tus ramos aprobados haciendo click sobre ellos.
	A medida que vas aprobando ramos, se van liberando los que tienen prerrequisitos.
	Haz click en cualquier lado para comenzar.`

}	else if (d3.select(".priori-canvas")._groups[0][0]) {
	
	scaleX = 0.67;
	scaleY = 1;
	canvas = d3.select(".priori-canvas");
	tipoRamo = SelectableRamo;
	welcomeTitle = `¡Bienvenido a la calculadora de prioridad `
	welcomeDesc = `¡Selecciona los ramos por semestre e ingresa tus notas para
	 calcular tu prioridad! A medida que avances de semestre, los ramos aprobados se
	 tacharán automaticamente. Si has cursado un ramo que no esta en la malla,
	 crealo en la tabla de abajo.`;

} else if (d3.select(".custom-canvas")._groups[0][0]) {
	scaleX = 0.67;
	scaleY = 1;
	canvas = d3.select(".custom-canvas");
	tipoRamo = SelectableRamo;
	welcomeTitle = `¡Bienvenido a la generadora de mallas!`
	welcomeDesc = `¡Selecciona los ramos por semestre y genera una malla a tu gusto!
	Si quieres un ramo que no esta en la malla,crealo en la tabla de abajo.`;
}

var height = 730 * scaleX,
	width =1570 * scaleY;

canvas = canvas.append("svg")
		.attr('width', width)
		.attr('height', height);

var carreras = {
	'ARQ': 'Arquitectura',
	'INF': 'Informática',
    'ICI': 'Industrial',
	'ELO': 'Electrónica',
	'TEL': 'Telemática',
	'ICOM': 'Comercial',
	'CIV': 'Civil',
	'MAT': 'Matemática',
	'FIS': 'Licenciatura en Física',
	'MEC': 'Mecánica',
	'ICQ': 'Química',
	'ELI': 'Eléctrica',
    'CONSTRU': 'Construcción',
	'IDP': 'Diseño de Productos',
    'MET': 'Metalúrgica',
    'ICA': 'Ambiental'
    ,
    // Agregamos entradas específicas para las mallas de Comercial Administración y Economía
    'ICOMA': 'Comercial Administración',
    'ICOME': 'Comercial Economía'
}

/*
 * Debido a que el sitio se carga a través del protocolo file://, las
 * peticiones XHR de d3.json para cargar archivos locales pueden fallar por
 * restricciones de seguridad del navegador. Para evitar este problema y
 * asegurar que la malla se despliegue correctamente sin necesidad de
 * acceder a archivos externos, definimos aquí los datos de las mallas y
 * sus colores directamente como constantes en el script.
 */

const datasets = {
  'ICOMA': {
    "s1": [
      ["Cálculo I", "MAT1610", 10, "MAT"],
      ["Introducción a la Microeconomía", "EAE1110", 10, "ECON"],
      ["Comportamiento Organizacional", "EAA1110", 10, "ADMIN"],
      ["Contabilidad", "EAA1210", 10, "ADMIN"],
      ["English Placement Test Alte 2", "VRA2010", 0, "FORM"],
      ["Comunicación Escrita", "VRA100C", 0, "FORM"]
    ],
    "s2": [
      ["Cálculo II", "MAT1620", 10, "MAT", ["MAT1610"]],
      ["Introducción a la Macroeconomía", "EAE1210", 10, "ECON", ["EAE1110"]],
      ["Probabilidad y Estadística", "EAA1510", 10, "ADMIN", ["MAT1610","MAT1620"]],
      ["Introducción al Álgebra Lineal", "MAT1279", 10, "MAT"],
      ["Filosofía: ¿Para qué?", "FIL2001", 10, "FORM"],
      ["English Test Sufficiency Alte 3", "VRA3010", 0, "FORM"]
    ],
    "s3": [
      ["Apli. Mat. Para Economía y Negocios", "EAF2010", 10, "PRACT", ["MAT1620","MAT1279"]],
      ["Análisis Económico: La Exp. Chilena", "EAE1220", 10, "ECON", ["EAE1210"]],
      ["Inferencia Estadística", "EAA1520", 10, "ADMIN", ["EAA1510"]],
      ["Fundamentos de Finanzas", "EAA1220", 10, "ADMIN", ["EAA1510","EAA1210"]],
      ["Teológico", "TTF1", 10, "FORM"]
    ],
    "s4": [
      ["Econometría", "EAE2510", 10, "ECON", ["EAA1520","MAT1279"]],
      ["Microeconomía I", "EAE2110", 10, "ECON", ["EAF2010","EAE1220"]],
      ["Estrategia de la Organización", "EAA2410", 10, "ADMIN", ["EAA1220","EAE1110"]],
      ["Fundamentos de Marketing", "EAA2310", 10, "ADMIN", ["EAA1510","EAA1210","EAA1110"]],
      ["Formación General", "FG1", 10, "FORM"]
    ],
    "s5": [
      ["Introducción a la Programación", "IIC1103", 10, "PROG"],
      ["Microeconomía II", "EAE2120", 10, "ECON", ["EAE2110"]],
      ["Macroeconomía I", "EAE2210", 10, "ECON", ["EAE1220","EAA1520"]],
      ["Teoría Financiera", "EAA2210", 10, "ADMIN", ["EAA2410","EAA1520"]],
      ["Formación General", "FG2", 10, "FORM"]
    ],
    "s6": [
      ["Opt. de Profundización/Minor", "OPM1", 10, "OPM"],
      ["Estrategia Competitiva", "EAA2420", 10, "ADMIN", ["EAA2410","EAE2120"]],
      ["Competencia y Mercado", "EAE2130", 10, "ECON", ["EAE2120"]],
      ["Contabilidad de Costos", "EAA2220", 5, "ADMIN", ["EAA2410"]],
      ["Marketing Analytics", "EAA2320", 10, "ADMIN", ["EAE2510","EAA2310"]],
      ["Ética, Economía y Empresa", "ETI209", 10, "MAT", ["EAA2410","EAE1220"]],
      ["Formación General", "FG4", 10, "FORM"]
    ],
    "s7": [
      ["Opt. de Profundización/Minor", "OPM2", 10, "OPM"],
      ["Empresa y Legislación", "EAA2230", 5, "ADMIN"],
      ["Macroeconomía II", "EAE2220", 10, "ECON", ["EAE2210"]],
      ["Contabilidad Gerencial", "EAA2240", 5, "ADMIN", ["EAA2210","EAE2220"]],
      ["Dirección de Personas", "EAA2110", 10, "ADMIN", ["EAA1110","ETI209"]],
      ["Formación General", "FG5", 10, "FORM"]
    ],
    "s8": [
      ["Opt. de Profundización/Minor", "OPM3", 10, "OPM"],
      ["Opt. de Profundización/Minor", "OPM4", 10, "OPM"],
      ["Opt. de Profundización/Minor", "OPM5", 10, "OPM"],
      ["Práctica Social", "EAF2500", 10, "PRACT", ["EAE2120","EAE2210","EAA2110","EAA2220","EAA2310"]],
      ["Formación General", "FG6", 10, "FORM"]
    ],
    "s9": [
      ["Dirección de Empresas y Estrategia", "EAA3401", 10, "ADM", ["EAA2110", "EAA2240"]],
      ["Creación de Nuevas Empresas", "EAA3601", 10, "ADM", ["EAA3401", "EAA3201"]],
      ["Dirección Financiera", "EAA3201", 10, "ADM", ["EAA2240"]],
      ["Liderazgo Estratégico", "EAA3101", 5, "ADM", ["EAA3401"]],
      ["Gestión de Operaciones", "EAA3501", 10, "ADM", ["EAE2510", "EAE2130", "EAA2240"]],
      ["Optativo de Profundización", "EAA3OPT1", 10, "OPT"]
    ],
    "s10": [
      ["Optativo de Profundización", "EAA3OPT2", 10, "OPT"],
      ["Optativo de Profundización", "EAA3OPT3", 10, "OPT"],
      ["Práctica Profesional", "EAA2500", 15, "PRACT", ["EAA3601"]],
      ["Proyecto de Título", "EAA3500", 15, "EXAM", ["EAA3101"]]
    ]
  },
  // La malla de Economía (ICOME) comparte la misma estructura base que la de Administración,
  // pero sus semestres IX y X han sido actualizados para reflejar únicamente los ramos de la
  // mención en Economía. En esta versión se incluyen los cursos de Macroeconomía Internacional,
  // Microeconometría Aplicada, Teoría Econométrica I y los optativos de profundización según
  // el programa oficial.
  'ICOME': {
    "s1": [
      ["Cálculo I", "MAT1610", 10, "MAT"],
      ["Introducción a la Microeconomía", "EAE1110", 10, "ECON"],
      ["Comportamiento Organizacional", "EAA1110", 10, "ADMIN"],
      ["Contabilidad", "EAA1210", 10, "ADMIN"],
      ["English Placement Test Alte 2", "VRA2010", 0, "FORM"],
      ["Comunicación Escrita", "VRA100C", 0, "FORM"]
    ],
    "s2": [
      ["Cálculo II", "MAT1620", 10, "MAT", ["MAT1610"]],
      ["Introducción a la Macroeconomía", "EAE1210", 10, "ECON", ["EAE1110"]],
      ["Probabilidad y Estadística", "EAA1510", 10, "ADMIN", ["MAT1610","MAT1620"]],
      ["Introducción al Álgebra Lineal", "MAT1279", 10, "MAT"],
      ["Filosofía: ¿Para qué?", "FIL2001", 10, "FORM"],
      ["English Test Sufficiency Alte 3", "VRA3010", 0, "FORM"]
    ],
    "s3": [
      ["Apli. Mat. Para Economía y Negocios", "EAF2010", 10, "PRACT", ["MAT1620","MAT1279"]],
      ["Análisis Económico: La Exp. Chilena", "EAE1220", 10, "ECON", ["EAE1210"]],
      ["Inferencia Estadística", "EAA1520", 10, "ADMIN", ["EAA1510"]],
      ["Fundamentos de Finanzas", "EAA1220", 10, "ADMIN", ["EAA1510","EAA1210"]],
      ["Teológico", "TTF1", 10, "FORM"]
    ],
    "s4": [
      ["Econometría", "EAE2510", 10, "ECON", ["EAA1520","MAT1279"]],
      ["Microeconomía I", "EAE2110", 10, "ECON", ["EAF2010","EAE1220"]],
      ["Estrategia de la Organización", "EAA2410", 10, "ADMIN", ["EAA1220","EAE1110"]],
      ["Fundamentos de Marketing", "EAA2310", 10, "ADMIN", ["EAA1510","EAA1210","EAA1110"]],
      ["Formación General", "FG1", 10, "FORM"]
    ],
    "s5": [
      ["Introducción a la Programación", "IIC1103", 10, "PROG"],
      ["Microeconomía II", "EAE2120", 10, "ECON", ["EAE2110"]],
      ["Macroeconomía I", "EAE2210", 10, "ECON", ["EAE1220","EAA1520"]],
      ["Teoría Financiera", "EAA2210", 10, "ADMIN", ["EAA2410","EAA1520"]],
      ["Formación General", "FG2", 10, "FORM"]
    ],
    "s6": [
      ["Opt. de Profundización/Minor", "OPM1", 10, "OPM"],
      ["Estrategia Competitiva", "EAA2420", 10, "ADMIN", ["EAA2410","EAE2120"]],
      ["Competencia y Mercado", "EAE2130", 10, "ECON", ["EAE2120"]],
      ["Contabilidad de Costos", "EAA2220", 5, "ADMIN", ["EAA2410"]],
      ["Marketing Analytics", "EAA2320", 10, "ADMIN", ["EAE2510","EAA2310"]],
      ["Ética, Economía y Empresa", "ETI209", 10, "MAT", ["EAA2410","EAE1220"]],
      ["Formación General", "FG4", 10, "FORM"]
    ],
    "s7": [
      ["Opt. de Profundización/Minor", "OPM2", 10, "OPM"],
      ["Empresa y Legislación", "EAA2230", 5, "ADMIN"],
      ["Macroeconomía II", "EAE2220", 10, "ECON", ["EAE2210"]],
      ["Contabilidad Gerencial", "EAA2240", 5, "ADMIN", ["EAA2210","EAE2220"]],
      ["Dirección de Personas", "EAA2110", 10, "ADMIN", ["EAA1110","ETI209"]],
      ["Formación General", "FG5", 10, "FORM"]
    ],
    "s8": [
      ["Opt. de Profundización/Minor", "OPM3", 10, "OPM"],
      ["Opt. de Profundización/Minor", "OPM4", 10, "OPM"],
      ["Opt. de Profundización/Minor", "OPM5", 10, "OPM"],
      ["Práctica Social", "EAF2500", 10, "PRACT", ["EAE2120","EAE2210","EAA2110","EAA2220","EAA2310"]],
      ["Formación General", "FG6", 10, "FORM"]
    ],
    "s9": [
      ["Macroeconomía Internacional", "EAE3210", 10, "ECON", ["EAE2210", "EAE2220"]],
      ["Microeconometría Aplicada", "EAE3110", 10, "ECON", ["EAE2510"]],
      ["Teoría Econométrica I", "EAE350B", 12, "ECON", ["EAE2510"]],
      ["Optativo de Profundización", "EAE3OPT1", 10, "OPT"],
      ["Optativo de Profundización", "EAE3OPT2", 10, "OPT"],
      ["Optativo de Profundización", "EAE3OPT3", 10, "OPT"]
    ],
    "s10": [
      ["Desafíos de la Economía Aplicada", "EAE3601", 15, "ECON", ["EAE3210", "EAE3110", "EAE350B"]],
      ["Optativo de Profundización", "EAE3OPT4", 10, "OPT"],
      ["Optativo de Profundización", "EAE3OPT5", 10, "OPT"],
      ["Práctica Profesional", "EAE2500", 15, "PRACT", ["EAE3601"]]
    ]
  }
};

const colorSets = {
  'ICOMA': {
    "MAT": ["#4CAF50", "Matemáticas"],
    "ECON": ["#2196F3", "Economía"],
    "ADMIN": ["#FFC107", "Administración"],
    "FORM": ["#9E9E9E", "Formación General"],
    "PROG": ["#3F51B5", "Programación"],
    "PRACT": ["#8BC34A", "Práctica"],
    "OPM": ["#FF5722", "Opt. Profundización"],
    "OPT": ["#795548", "Optativo"],
    // Categorías adicionales para la mención Administración y el proyecto de título:
    // "ADM": ramos propios de la mención de Administración (semestres IX y X).
    "ADM": ["#FFC107", "Administración"],
    // "EXAM": ramos de examen o proyecto de título.
    "EXAM": ["#9C27B0", "Examen/Proyecto"]
  },
  'ICOME': {
    "MAT": ["#4CAF50", "Matemáticas"],
    "ECON": ["#2196F3", "Economía"],
    "ADMIN": ["#FFC107", "Administración"],
    "FORM": ["#9E9E9E", "Formación General"],
    "PROG": ["#3F51B5", "Programación"],
    "PRACT": ["#8BC34A", "Práctica"],
    "OPM": ["#FF5722", "Opt. Profundización"],
    "OPT": ["#795548", "Optativo"]
  }
};

/* ---------- axis ---------- */
var drawer = canvas.append('g')
	.attr('transform', 'translate(10, 20)');

var globalY = 0;
var globalX = 0;
var _semester = 1;
var _s = ["I", "II", "III", "IV", "V", 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV']

var malla = {};
var all_ramos = {};
var total_creditos = 0;
var total_ramos = 0;
let id = 1;

$("#carrera").text(carreras[current_malla]);

/* PC: Plan común
 * FI: Fundamentos de Informática
 * HUM: Humanistas, libres y deportes
 * TIN: Transversal e Integración
 * SD: Sistemas de decisión informática
 * IND: Industrias
 * AN: Análisis Numérico
 */
// Si existe un dataset embebido para la malla actual, lo usamos directamente.
if (datasets[current_malla] !== undefined && colorSets[current_malla] !== undefined) {
  main_function(null, datasets[current_malla], colorSets[current_malla]);
} else {
  // De lo contrario, intentamos cargar los datos desde archivos externos
  d3.queue()
    .defer(d3.json, "data_" + current_malla + ".json")
    .defer(d3.json, "colors_" + current_malla + ".json")
    .await(main_function);
}

function main_function(error, data, colorBySector) {
	if (error) {
		console.log(error);
		$(".canvas").prepend("<h1>OPS!, malla no encontrada, <a href='http://labcomp.cl/~saedo/apps/viz/ramos'>Volver al inicio</a></h1>");
		return;
	}
	// load the data
	let longest_semester = 0;
	for (var semester in data) {
		malla[semester] = {};

		if (data[semester].length > longest_semester)
			longest_semester = data[semester].length;

		data[semester].forEach(function(ramo) {
			malla[semester][ramo[1]] = new tipoRamo(ramo[0], ramo[1], ramo[2], ramo[3], (function() {
				if (ramo.length > 4)
					return ramo[4];
				return [];
			})(), id++, colorBySector)
			all_ramos[ramo[1]] = malla[semester][ramo[1]];
            total_creditos += ramo[2];
            total_ramos++;
		});
	}

	// update width y height debido a que varian segun la malla
		// + 10 para evitar ocultamiento de parte de la malla
	width = (130*Object.keys(malla).length) * scaleX + 10;
	height = (110*longest_semester + 30 + 25) * scaleY + 10;

	canvas.attr("width", width)
		.attr("height", height);
	drawer.attr("width", width)
		.attr("height", height);

	// colores de la malla
	Object.keys(colorBySector).forEach(key => {
		color_description = d3.select(".color-description").append("div")
			.attr("style", "display:flex;vertical-align:middle;margin-right:15px;");
		circle_color = color_description.append("svg")
			.attr("height", "25px")
			.attr("width", "25px");
		circle_color.append("circle")
			.attr("r", 10)
			.attr("cx", 12)
			.attr("cy", 12)
			.attr("fill", colorBySector[key][0]);

		color_description.append("span").text(colorBySector[key][1]);

	});

	for (var semester in malla) {
		globalY = 0;
		// draw the axis
		drawer.append("rect")
			.attr("x", globalX)
			.attr("y", globalY)
			.attr("width", 120 * scaleX)
			.attr("height", 30 * scaleY)
			.attr("fill", 'gray');

		drawer.append("text")
			.attr('x', globalX + 110/2 * scaleX)
			.attr('y', globalY + 2*30/3 * scaleY)
			.text(_s[_semester-1])
			.attr('text-anchor', 'middle')
			.attr("font-family", "sans-serif")
			.attr("font-weight", "bold")
			.attr("fill", "white");
		_semester++;
		globalY += 40 * scaleY;

		for (var ramo in malla[semester]) {
			malla[semester][ramo].draw(drawer, globalX, globalY, scaleX, scaleY);
			globalY += 110 * scaleY;
		};
		globalX += 130 * scaleX;
	};
	drawer.selectAll(".ramo-label")
		.call(wrap, 115 * scaleX, (100 - 100/5*2) * scaleY);

	// verificar cache
	if (d3.select(".priori-canvas")._groups[0][0] == null && d3.select(".custom-canvas")._groups[0][0] == null) {
		var cache_variable = 'approvedRamos_' + current_malla;
		if (cache_variable in localStorage && localStorage[cache_variable] !== "") {
			let approvedRamos = localStorage[cache_variable].split(",");
			approvedRamos.forEach(function(ramo) {
				all_ramos[ramo].approveRamo();
			});
		}
	}

	// verificar prerrequisitos
	d3.interval(function() {
		for (var semester in malla) {
			for (var ramo in malla[semester]) {
				malla[semester][ramo].verifyPrer();
			}
		}

		let current_credits = 0;
        let current_ramos = APPROVED.length;
		APPROVED.forEach(function(ramo) {
			current_credits += ramo.creditos;
		});
		d3.select(".info").select("#creditos").text(`${current_credits} (${parseInt((current_credits/total_creditos)*100)}%), Total ramos: ${parseInt(current_ramos*100/total_ramos)}%`);
	}, 30);

	// filling the cache!
	d3.interval(function() {
		if (d3.select(".priori-canvas")._groups[0][0] == null && d3.select(".custom-canvas")._groups[0][0] == null) { 
		let willStore = []
		APPROVED.forEach(function(ramo) {
			willStore.push(ramo.sigla);
		});
		localStorage[cache_variable] = willStore;
		}
	}, 2000);




	var first_time = canvas.append("g")
	first_time.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "white")
		.attr("opacity", 0.9);
	first_time.append("text")
		.attr("x", width/2)
		.attr("y", height/2 - 180 * scaleY)
		.attr("dy", 0)
		.attr("text-anchor", "middle")
		.attr("font-size", 40* scaleX)
		.attr("opacity", 0.01)
		.text( function() {
			if (d3.select(".custom-canvas")._groups[0][0])
				return welcomeTitle
			return welcomeTitle + carreras[current_malla]
		})
		.transition().duration(800)
		.attr("y", height/2)
		.attr("opacity", 1)
		.call(wrap, 900 * scaleX, height);
	first_time.append("text")
		.attr("x", width/2)
		.attr("y", height/2 - 90 * scaleY)
		.attr("dy", "2.1em")
		.attr("text-anchor", "middle")
		.attr("font-size", 30*scaleX)
		.attr("opacity", 0.01)
		.text(welcomeDesc)
		.transition().duration(800)
		.attr("y", height/2)
		.attr("opacity", 1)
		.call(wrap, 900 * scaleX, height);

	first_time.on('click', function() {
		d3.select(this).transition().duration(200).style('opacity', 0.1).on('end', function() {
			d3.select(this).remove();
		});
	});

	if (d3.select(".priori-canvas")._groups[0][0]) { 
		start_priorix();
	} else if (d3.select(".custom-canvas")._groups[0][0]) {
		start_generator();
	}
}

// Encaja el texto en un rectangulo dado
// Si el texto no cabe, se achica la letra!
function wrap(text, width, height) {
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
				dy = parseFloat(text.attr("dy")),
				fontsize = parseInt(text.attr("font-size"),10),
				tspan = text.text(null).append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", dy + "em"),
				textLines,
				textHeight;
    while (word = words.pop()) {
				line.push(word);
				tspan.text(line.join(" "));
				while (tspan.node().getComputedTextLength() > width) {
					if (line.length == 1) {
						text.attr("font-size", String(--fontsize));
					}
					else {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", text.attr("x")).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
				}
		}
		textLines =  text.selectAll('tspan')._groups[0].length;
	  if (textLines === 1) {
		  text.selectAll('tspan').attr('y', (+d3.select(this).attr('y')) + (+5));
	  } else if (textLines > 2) {
		  text.selectAll('tspan').attr('y', d3.select(this).attr('y') - (110/2) * scaleY/4 );
		}
		textHeight = text.node().getBoundingClientRect().height;

		while (textHeight > height - 5) {
			text.attr("font-size", String(--fontsize));
			textHeight = text.node().getBoundingClientRect().height;
			lineNumber = 0;
			let tspans = text.selectAll('tspan')
			for (let index = 0; index < textLines; index++) {
				let tspan = tspans._groups[0][index];
				tspan.setAttribute('dy', lineNumber++ * 1 + dy + 'em'); 
				
			}
		}
  });
}

function limpiarRamos() {
	for (let i = APPROVED.length - 1; i >= 0; i--) {
		APPROVED[i].approveRamo();
	}
}