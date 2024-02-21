const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the test database.');
});

db.all(
  "SELECT name from sqlite_master WHERE type='table'",
  [],
  (err, tables) => {
    if (err) {
      throw err;
    }

    tables.forEach(({ name }) => {
      db.all(`PRAGMA table_info(name)`, [], (err, columns) => {
        if (err) {
          throw err;
        }

        app.get(`/api/collections/${name}`, (req, res) => {
          db.all(`SELECT * FROM ${name}`, [], (err, rows) => {
            if (err) {
              throw err;
            }
            res.json(rows);
          });
        });
      });
    });
  }
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
