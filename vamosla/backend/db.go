package main

import "database/sql"

func initDB() (*sql.DB, error) {
	db, err := sql.Open("sqlite3", "./webapp.db")
	if err != nil {
		return nil, err
	}
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS msgs(
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		msg TEXT NOT NULL,
		timestamp DATE NOT NULL
	)
`)
	if err != nil {
		return nil, err
	}

	return db, nil

}

func addMSG(db *sql.DB, msg, timestamp string) error {
	_, err := db.Exec("INSERT INTO msgs (msg, timestamp) VALUES(?, ?)", msg, timestamp)
	return err
}

func DeletaLinha(db *sql.DB, id int) error {
	_, err := db.Exec(`DELETE FROM msgs WHERE id = (?)`, id)
	return err
}
