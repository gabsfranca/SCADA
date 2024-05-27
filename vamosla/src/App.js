import logo from './logo.svg';
import React, {useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchdata = async () =>{
      let response;
      if (currentRoute === '/'){
        response = await fetch('http://192.168.0.178:8080/');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }

      }else if(currentRoute === '/ihm'){
        response = await fetch ('http://192.168.0.178:8080/ihm');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }

      }else if(currentRoute === '/clp'){
        response = await fetch ('http://192.168.0.178:8080/clp');
        if (response.ok){
          const text = await response.text();
          setMessage(text);
        }else{
          console.error('erro ao buscar mensagens', response.statusText);
        }
      }
    };

    fetchdata();
  },[currentRoute]);

  return (
    <div className="App">
      <header className="Cabeçalho">
        <button onClick={() => setCurrentRoute('/')}>Tela Inicial</button>
        <button onClick={() => setCurrentRoute('/ihm')}>Tela IHM</button>
        <button onClick={() => setCurrentRoute('/clp')}>Tela CLP</button>
          <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
