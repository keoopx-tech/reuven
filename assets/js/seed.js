/*
  Datos demo embebidos.
  Espejo de data/usuarios.json y data/estudiantes-demo.json.
  Si edita los JSON, sincronice este archivo (los HTML estáticos no pueden hacer fetch al abrirse via file://).
*/
(function () {
  'use strict';

  const USUARIOS = [
    {
      id: 'u_papa',
      rol: 'tutor',
      nombre: 'Carlos (papá demo)',
      email: 'papa@demo.com',
      password: 'demo123',
      estudiantesIds: ['p_liam', 'p_ellie'],
    },
    {
      id: 'u_mama',
      rol: 'tutor',
      nombre: 'Lucía (mamá demo)',
      email: 'mama@demo.com',
      password: 'demo123',
      estudiantesIds: ['p_mateo'],
    },
    {
      id: 'u_profe',
      rol: 'profesional',
      nombre: 'Marta López',
      email: 'profe@demo.com',
      password: 'demo123',
      especialidad: 'Logopedia',
      estudiantesIds: ['p_liam', 'p_ellie', 'p_mateo', 'p_sofia'],
    },
  ];

  const ESTUDIANTES = [
    { id: 'p_liam',  nombre: 'Liam',  emoji: '🦊', esNino: true,  tutorIds: ['u_papa'], profesionalesIds: ['u_profe'], perfilDemo: { nivel: 'intermedio',   tendencia: 'mejora',    tasaAciertoObjetivo: 0.78 } },
    { id: 'p_ellie', nombre: 'Ellie', emoji: '🐱', esNino: false, tutorIds: ['u_papa'], profesionalesIds: ['u_profe'], perfilDemo: { nivel: 'avanzado',     tendencia: 'estable',   tasaAciertoObjetivo: 0.88 } },
    { id: 'p_mateo', nombre: 'Mateo', emoji: '🐘', esNino: true,  tutorIds: ['u_mama'], profesionalesIds: ['u_profe'], perfilDemo: { nivel: 'principiante', tendencia: 'mejora',    tasaAciertoObjetivo: 0.55 } },
    { id: 'p_sofia', nombre: 'Sofía', emoji: '🦄', esNino: false, tutorIds: [],         profesionalesIds: ['u_profe'], perfilDemo: { nivel: 'intermedio',   tendencia: 'irregular', tasaAciertoObjetivo: 0.65 } },
  ];

  // Diccionario palabras-por-tarea (para que los eventos demo tengan items realistas)
  const ITEMS_POR_TAREA = {
    1: ['SOL', 'CASA', 'GATO'],
    2: ['OVEJA', 'PATO', 'CASA'],
    3: ['PATO', 'MESA', 'CASA'],
    4: ['SOPA', 'PALA', 'PITO'],
    5: ['SOL', 'PALA', 'OVEJA', 'ELEFANTE'],
    6: ['RATÓN', 'ROSA', 'REGLA', 'RÍO'],
    7: ['TORRE', 'PATO', 'MESA', 'CASA'],
    8: ['PALA', 'TORRE', 'OVEJA'],
  };

  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // Genera eventos sintéticos para un estudiante a lo largo de los últimos N días.
  function generarEventos(estudiante, dias) {
    const eventos = [];
    const ahora = Date.now();
    const dia = 24 * 60 * 60 * 1000;
    const objetivo = estudiante.perfilDemo.tasaAciertoObjetivo;
    const tendencia = estudiante.perfilDemo.tendencia;
    const sesionesPorDia = estudiante.perfilDemo.nivel === 'avanzado' ? 2 :
                           estudiante.perfilDemo.nivel === 'intermedio' ? 1.5 : 1;

    for (let d = dias - 1; d >= 0; d--) {
      // ¿Practicó hoy? (no todos los días)
      const practicar = tendencia === 'irregular' ? Math.random() < 0.55 : Math.random() < 0.85;
      if (!practicar) continue;

      const numSesiones = Math.max(1, Math.round(sesionesPorDia + (Math.random() - 0.5)));
      // ajuste por tendencia: mejora => acierto sube con el tiempo
      const factorTiempo = tendencia === 'mejora'
        ? (1 - d / dias) * 0.15
        : tendencia === 'irregular' ? (Math.random() - 0.5) * 0.2 : 0;
      const aciertoEsperado = Math.min(0.97, Math.max(0.3, objetivo + factorTiempo));

      for (let s = 0; s < numSesiones; s++) {
        const taskNum = rand(1, 8);
        const items = ITEMS_POR_TAREA[taskNum];
        const horaInicio = ahora - d * dia - rand(2, 10) * 60 * 60 * 1000 - rand(0, 59) * 60 * 1000;
        const intentos = rand(4, 12);
        let okCount = 0, failCount = 0;

        eventos.push({
          perfilId: estudiante.id,
          taskNum: taskNum,
          tipo: 'task_start',
          ts: horaInicio,
        });

        for (let i = 0; i < intentos; i++) {
          const correcto = Math.random() < aciertoEsperado;
          eventos.push({
            perfilId: estudiante.id,
            taskNum: taskNum,
            tipo: correcto ? 'attempt_ok' : 'attempt_fail',
            ts: horaInicio + (i + 1) * rand(8, 25) * 1000,
            payload: { item: pick(items), detalle: null },
          });
          if (correcto) okCount++; else failCount++;
        }

        const duracionMs = (intentos + 1) * rand(8, 25) * 1000;
        // Una tarea se considera completada si tuvo más aciertos que fallidos y al menos 3 aciertos
        const completada = okCount >= 3 && okCount > failCount;
        eventos.push({
          perfilId: estudiante.id,
          taskNum: taskNum,
          tipo: 'task_end',
          ts: horaInicio + duracionMs,
          payload: { completada: completada, duracionMs: duracionMs },
        });
      }
    }
    return eventos;
  }

  function buildSeed() {
    const eventos = [];
    ESTUDIANTES.forEach(est => {
      const evs = generarEventos(est, 14);
      for (const e of evs) eventos.push(e);
    });
    eventos.sort((a, b) => a.ts - b.ts);

    return {
      usuarios: USUARIOS,
      perfiles: ESTUDIANTES.map(e => ({
        id: e.id,
        nombre: e.nombre,
        emoji: e.emoji,
        esNino: e.esNino,
        tutorIds: e.tutorIds || [],
        profesionalesIds: e.profesionalesIds || [],
        creadoEn: Date.now() - 14 * 24 * 60 * 60 * 1000,
      })),
      eventos: eventos,
    };
  }

  window.REUVEN_SEED = buildSeed();
})();
