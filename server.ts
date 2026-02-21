import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('neosure.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT,
    age INTEGER,
    rchId TEXT,
    gestationWeeks INTEGER,
    gestationDays INTEGER,
    lastVisitDate TEXT,
    riskLevel TEXT
  );

  CREATE TABLE IF NOT EXISTS visits (
    id TEXT PRIMARY KEY,
    patientId TEXT,
    data TEXT
  );

  CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    visitId TEXT,
    patientId TEXT,
    status TEXT,
    data TEXT
  );
`);

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  app.use(express.json());

  // API Routes
  app.get('/api/patients', (req, res) => {
    const patients = db.prepare('SELECT * FROM patients').all();
    res.json(patients);
  });

  app.get('/api/patients/:id', (req, res) => {
    const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id) as any;
    const visits = db.prepare('SELECT * FROM visits WHERE patientId = ?').all() as any[];
    res.json({ ...patient, visits: visits.map(v => JSON.parse(v.data as string)) });
  });

  app.post('/api/visits', (req, res) => {
    const visit = req.body;
    db.prepare('INSERT OR REPLACE INTO visits (id, patientId, data) VALUES (?, ?, ?)')
      .run(visit.id, visit.patientId, JSON.stringify(visit));
    
    // Update patient risk and last visit
    db.prepare('UPDATE patients SET riskLevel = ?, lastVisitDate = ? WHERE id = ?')
      .run(visit.riskLevel, visit.date, visit.patientId);

    res.json({ success: true });
  });

  app.get('/api/referrals', (req, res) => {
    const referrals = db.prepare('SELECT * FROM referrals').all() as any[];
    res.json(referrals.map(r => JSON.parse(r.data as string)));
  });

  app.post('/api/referrals', (req, res) => {
    const referral = req.body;
    db.prepare('INSERT OR REPLACE INTO referrals (id, visitId, patientId, status, data) VALUES (?, ?, ?, ?, ?)')
      .run(referral.id, referral.visitId, referral.patientId, referral.status, JSON.stringify(referral));
    
    io.emit('referral_update', referral);
    res.json({ success: true });
  });

  // Socket.io for real-time
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join_referral', (referralId) => {
      socket.join(`referral_${referralId}`);
    });
    socket.on('send_note', (data) => {
      io.to(`referral_${data.referralId}`).emit('receive_note', data);
    });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), 'dist/index.html'));
    });
  }

  const PORT = 3000;
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
