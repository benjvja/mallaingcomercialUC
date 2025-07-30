export const semesters = [
        {
          name: "Semestre 1",
          courses: [
            { code:"EAE1110", name:"Introducción a la Microeconomía", credits:10, prereq:[] },
            { code:"MAT1610", name:"Cálculo I", credits:10, prereq:[] },
            { code:"EAA1210", name:"Contabilidad", credits:10, prereq:[] },
            { code:"IIC1103", name:"Introducción a la Programación", credits:10, prereq:[] },
            { code:"EAA1110", name:"Comportamiento Organizacional", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 2",
          courses: [
            { code:"EAA1510", name:"Probabilidad y Estadística", credits:10, prereq:["MAT1610"] },
            { code:"MAT1620", name:"Cálculo II", credits:10, prereq:["MAT1610"] },
            { code:"EAE1210", name:"Introducción a la Macroeconomía", credits:10, prereq:["EAE1110"] },
            { code:"MAT1279", name:"Introducción al Álgebra Lineal", credits:10, prereq:[] },
            { code:"FIL2001", name:"Filosofía: ¿Para qué?", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 3",
          courses: [
            { code:"EAA1520", name:"Inferencia Estadística", credits:10, prereq:["EAA1510"] },
            { code:"EAF2010", name:"Aplicaciones Matemáticas para Economía y Negocios", credits:10, prereq:["MAT1620","MAT1279"] },
            { code:"EAE1220", name:"Análisis Económico y Experiencia Chilena", credits:10, prereq:["EAE1210"] },
            { code:"EAA1220", name:"Fundamentos de Finanzas", credits:10, prereq:["EAA1210"] },
            { code:"TTF000", name:"Formación Teológica (TTF)", credits:10, prereq:[]},
          ]
        },
        {
          name: "Semestre 4",
          courses: [
            { code:"EAE2510", name:"Econometría", credits:10, prereq:["EAA1520"] },
            { code:"EAE2110", name:"Microeconometría I", credits:10, prereq:["EAE2510"] },
            { code:"EAA2410", name:"Estrategia de la Organización", credits:10, prereq:["EAA1110"] },
            { code:"EAA2310", name:"Fundamentos de Marketing", credits:10, prereq:["EAA1110"] },
            { code:"FG040", name:"Formación General (Artes / Hum.)", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 5",
          courses: [
            { code:"EAE2120", name:"Microeconomía II", credits:10, prereq:["EAE1220"] },
            { code:"EAE2210", name:"Macroeconomía I", credits:10, prereq:["EAE1210"] },
            { code:"EAA2210", name:"Teoría Financiera", credits:10, prereq:["EAA1220"] },
            { code:"FIL0209", name:"Ética, Economía y Empresa", credits:10, prereq:[] },
            { code:"FG050", name:"Formación General", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 6",
          courses: [
            { code:"OPR601", name:"Optativo de Profundización", credits:10, prereq:[] },
            { code:"EAE2130", name:"Competencia y Mercado", credits:10, prereq:["EAE2120"] },
            { code:"EAA2220", name:"Contabilidad de Costos", credits:5, prereq:["EAA1210"] },
            { code:"EAA2230", name:"Empresa y Legislación", credits:5, prereq:[] },
            { code:"EAA2320", name:"Marketing Analytics", credits:10, prereq:["EAA2310"] },
            { code:"FG060", name:"Formación General", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 7",
          courses: [
            { code:"OPR701", name:"Optativo de Profundización", credits:10, prereq:[] },
            { code:"EAE2220", name:"Macroeconomía II", credits:10, prereq:["EAE2210"] },
            { code:"EAA2240", name:"Contabilidad Gerencial", credits:10, prereq:["EAE2220"] },
            { code:"EAA2110", name:"Dirección de Personas", credits:10, prereq:["EAA1110"] },
            { code:"FG070", name:"Formación General", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 8",
          courses: [
            { code:"OPR801", name:"Optativo de Profundización", credits:10, prereq:[] },
            { code:"OPR802", name:"Optativo de Profundización", credits:10, prereq:[] },
            { code:"OPR803", name:"Optativo de Profundización", credits:10, prereq:[] },
            { code:"EAF2500", name:"Práctica Social", credits:10, prereq:[] },
            { code:"FG080", name:"Formación General", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 9 (Mención Administración)",
          courses: [
            { code:"EAA3401", name:"Dirección de Empresas y Estrategia", credits:10, prereq:["EAA2410"] },
            { code:"EAA3201", name:"Dirección Financiera", credits:10, prereq:["EAA2210"] },
            { code:"EAA3501", name:"Gestión de Operaciones", credits:10, prereq:[] },
            { code:"OPR901", name:"Optativo Prof. Administración", credits:10, prereq:[] },
            { code:"OPR902", name:"Optativo Prof. Adm/Econ", credits:10, prereq:[] },
          ]
        },
        {
          name: "Semestre 10 (Mención Administración)",
          courses: [
            { code:"EAA3601", name:"Creación de Nuevas Empresas", credits:10, prereq:["EAA3401"] },
            { code:"EAA3101", name:"Liderazgo Estratégico", credits:5, prereq:["EAA2110"] },
            { code:"OPR1001", name:"Optativo Prof. Administración", credits:10, prereq:[] },
            { code:"OPR1002", name:"Optativo Prof. Adm/Econ", credits:10, prereq:[] },
            { code:"EAA3500", name:"Práctica Profesional", credits:15, prereq:[] },
          ]
        },
      ];