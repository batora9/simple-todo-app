import Database from 'better-sqlite3';

const db = new Database('webken-9.db');

const createTweetTableQuery = db.prepare(`
CREATE TABLE tweets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`);

createTweetTableQuery.run();

const insertTweetQuery = db.prepare(`
INSERT INTO tweets (content, created_at) VALUES (?, ?);
`);

const getTweetsQuery = db.prepare(`
SELECT * FROM tweets;
`);

const deleteTweetQuery = db.prepare(`
DELETE FROM tweets WHERE id = ?;
`);

insertTweetQuery.run('今日はいい天気ですね', '2024-07-01 12:00:00');
insertTweetQuery.run('おなかがすいたなー', '2024-07-01 12:30:00');

console.log(getTweetsQuery.all());

deleteTweetQuery.run(1);

console.log(getTweetsQuery.all());
