package main

import (
	"fmt"
	"log"
	"net"
	"time"
)

type Server struct {
	listenAddr string
	ln         net.Listener
	quitch     chan struct{}
}

func NewServer(listenAddr string) *Server {
	return &Server{
		listenAddr: listenAddr,
		quitch:     make(chan struct{}),
	}
}

func (s *Server) Start() error {
	ln, err := net.Listen("tcp", s.listenAddr)
	if err != nil {
		log.Println("erro ao iniciar o servidor", err)
		return err
	}
	defer ln.Close()
	s.ln = ln

	go s.acceptLoop()
	fmt.Println("esperando...")

	<-s.quitch

	return nil
}

func (s *Server) handleconn(conn net.Conn) {
	defer conn.Close()

	buffer := make([]byte, 2048)
	for {
		n, err := conn.Read(buffer)
		if err != nil {
			fmt.Println("ERRO DE NOVO CARALHO", err)
			return
		}

		msg := string(buffer[:n])
		fmt.Println("recebida: ", msg)

		if msg == "" {
			fmt.Println("ta vazio kkkk")
			return
		}

		timestamp := time.Now().Format(time.RFC3339)

		db, err := initDB()
		if err != nil {
			fmt.Println("erro: ", err)
			return
		}

		defer db.Close()

		err = addMSG(db, msg, timestamp)
		if err != nil {
			fmt.Println("erro:", err)
			return
		}

		fmt.Println("msg salva")

	}

}

func (s *Server) acceptLoop() {
	for {
		conn, err := s.ln.Accept()
		if err != nil {
			fmt.Println("erro de aceitação:", err)
			continue
		}

		fmt.Println("conectado com sucesso: ", conn.RemoteAddr())

		go s.handleconn(conn)
	}
}
