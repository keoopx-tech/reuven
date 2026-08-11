(function () {
  'use strict';

  const KEY_ADULTOS         = 'reuven.adultos';
  const KEY_ADULTO_ACTIVO   = 'reuven.adultoActivoId';
  const KEY_PROFESIONALES   = 'reuven.profesionales';
  const KEY_PROF_ACTIVO     = 'reuven.profesionalActivoId';
  const KEY_LINKS           = 'reuven.vinculos';
  const KEY_CODIGOS         = 'reuven.codigos';
  const CODE_CHARS          = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function genCode() {
    let s = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) s += '-';
      s += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    return s;
  }
  function normalizeCode(code) {
    if (!code) return '';
    const clean = String(code).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    return clean.length === 8 ? clean.slice(0, 4) + '-' + clean.slice(4) : clean;
  }

  /* ---------- ADULTOS / FAMILIAS ---------- */
  function getAdultos() { return read(KEY_ADULTOS, []); }
  function addAdulto(data) {
    const adultos = getAdultos();
    const a = Object.assign({ id: uid('a'), creadoEn: Date.now() }, data || {});
    adultos.push(a);
    write(KEY_ADULTOS, adultos);
    write(KEY_ADULTO_ACTIVO, a.id);
    return a;
  }
  function getAdultoActivo() {
    const id = read(KEY_ADULTO_ACTIVO, null);
    return id ? getAdultos().find(x => x.id === id) || null : null;
  }
  function setAdultoActivo(id) { write(KEY_ADULTO_ACTIVO, id); }

  /* ---------- PROFESIONALES ---------- */
  function getProfesionales() { return read(KEY_PROFESIONALES, []); }
  function addProfesional(data) {
    const pros = getProfesionales();
    const p = Object.assign({ id: uid('pro'), creadoEn: Date.now() }, data || {});
    pros.push(p);
    write(KEY_PROFESIONALES, pros);
    write(KEY_PROF_ACTIVO, p.id);
    return p;
  }
  function getProfesionalActivo() {
    const id = read(KEY_PROF_ACTIVO, null);
    return id ? getProfesionales().find(x => x.id === id) || null : null;
  }
  function setProfesionalActivo(id) { write(KEY_PROF_ACTIVO, id); }

  /* ---------- CÓDIGOS DE VINCULACIÓN ---------- */
  function generarCodigo(adultoId, perfilId) {
    const codigos = read(KEY_CODIGOS, {});
    let code;
    do { code = genCode(); } while (codigos[code]);
    codigos[code] = { adultoId, perfilId, creadoEn: Date.now(), usado: false };
    write(KEY_CODIGOS, codigos);
    return code;
  }
  function getCodigosPorAdulto(adultoId) {
    const codigos = read(KEY_CODIGOS, {});
    return Object.entries(codigos)
      .filter(([_, v]) => v.adultoId === adultoId)
      .map(([code, v]) => Object.assign({ code }, v));
  }
  function getCodigosPorPerfil(perfilId) {
    const codigos = read(KEY_CODIGOS, {});
    return Object.entries(codigos)
      .filter(([_, v]) => v.perfilId === perfilId)
      .map(([code, v]) => Object.assign({ code }, v));
  }

  /* ---------- VÍNCULOS PROFESIONAL ↔ PERFIL ---------- */
  function getVinculos() { return read(KEY_LINKS, []); }
  function vincularPorCodigo(profesionalId, code) {
    const norm = normalizeCode(code);
    const codigos = read(KEY_CODIGOS, {});
    const entry = codigos[norm];
    if (!entry) return { ok: false, error: 'Código no válido o ya caducado.' };
    const links = getVinculos();
    const ya = links.find(l => l.profesionalId === profesionalId && l.perfilId === entry.perfilId);
    if (ya) return { ok: false, error: 'Ya estás vinculado/a a ese menor.' };
    links.push({ profesionalId, perfilId: entry.perfilId, fecha: Date.now(), via: 'codigo' });
    write(KEY_LINKS, links);
    codigos[norm].usado = true;
    write(KEY_CODIGOS, codigos);
    return { ok: true, perfilId: entry.perfilId };
  }
  function vincularDirecto(profesionalId, perfilId) {
    const links = getVinculos();
    if (!links.find(l => l.profesionalId === profesionalId && l.perfilId === perfilId)) {
      links.push({ profesionalId, perfilId, fecha: Date.now(), via: 'directo' });
      write(KEY_LINKS, links);
    }
  }
  function desvincular(profesionalId, perfilId) {
    const links = getVinculos().filter(
      l => !(l.profesionalId === profesionalId && l.perfilId === perfilId)
    );
    write(KEY_LINKS, links);
  }
  function getPerfilesDeProfesional(profesionalId) {
    if (!window.ReuvenMetrics) return [];
    const todos = window.ReuvenMetrics.getPerfiles();
    const ids = new Set(getVinculos()
      .filter(l => l.profesionalId === profesionalId)
      .map(l => l.perfilId));
    return todos.filter(p => ids.has(p.id));
  }

  /* ---------- LOGOUT ---------- */
  function logoutProfesional() { localStorage.removeItem(KEY_PROF_ACTIVO); }
  function logoutAdulto()      { localStorage.removeItem(KEY_ADULTO_ACTIVO); }

  /* ---------- SEED DEMO ---------- */
  function seedDemo(opts) {
    const M = window.ReuvenMetrics;
    if (!M) return null;
    opts = opts || {};

    /* 0) Limpiar restos del seed antiguo (cuando había una sola cuenta demo@*.com) */
    const adultosLimpios = getAdultos().filter(a => a.email !== 'demo@familia.com');
    if (adultosLimpios.length !== getAdultos().length) write(KEY_ADULTOS, adultosLimpios);
    const profesLimpios = getProfesionales().filter(p => p.email !== 'demo@profesional.com');
    if (profesLimpios.length !== getProfesionales().length) {
      const idsBorrados = new Set(getProfesionales().filter(p => p.email === 'demo@profesional.com').map(p => p.id));
      write(KEY_PROFESIONALES, profesLimpios);
      const linksLimpios = getVinculos().filter(l => !idsBorrados.has(l.profesionalId));
      write(KEY_LINKS, linksLimpios);
      const proActivo = read(KEY_PROF_ACTIVO, null);
      if (proActivo && idsBorrados.has(proActivo)) localStorage.removeItem(KEY_PROF_ACTIVO);
    }

    /* 1) Niños */
    const ninosCfg = [
      { nombre: 'Liam',  emoji: '🦊', esNino: true,  tasa: 0.78, hasta: 6 },
      { nombre: 'Ellie', emoji: '🐱', esNino: false, tasa: 0.45, hasta: 3 },
      { nombre: 'Mateo', emoji: '🐘', esNino: true,  tasa: 0.92, hasta: 8 },
    ];
    let perfiles = M.getPerfiles();
    ninosCfg.forEach(p => {
      if (!perfiles.find(x => x.nombre === p.nombre)) {
        M.addPerfil(p.nombre, p.emoji, p.esNino);
      }
    });
    perfiles = M.getPerfiles();

    /* 2) Familias (1 adulto por niño) */
    const familiasCfg = [
      { nombre: 'Marta García', email: 'marta@familia.com',  telefono: '600 100 100', relacion: 'madre', perfilNombre: 'Liam'  },
      { nombre: 'Pablo Martín', email: 'pablo@familia.com',  telefono: '600 200 200', relacion: 'padre', perfilNombre: 'Ellie' },
      { nombre: 'Lucía López',  email: 'lucia@familia.com',  telefono: '600 300 300', relacion: 'madre', perfilNombre: 'Mateo' },
    ];
    const adultosCreados = [];
    familiasCfg.forEach(f => {
      let a = getAdultos().find(x => x.email === f.email);
      if (!a) {
        a = addAdulto({ nombre: f.nombre, email: f.email, telefono: f.telefono, relacion: f.relacion });
      }
      adultosCreados.push({ adulto: a, perfilNombre: f.perfilNombre });
    });

    /* 3) Profesionales con vínculos cruzados */
    const profesCfg = [
      {
        nombre: 'Dra. Carmen Ruiz', email: 'carmen@reuven.edu',
        telefono: '601 100 100', profesion: 'logopeda',
        centro: 'Reuven Feuerstein', colegiado: '28/4521',
        vinculaCon: ['Liam', 'Ellie', 'Mateo'],
      },
      {
        nombre: 'María Sanz', email: 'maria@reuven.edu',
        telefono: '601 200 200', profesion: 'docente',
        centro: 'Reuven Feuerstein', colegiado: '',
        vinculaCon: ['Liam', 'Ellie'],
      },
      {
        nombre: 'Javier Pérez', email: 'javier@reuven.edu',
        telefono: '601 300 300', profesion: 'psicologo',
        centro: 'Consulta privada · Bogotá', colegiado: '11/2024',
        vinculaCon: ['Mateo'],
      },
    ];
    const profesCreados = [];
    profesCfg.forEach(p => {
      let pro = getProfesionales().find(x => x.email === p.email);
      if (!pro) {
        pro = addProfesional({
          nombre: p.nombre, email: p.email, telefono: p.telefono,
          profesion: p.profesion, centro: p.centro, colegiado: p.colegiado,
        });
      }
      profesCreados.push({ pro, vinculaCon: p.vinculaCon });
    });

    /* 4) Vínculos profesional ↔ menor */
    profesCreados.forEach(({ pro, vinculaCon }) => {
      vinculaCon.forEach(nombre => {
        const perfil = perfiles.find(x => x.nombre === nombre);
        if (perfil) vincularDirecto(pro.id, perfil.id);
      });
    });

    /* 5) Códigos por perfil (para mostrar al adulto) */
    adultosCreados.forEach(({ adulto, perfilNombre }) => {
      const perfil = perfiles.find(x => x.nombre === perfilNombre);
      if (perfil && getCodigosPorPerfil(perfil.id).length === 0) {
        generarCodigo(adulto.id, perfil.id);
      }
    });

    /* 6) Activar el primer profesional si nos lo piden o si no hay activo */
    if (opts.activarProfesional || !getProfesionalActivo()) {
      if (profesCreados[0]) setProfesionalActivo(profesCreados[0].pro.id);
    }
    if (opts.activarAdulto || !getAdultoActivo()) {
      if (adultosCreados[0]) setAdultoActivo(adultosCreados[0].adulto.id);
    }

    /* 7) Eventos sintéticos (solo si están vacíos) */
    const eventosActuales = read('reuven.eventos', []);
    if (eventosActuales.length < 30) {
      simularEventos(perfiles, ninosCfg);
    }

    return {
      adultos: adultosCreados.map(x => x.adulto),
      profesionales: profesCreados.map(x => x.pro),
      perfiles,
    };
  }

  function simularEventos(perfiles, config) {
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now();
    const todayMid = new Date(); todayMid.setHours(15, 0, 0, 0);
    const eventos = read('reuven.eventos', []);

    perfiles.forEach((p, idx) => {
      const cfg = config[idx] || { tasa: 0.7, hasta: 5 };
      const tasa = cfg.tasa;
      const hasta = cfg.hasta;

      for (let d = 7; d >= 0; d--) {
        const fechaBase = todayMid.getTime() - d * day;
        if (d > 0 && Math.random() < 0.35) continue; // a veces no juega ese día

        const numTareas = Math.min(hasta, 1 + Math.floor(Math.random() * 4));
        let tareaInicio = 1;
        if (hasta > 1) tareaInicio = 1 + Math.floor(Math.random() * Math.max(1, hasta - numTareas + 1));

        for (let t = tareaInicio; t < tareaInicio + numTareas && t <= hasta; t++) {
          const startTs = fechaBase + ((t - tareaInicio) * 6 * 60 * 1000);
          const intentos = 5 + Math.floor(Math.random() * 7);
          const ruido = (Math.random() - 0.5) * 0.18;
          const aciertosTask = Math.max(0, Math.min(intentos, Math.round(intentos * (tasa + ruido))));
          const duracionMs = (3 + Math.random() * 4) * 60 * 1000;

          eventos.push({ perfilId: p.id, taskNum: t, tipo: 'task_start', ts: startTs });
          for (let a = 0; a < intentos; a++) {
            eventos.push({
              perfilId: p.id, taskNum: t,
              tipo: a < aciertosTask ? 'attempt_ok' : 'attempt_fail',
              ts: startTs + 20000 + a * 8500,
            });
          }
          eventos.push({
            perfilId: p.id, taskNum: t, tipo: 'task_end',
            ts: startTs + duracionMs,
            payload: { completada: aciertosTask >= intentos * 0.6, duracionMs }
          });
        }
      }
    });

    eventos.sort((a, b) => a.ts - b.ts);
    write('reuven.eventos', eventos);
  }

  function resetTodo() {
    [KEY_ADULTOS, KEY_ADULTO_ACTIVO, KEY_PROFESIONALES, KEY_PROF_ACTIVO,
     KEY_LINKS, KEY_CODIGOS,
     'reuven.perfiles', 'reuven.perfilActivoId', 'reuven.eventos', 'reuven.taskStart']
      .forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
  }

  window.ReuvenAuth = {
    /* adultos */
    addAdulto, getAdultos, getAdultoActivo, setAdultoActivo, logoutAdulto,
    /* profesionales */
    addProfesional, getProfesionales, getProfesionalActivo, setProfesionalActivo, logoutProfesional,
    /* códigos */
    generarCodigo, getCodigosPorAdulto, getCodigosPorPerfil, normalizeCode,
    /* vínculos */
    vincularPorCodigo, vincularDirecto, desvincular,
    getVinculos, getPerfilesDeProfesional,
    /* utilidades */
    seedDemo, resetTodo,
  };
})();
