(function () {
  'use strict';

  const KEY_PERFILES = 'reuven.perfiles';
  const KEY_PERFIL_ACTIVO = 'reuven.perfilActivoId';
  const KEY_EVENTOS = 'reuven.eventos';
  const KEY_TASK_START = 'reuven.taskStart';
  const KEY_USUARIOS = 'reuven.usuarios';
  const KEY_SESION = 'reuven.sesion';
  const KEY_SEMBRADO = 'reuven.sembrado';
  const MAX_EVENTOS = 5000;

  const TASKS = [
    { num: 1, nombre: 'Vocales',     color: '#ef4444' },
    { num: 2, nombre: 'Escribir',    color: '#eab308' },
    { num: 3, nombre: 'Huecos',      color: '#3b82f6' },
    { num: 4, nombre: 'Ordenar',     color: '#22c55e' },
    { num: 5, nombre: 'Sílabas',     color: '#f97316' },
    { num: 6, nombre: 'Sonido /rr/', color: '#ec4899' },
    { num: 7, nombre: 'Unir',        color: '#0d9488' },
    { num: 8, nombre: 'Colorear',    color: '#8b5cf6' },
  ];

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage lleno o deshabilitado: silenciar para no romper la app del niño
    }
  }

  function uid() {
    return 'p_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getPerfiles() {
    return read(KEY_PERFILES, []);
  }

  function addPerfil(nombre, emoji, esNino, opts) {
    const perfiles = getPerfiles();
    const perfil = {
      id: (opts && opts.id) || uid(),
      nombre: String(nombre || '').trim() || 'Sin nombre',
      emoji: emoji || '🐻',
      esNino: !!esNino,
      tutorIds: (opts && opts.tutorIds) || [],
      profesionalesIds: (opts && opts.profesionalesIds) || [],
      creadoEn: (opts && opts.creadoEn) || Date.now(),
    };
    perfiles.push(perfil);
    write(KEY_PERFILES, perfiles);
    return perfil;
  }

  // ============================================================
  // SEMBRADO (usuarios + estudiantes demo desde window.REUVEN_SEED)
  // ============================================================
  function sembrarSiVacio() {
    if (read(KEY_SEMBRADO, false)) return;
    if (!window.REUVEN_SEED) return;
    const seed = window.REUVEN_SEED;

    if (read(KEY_USUARIOS, []).length === 0 && Array.isArray(seed.usuarios)) {
      write(KEY_USUARIOS, seed.usuarios);
    }

    if (getPerfiles().length === 0 && Array.isArray(seed.perfiles)) {
      write(KEY_PERFILES, seed.perfiles);
    }

    if (read(KEY_EVENTOS, []).length === 0 && Array.isArray(seed.eventos)) {
      write(KEY_EVENTOS, seed.eventos);
    }

    write(KEY_SEMBRADO, true);
  }

  // ============================================================
  // USUARIOS Y SESIÓN
  // ============================================================
  function getUsuarios() {
    return read(KEY_USUARIOS, []);
  }

  function loginAdulto(email, password) {
    const e = String(email || '').trim().toLowerCase();
    const p = String(password || '');
    const u = getUsuarios().find(x => String(x.email).toLowerCase() === e && String(x.password) === p);
    if (!u) return null;
    const sesion = {
      userId: u.id,
      rol: u.rol,
      nombre: u.nombre,
      iniciadaEn: Date.now(),
    };
    write(KEY_SESION, sesion);
    return sesion;
  }

  function getSesion() {
    return read(KEY_SESION, null);
  }

  function getUsuarioSesion() {
    const s = getSesion();
    if (!s) return null;
    return getUsuarios().find(u => u.id === s.userId) || null;
  }

  function logoutAdulto() {
    localStorage.removeItem(KEY_SESION);
  }

  // Devuelve los estudiantes que el adulto en sesión puede ver
  function getEstudiantesPermitidos() {
    const u = getUsuarioSesion();
    if (!u) return [];
    const ids = new Set(u.estudiantesIds || []);
    return getPerfiles().filter(p => {
      if (ids.has(p.id)) return true;
      // Doble enlace: si el perfil tiene al adulto en su lista de tutores/profesionales, también permitido
      if (u.rol === 'tutor' && (p.tutorIds || []).includes(u.id)) return true;
      if (u.rol === 'profesional' && (p.profesionalesIds || []).includes(u.id)) return true;
      return false;
    });
  }

  function puedeVerPerfil(perfilId) {
    return getEstudiantesPermitidos().some(p => p.id === perfilId);
  }
  // ============================================================

  function deletePerfil(id) {
    const perfiles = getPerfiles().filter(p => p.id !== id);
    write(KEY_PERFILES, perfiles);
    const eventos = read(KEY_EVENTOS, []).filter(e => e.perfilId !== id);
    write(KEY_EVENTOS, eventos);
    if (read(KEY_PERFIL_ACTIVO, null) === id) {
      localStorage.removeItem(KEY_PERFIL_ACTIVO);
    }
  }

  function setPerfilActivo(id) {
    write(KEY_PERFIL_ACTIVO, id);
  }

  function getPerfilActivo() {
    const id = read(KEY_PERFIL_ACTIVO, null);
    if (!id) return null;
    return getPerfiles().find(p => p.id === id) || null;
  }

  function pushEvento(evento) {
    const eventos = read(KEY_EVENTOS, []);
    eventos.push(evento);
    if (eventos.length > MAX_EVENTOS) {
      eventos.splice(0, eventos.length - MAX_EVENTOS);
    }
    write(KEY_EVENTOS, eventos);
  }

  function startTask(taskNum) {
    const perfil = getPerfilActivo();
    if (!perfil) return;
    const starts = read(KEY_TASK_START, {});
    starts[taskNum] = Date.now();
    sessionStorage.setItem(KEY_TASK_START, JSON.stringify(starts));
    pushEvento({
      perfilId: perfil.id,
      taskNum: taskNum,
      tipo: 'task_start',
      ts: Date.now(),
    });
  }

  function endTask(taskNum, opts) {
    const perfil = getPerfilActivo();
    if (!perfil) return;
    let startTs = null;
    try {
      const starts = JSON.parse(sessionStorage.getItem(KEY_TASK_START) || '{}');
      startTs = starts[taskNum] || null;
      if (startTs) {
        delete starts[taskNum];
        sessionStorage.setItem(KEY_TASK_START, JSON.stringify(starts));
      }
    } catch (e) {}
    const duracionMs = startTs ? Date.now() - startTs : 0;
    pushEvento({
      perfilId: perfil.id,
      taskNum: taskNum,
      tipo: 'task_end',
      ts: Date.now(),
      payload: {
        completada: !!(opts && opts.completada),
        duracionMs: duracionMs,
      },
    });
  }

  function recordAttempt(taskNum, opts) {
    const perfil = getPerfilActivo();
    if (!perfil) return;
    const correcto = !!(opts && opts.correcto);
    pushEvento({
      perfilId: perfil.id,
      taskNum: taskNum,
      tipo: correcto ? 'attempt_ok' : 'attempt_fail',
      ts: Date.now(),
      payload: {
        item: (opts && opts.item) || null,
        detalle: (opts && opts.detalle) || null,
      },
    });
  }

  function getEventos(perfilId) {
    const all = read(KEY_EVENTOS, []);
    if (!perfilId) return all;
    return all.filter(e => e.perfilId === perfilId);
  }

  function getResumen(perfilId) {
    const eventos = getEventos(perfilId);
    let okCount = 0, failCount = 0, completadas = 0, tiempoMs = 0;
    for (const e of eventos) {
      if (e.tipo === 'attempt_ok') okCount++;
      else if (e.tipo === 'attempt_fail') failCount++;
      else if (e.tipo === 'task_end') {
        if (e.payload && e.payload.completada) completadas++;
        if (e.payload && e.payload.duracionMs) tiempoMs += e.payload.duracionMs;
      }
    }
    const total = okCount + failCount;
    return {
      tiempoMs,
      completadas,
      aciertos: okCount,
      fallidos: failCount,
      tasaAcierto: total ? Math.round((okCount / total) * 100) : 0,
    };
  }

  function getPorActividad(perfilId) {
    const eventos = getEventos(perfilId);
    const map = {};
    for (const t of TASKS) {
      map[t.num] = {
        taskNum: t.num,
        nombre: t.nombre,
        color: t.color,
        aciertos: 0,
        fallidos: 0,
        tiempoMs: 0,
        sesiones: 0,
        completadas: 0,
      };
    }
    for (const e of eventos) {
      const m = map[e.taskNum];
      if (!m) continue;
      if (e.tipo === 'attempt_ok') m.aciertos++;
      else if (e.tipo === 'attempt_fail') m.fallidos++;
      else if (e.tipo === 'task_end') {
        m.sesiones++;
        if (e.payload && e.payload.completada) m.completadas++;
        if (e.payload && e.payload.duracionMs) m.tiempoMs += e.payload.duracionMs;
      }
    }
    return TASKS.map(t => map[t.num]);
  }

  function getSerieTemporal(perfilId, dias) {
    const days = Math.max(1, dias || 14);
    const eventos = getEventos(perfilId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const buckets = [];
    const index = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const bucket = { fecha: key, aciertos: 0, fallidos: 0 };
      buckets.push(bucket);
      index[key] = bucket;
    }
    for (const e of eventos) {
      if (e.tipo !== 'attempt_ok' && e.tipo !== 'attempt_fail') continue;
      const key = new Date(e.ts).toISOString().slice(0, 10);
      const bucket = index[key];
      if (!bucket) continue;
      if (e.tipo === 'attempt_ok') bucket.aciertos++;
      else bucket.fallidos++;
    }
    return buckets;
  }

  function getSesiones(perfilId, limite) {
    const eventos = getEventos(perfilId);
    const fines = eventos.filter(e => e.tipo === 'task_end').slice().reverse();
    const lim = limite || 20;
    const out = [];
    for (const fin of fines) {
      if (out.length >= lim) break;
      const ventanaInicio = (fin.payload && fin.payload.duracionMs) ? fin.ts - fin.payload.duracionMs : fin.ts - 60000;
      let ok = 0, fail = 0;
      for (const e of eventos) {
        if (e.taskNum !== fin.taskNum) continue;
        if (e.ts < ventanaInicio || e.ts > fin.ts) continue;
        if (e.tipo === 'attempt_ok') ok++;
        else if (e.tipo === 'attempt_fail') fail++;
      }
      const t = TASKS.find(x => x.num === fin.taskNum);
      out.push({
        ts: fin.ts,
        taskNum: fin.taskNum,
        nombre: t ? t.nombre : ('Tarea ' + fin.taskNum),
        duracionMs: (fin.payload && fin.payload.duracionMs) || 0,
        aciertos: ok,
        fallidos: fail,
        completada: !!(fin.payload && fin.payload.completada),
      });
    }
    return out;
  }

  function exportJSON(perfilId) {
    const perfil = getPerfiles().find(p => p.id === perfilId);
    const data = {
      perfil: perfil || null,
      exportadoEn: new Date().toISOString(),
      resumen: getResumen(perfilId),
      porActividad: getPorActividad(perfilId),
      eventos: getEventos(perfilId),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metricas-' + (perfil ? perfil.nombre.toLowerCase().replace(/\s+/g, '-') : 'reuven') + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function borrarDatosPerfil(perfilId) {
    const eventos = read(KEY_EVENTOS, []).filter(e => e.perfilId !== perfilId);
    write(KEY_EVENTOS, eventos);
  }

  function formatDuracion(ms) {
    if (!ms || ms < 1000) return '0s';
    const s = Math.round(ms / 1000);
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60);
    const rs = s % 60;
    if (m < 60) return m + 'min ' + (rs ? rs + 's' : '').trim();
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return h + 'h ' + (rm ? rm + 'min' : '').trim();
  }

  window.ReuvenMetrics = {
    TASKS,
    getPerfiles,
    addPerfil,
    deletePerfil,
    setPerfilActivo,
    getPerfilActivo,
    startTask,
    endTask,
    recordAttempt,
    getResumen,
    getPorActividad,
    getSerieTemporal,
    getSesiones,
    exportJSON,
    borrarDatosPerfil,
    formatDuracion,
    // Sesión y roles
    sembrarSiVacio,
    getUsuarios,
    loginAdulto,
    getSesion,
    getUsuarioSesion,
    logoutAdulto,
    getEstudiantesPermitidos,
    puedeVerPerfil,
  };

  // Si seed.js cargó antes, sembrar al instante
  sembrarSiVacio();
})();
