package main

import (
	"database/sql"
	"fmt"
)

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
	fmt.Printf("excluindo a linha %d", id)
	result, err := db.Exec(`DELETE FROM msgs WHERE id = ?`, id)
	if err != nil {
		fmt.Println("erro", err)
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		fmt.Println("erro ao contar linhas", err)
		return err
	}
	if rowsAffected == 0 {
		fmt.Println("nao deu boa piá", err)
		return fmt.Errorf("não foi possivel encontrar a linha %d para a exclusão", id)
	}
	fmt.Printf("linha %d afetada: ", id)
	return nil
}
