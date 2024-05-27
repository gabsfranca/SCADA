import logo from './logo.svg';
import React, {useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [data, setData] = useState([])
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchdata = async () =>{
      let response;
      if (currentRoute === '/'){
        response = await fetch('http://172.31.0.248:8080/');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }

      }else if(currentRoute === '/ihm'){
        response = await fetch ('http://172.31.0.248:8080/ihm');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }

      }else if(currentRoute === '/clp'){
        response = await fetch ('http://172.31.0.248:8080/clp');
        if (response.ok){
          const json = await response.json();
          setData(json);
        }else{
          console.error('erro ao buscar mensagens', response.statusText);
        }
      }
    };

    fetchdata();
  },[currentRoute]);

  const TelaTCP = () => (
    <table>
      <thead>
        <tr>
          {data.length > 0 && Object.keys(data[0]).map((key) =>
            <th key={key}>{key}</th>
          )}

          <th>Excluir linha</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index)=>
          <tr key={index}>
            {Object.values(item).map((value, i)=>
              <td key={i}>{value}</td>
            )}
            <td>
              <button onClick={() => setCurrentRoute('/clp/delete')}>Excluir linha</button>
            </td>
          </tr>
        )}
      </tbody>
    </table>

    
  )

  return (
    <div className="App">
      <header className="Cabeçalho">
        <button onClick={() => setCurrentRoute('/')}>Tela Inicial</button>
        <button onClick={() => setCurrentRoute('/ihm')}>Tela IHM</button>
        <button onClick={() => setCurrentRoute('/clp')}>Tela CLP</button>
          <p>{message}</p>
      </header>
      <main>
        {currentRoute === '/clp' && <TelaTCP />}
      </main>
    </div>
  );
}

export default App;
