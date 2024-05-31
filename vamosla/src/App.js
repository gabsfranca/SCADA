import logo from './logo.svg';
import React, {useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentRoute, setCurrentRoute] = useState('/');
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [mostraDashboard, setMostraDashboard] = useState(false);
  const [dadosDashboard, setDadosDashboard] = useState([]);
  
  const mostraDadosDashboard = async () =>{
    try{
      const response = await fetch('/dashboard');
      if (response.ok){
        const data = await response.json();
        setDadosDashboard(data);
        setMostraDashboard(true);
      }else{
        console.error("erro ao buscar dados do dashboard: ", response.statusText);
      }
    }catch (error){
      console.error('erro ao fazer aquisião', error)
    }
  };
  
  useEffect(() => {
    const fetchdata = async () =>{
      let response;
      if (currentRoute === '/'){
        response = await fetch('http://localhost:8080/');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }
        
      }else if(currentRoute === '/ihm'){
        response = await fetch ('http://localhost:8080/ihm');
        if (response.ok) {
          const text = await response.text();
          setMessage(text);
        } else {
          console.error('Erro ao buscar tela inicial', response.statusText);
        }
        
      }else if(currentRoute === '/clp'){
        response = await fetch ('http://localhost:8080/clp');
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

  const handleDelete = async (id) =>{
    try{
      const response = await fetch(`/clp/delete?id=${id}`,{
        method: 'DELETE',
      });
      if (response.ok){
        const text = await response.text();
        setMessage(text)
        setData(data.filter(item => item.ID !== id));
      }else{
        console.error('erro ao excluir linha', response.statusText);
      }
    }catch(error){
      console.error('erro ao fazer requisição', error)
    }
  }

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
              <button onClick={() => handleDelete(item.ID)}>Excluir linha</button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )

  const Dashboard = () =>(
    <div>
      <h2>dados do dashboard:</h2>
      <ul>
        {mostraDadosDashboard.map((item, index) =>(
          <li key={index}>
            ID: {item.ID}, Msg: {item.Msg}, Timestamp: {item.TimeStamp}
        </li>
      ))}
     </ul>
    </div>
  );

  return (
    <div className="App">
      <header className="Cabeçalho">
        <button onClick={() => setCurrentRoute('/')}>Tela Inicial</button>
        <button onClick={() => setCurrentRoute('/ihm')}>Tela IHM</button>
        <button onClick={() => setCurrentRoute('/clp')}>Tela CLP</button>
        <button onClick={mostraDadosDashboard}>dashboard</button>
          <p>{message}</p>
      </header>
      <main>
        {currentRoute === '/clp' && <TelaTCP />}
        {mostraDashboard && <div>dados do dashboard</div>}
      </main>
    </div>
  );
}

export default App;
