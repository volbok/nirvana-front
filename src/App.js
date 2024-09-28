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
import Dashboard from './pages/Dashboard';
import moment from 'moment';

function App() {
  // estados do context.
  const [toast, settoast] = useState({});
  const [dialogo, setdialogo] = useState({ id: 0, mensagem: '', funcao: null });
  const [viewdatepicker, setviewdatepicker] = useState([]);
  const [datepicker1, setdatepicker1] = useState(moment().startOf('month').format('DD/MM/YYYY'));
  const [datepicker2, setdatepicker2] = useState(moment().format('DD/MM/YYYY'));
  const [arraydatas, setarraydatas] = useState([]);
  const [arraydados, setarraydados] = useState([]);
  const [usuario, setusuario] = useState({});
  const [pagina, setpagina] = useState(0);
  const [pacientes, setpacientes] = useState([]);
  const [transportes, settransportes] = useState([]);
  const [unidade, setunidade] = useState(null);
  const [mobilewidth, setmobilewidth] = useState(426);
  const [status, setstatus] = useState('TODOS');
  const [setor, setsetor] = useState('TODOS');
  const arraystatus = [
    {
      valor: 'VAGO',
      cor: '#aed6f1',
    },
    {
      valor: 'REAVALIAÇÃO VERDE',
      cor: '#a6acaf ',
    },
    {
      valor: 'REAVALIAÇÃO AMARELA',
      cor: '#a6acaf ',
    },
    {
      valor: 'REAVALIAÇÃO VERMELHA',
      cor: '#a6acaf ',
    },
    {
      valor: 'REAVALIAÇÃO CIRURGIA',
      cor: '#a6acaf ',
    },
    {
      valor: 'AIH',
      cor: '#85c1e9',
    },
    {
      valor: 'ALTA',
      cor: '#7dcea0',
    },
    {
      valor: 'CONTATO DIRETO',
      cor: '#7dcea0',
    },
    {
      valor: 'CERSAM',
      cor: '#7dcea0',
    },
    {
      valor: 'CONVÊNIOS',
      cor: '#7dcea0',
    },
    {
      valor: 'EMAD',
      cor: '#7dcea0',
    },
    {
      valor: 'TRANSFERIDOS',
      cor: '#7dcea0',
    },
    {
      valor: 'EVASÃO',
      cor: '#edbb99',
    },
    {
      valor: 'ÓBITO',
      cor: '#edbb99',
    },
    {
      valor: 'LIMBO',
      cor: '#edbb99',
    }
  ]
  const html = 'https://nirvana-api.up.railway.app/';

  return (
    <Context.Provider
      value={{
        toast, settoast,
        dialogo, setdialogo,
        viewdatepicker, setviewdatepicker,
        datepicker1, setdatepicker1,
        datepicker2, setdatepicker2,
        arraydatas, setarraydatas,
        arraydados, setarraydados,
        usuario, setusuario,
        pagina, setpagina,
        pacientes, setpacientes,
        transportes, settransportes,
        unidade, setunidade,
        mobilewidth, setmobilewidth,
        status, setstatus,
        setor, setsetor,
        arraystatus,
        html,
      }}
    >
      <div>
        <Login></Login>
        <Pacientes></Pacientes>
        <Passometro></Passometro>
        <Dashboard></Dashboard>
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