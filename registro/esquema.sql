-- Una fila por visita y otra por cada cosa que hace dentro. No se guarda la IP.
CREATE TABLE IF NOT EXISTS visitas (
  id TEXT PRIMARY KEY,
  inicio INTEGER NOT NULL,
  ultima INTEGER NOT NULL,
  duracion INTEGER DEFAULT 0,
  pais TEXT, region TEXT, ciudad TEXT,
  dispositivo TEXT, sistema TEXT, navegador TEXT,
  idioma TEXT, pantalla TEXT, origen TEXT, campana TEXT,
  personaje TEXT
);
CREATE INDEX IF NOT EXISTS visitas_inicio ON visitas(inicio DESC);

CREATE TABLE IF NOT EXISTS eventos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  visita TEXT NOT NULL,
  hora INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  dato TEXT
);
CREATE INDEX IF NOT EXISTS eventos_visita ON eventos(visita);

-- El récord de cada minijuego, compartido por todos los que juegan: nombre del personaje y puntos
CREATE TABLE IF NOT EXISTS records (
  juego TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  puntos INTEGER NOT NULL,
  fecha INTEGER NOT NULL
);
