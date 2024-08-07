import './App.css';
import './design.css';
import 'animate.css';
import React, { useState } from 'react';
import Context from './pages/Context';
// páginas.
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Passometro from './pages/Passometro';
import Usuarios from './pages/Usuarios';
import TransporteSanitario from './pages/TransporteSanitario';
import Motorista from './pages/Motorista';
import Indicadores from './pages/Indicadores';
// componentes.
import Toast from './components/Toast';
import Modal from './components/Modal';

function App() {
  // estados do context.
  const [toast, settoast] = useState({});
  const [dialogo, setdialogo] = useState({ id: 0, mensagem: '', funcao: null });
  const [usuario, setusuario] = useState({});
  const [pagina, setpagina] = useState(0);
  const [pacientes, setpacientes] = useState([]);
  const [transportes, settransportes] = useState([]);
  const [unidade, setunidade] = useState(null);
  const html = 'https://nirvana-api.up.railway.app/';

  return (
    <Context.Provider
      value={{
        toast, settoast,
        dialogo, setdialogo,
        usuario, setusuario,
        pagina, setpagina,
        pacientes, setpacientes,
        transportes, settransportes,
        unidade, setunidade,
        html,
      }}
    >
      <div>
        <Login></Login>
        <Pacientes></Pacientes>
        <Passometro></Passometro>
        <Usuarios></Usuarios>
        <TransporteSanitario></TransporteSanitario>
        <Motorista></Motorista>
        <Toast></Toast>
        <Modal></Modal>
        <Indicadores></Indicadores>
      </div>
    </Context.Provider>
  );
}

export default App;