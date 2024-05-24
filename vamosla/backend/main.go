package main

import (
	"fmt"
	"net/http"

	"github.com/rs/cors"
)

func oiee(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "oieeee")
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/oiee", oiee)

	corshandler := cors.Default().Handler(mux)

	fmt.Println("8080")
	if err := http.ListenAndServe(":8080", corshandler); err != nil {
		fmt.Println("ERROOO NAO COMEÇOU O SV: \n", err)
	}

}
