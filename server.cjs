const express = require('express');
const mysql   = require('mysql2');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host:     'localhost',
  user:     'root',
  password: 'happiness123#',
  database: 'neosure_anc'
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed:', err.message);
  } else {
    console.log('Connected to MySQL neosure_anc');
  }
});

app.post('/api/patient', (req, res) => {
  const {
    worker_id, full_name, phone_number, rch_id, age,
    lmp_date, gestational_age_weeks,
    previous_lscs, stillbirth_history, chronic_hypertension,
    diabetes, thyroid, height_cm, weight_kg,
    baseline_bp_systolic, baseline_bp_diastolic,
    twin_pregnancy, hiv_positive, syphilis_positive,
    severe_headache, vaginal_bleeding, blurred_vision,
    abdominal_pain, swelling_of_feet
  } = req.body;

  const bmi = (height_cm && weight_kg)
    ? parseFloat((weight_kg / ((height_cm / 100) ** 2)).toFixed(2))
    : null;

  db.query(
    `INSERT INTO patients (worker_id, full_name, phone_number, rch_id, age, lmp_date, gestational_age_weeks)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [worker_id, full_name, phone_number, rch_id, age, lmp_date, gestational_age_weeks],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const pid = result.insertId;
      Promise.all([
        db.promise().query(
          `INSERT INTO medical_baseline
            (patient_id, previous_lscs, stillbirth_history, chronic_hypertension,
             diabetes, thyroid, height_cm, weight_kg, baseline_bp_systolic, baseline_bp_diastolic, bmi)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pid, previous_lscs, stillbirth_history, chronic_hypertension,
           diabetes, thyroid, height_cm, weight_kg, baseline_bp_systolic, baseline_bp_diastolic, bmi]
        ),
        db.promise().query(
          `INSERT INTO current_status
            (patient_id, twin_pregnancy, hiv_positive, syphilis_positive,
             severe_headache, vaginal_bleeding, blurred_vision, abdominal_pain, swelling_of_feet)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [pid, twin_pregnancy, hiv_positive, syphilis_positive,
           severe_headache, vaginal_bleeding, blurred_vision, abdominal_pain, swelling_of_feet]
        )
      ])
      .then(() => res.status(201).json({ message: 'Patient saved!', patient_id: pid }))
      .catch(err => res.status(500).json({ error: err.message }));
    }
  );
});

app.get('/api/patients', (req, res) => {
  db.query(`SELECT * FROM patients`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/doctors', (req, res) => {
  const db2 = mysql.createConnection({
    host: 'localhost', user: 'root', password: 'happiness123#', database: 'neosure_health'
  });
  db2.query(`SELECT * FROM doctors`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
    db2.end();
  });
});

app.listen(8080, () => {
  console.log('🚀 NeoSure API running at http://localhost:8080');
});