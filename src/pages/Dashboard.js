/* eslint eqeqeq: "off" */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import moment from 'moment';
import Chart from '../components/Chart';
import DatePicker from '../components/DatePicker';
// imagens.
import atualizar from '../images/refresh.svg';
import selector from '../functions/selector';
import back from '../images/back.svg'

function Dashboard() {

  // context.
  const {
    html,
    pagina,
    unidade,
    pacientes, setpacientes,
    setviewdatepicker,
    datepicker1, setdatepicker1,
    datepicker2, setdatepicker2,
    setarraydatas, arraydatas,
    mobilewidth,
    setpagina,
    // setarraydados,
  } = useContext(Context);

  const [arraydadosaih, setarraydadosaih] = useState([]);
  const [arraydadosalta, setarraydadosalta] = useState([]);
  const [arraydadosstatus, setarraydadosstatus] = useState([]);

  const [pacientes_aih, setpacientes_aih] = useState([]);
  const [pacientes_alta, setpacientes_alta] = useState([]);
  const [pacientes_emad, setpacientes_emad] = useState([]);
  const [pacientes_evasao, setpacientes_evasao] = useState([]);
  const [pacientes_contato, setpacientes_contato] = useState([]);
  const [pacientes_cersam, setpacientes_cersam] = useState([]);
  const [pacientes_obito, setpacientes_obito] = useState([]);

  useEffect(() => {
    if (pagina == 'DASHBOARD') {
      console.log('DASHBOARD');
      loadAllPacientes();
    }
  }, [pagina]);

  const loadAllPacientes = () => {
    axios.get(html + 'list_all_pacientes').then((response) => {
      var x = response.data.rows;
      setpacientes(x.filter(item => item.unidade_origem == unidade));
    });
  }

  function Resumo() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        flexWrap: 'wrap',
      }}>
        {arraystatus.map(valor => (
          <div
            className={'button weak'}
            key={'resumo ' + valor.valor}
            style={{
              width: window.innerWidth > mobilewidth ? 100 : '30vw',
              minWidth: window.innerWidth > mobilewidth ? 100 : '30vw',
              height: window.innerWidth > mobilewidth ? 100 : '30vw',
              fontSize: window.innerWidth > mobilewidth ? '' : 12,
              padding: 10,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              background: valor.cor,
            }}
          >
            <div>{valor.valor}</div>
            <div>
              {pacientes.filter(item => item.status == valor.valor).length}
            </div>
          </div>
        ))}
      </div>
    )
  }

  function FiltroDias() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className='text1'>PESQUISA: INTERVALO DE DIAS</div>
        <div id="intervalo de dias e predefiições" style={{
          display: 'flex',
          flexDirection: window.innerWidth > mobilewidth ? 'row' : 'column',
          justifyContent: 'center', flexWrap: 'wrap',
          width: '90vw', alignSelf: 'center',
        }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>DATA INICIAL</div>
            <div className='button weak' style={{ width: 150, alignSelf: 'center' }} onClick={() => setviewdatepicker(1)}>
              {datepicker1}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text1'>DATA FINAL</div>
            <div className='button weak' style={{ width: 150, alignSelf: 'center' }} onClick={() => setviewdatepicker(2)}>
              {datepicker2}
            </div>
          </div>
          <div className='button weak'
            style={{
              display: 'flex',
              maxHeight: 50,
              alignSelf: window.innerWidth < mobilewidth ? 'center' : 'flex-end',
              backgroundColor: 'rgb(229, 126, 52, 1)'
            }}
            onClick={() => {
              mountArrayDatas(datepicker1, datepicker2);
            }}>
            <img
              alt=""
              src={atualizar}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
          <div id="intervalos de dias predefinidos" style={{
            display: 'flex', flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div id="7 dias"
              className='button weak'
              style={{ width: 100, maxWidth: 100, maxHeight: 50, alignSelf: 'flex-end', marginLeft: 10 }}
              onClick={() => {
                setdatepicker1(moment().subtract(7, 'days').format('DD/MM/YYYY'))
                setdatepicker2(moment().format('DD/MM/YYYY'));
                mountArrayDatas(moment().subtract(7, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'));
                selector("intervalos de dias predefinidos", "7 dias", 3000);
              }}
            >
              ÚLTIMOS 7 DIAS
            </div>
            <div id="15 dias"
              className='button weak'
              style={{ width: 100, maxWidth: 100, maxHeight: 50, alignSelf: 'flex-end' }}
              onClick={() => {
                setdatepicker1(moment().subtract(15, 'days').format('DD/MM/YYYY'))
                setdatepicker2(moment().format('DD/MM/YYYY'));
                mountArrayDatas(moment().subtract(15, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'));
                selector("intervalos de dias predefinidos", "15 dias", 3000);
              }}
            >
              ÚLTIMOS 15 DIAS
            </div>
            <div id="30 dias"
              className='button weak'
              style={{ width: 100, maxWidth: 100, maxHeight: 50, alignSelf: 'flex-end' }}
              onClick={() => {
                setdatepicker1(moment().subtract(30, 'days').format('DD/MM/YYYY'))
                setdatepicker2(moment().format('DD/MM/YYYY'));
                mountArrayDatas(moment().subtract(15, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'));
                selector("intervalos de dias predefinidos", "30 dias", 3000);
              }}
            >
              ÚLTIMOS 30 DIAS
            </div>
            <div id="60 dias"
              className='button weak'
              style={{ width: 100, maxWidth: 100, maxHeight: 50, alignSelf: 'flex-end' }}
              onClick={() => {
                setdatepicker1(moment().subtract(60, 'days').format('DD/MM/YYYY'))
                setdatepicker2(moment().format('DD/MM/YYYY'));
                mountArrayDatas(moment().subtract(60, 'days').format('DD/MM/YYYY'), moment().format('DD/MM/YYYY'));
                selector("intervalos de dias predefinidos", "60 dias", 3000);
              }}
            >
              ÚLTIMOS 60 DIAS
            </div>
          </div>
        </div>
      </div>
    )
  }

  function FiltroMeses() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className='text1'>PESQUISA: INTERVALO DE ANOS E MESES</div>
        <div id='seletores para anos e meses' style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignContent: 'center',
        }}>
          <AnosSelector></AnosSelector>
          <MesesSelector></MesesSelector>
        </div>
      </div>
    )
  }

  const mountArrayDatas = (datainicial, datafinal) => {
    setarraydatas([]);
    let localarraydatas = []
    let datainicio = moment(datainicial, 'DD/MM/YYYY');
    let datatermino = moment(datafinal, 'DD/MM/YYYY');
    while (datainicio <= datatermino) {
      localarraydatas.push(datainicio.format('DD/MM/YY'));
      datainicio = datainicio.add(1, 'day');
    }
    setarraydatas(localarraydatas);
    // console.log(localarraydatas);
    mountArrayDadosVersusDatas(localarraydatas, 'AIH TRANSFERIDO', setarraydadosaih);
    mountArrayDadosVersusDatas(localarraydatas, 'ALTA', setarraydadosalta);
    mountArrayDadosVersusStatus(datainicial, datafinal);
  }

  const [ano, setano] = useState();
  const [mesinicial, setmesinicial] = useState(null);
  const [mesfinal, setmesfinal] = useState(null);

  let arrayanos = [
    moment().subtract(2, 'years').format('YYYY'),
    moment().subtract(1, 'year').format('YYYY'),
    moment().format('YYYY'),
    moment().add(1, 'year').format('YYYY'),
    moment().add(2, 'years').format('YYYY'),
  ]

  let arraymeses = [
    {
      mes: 'JAN',
      numero: 1
    },
    {
      mes: 'FEV',
      numero: 2
    },
    {
      mes: 'MAR',
      numero: 3
    },
    {
      mes: 'ABR',
      numero: 4
    },
    {
      mes: 'MAI',
      numero: 5
    },
    {
      mes: 'JUN',
      numero: 6
    },
    {
      mes: 'JUL',
      numero: 7
    },
    {
      mes: 'AGO',
      numero: 8
    },
    {
      mes: 'SET',
      numero: 9
    },
    {
      mes: 'OUT',
      numero: 10
    },
    {
      mes: 'NOV',
      numero: 11
    },
    {
      mes: 'DEZ',
      numero: 12
    }
  ]
  function AnosSelector() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center',
        alignSelf: 'center'
      }}>
        {arrayanos.map(item => (
          <div
            className={ano == item ? 'button strong blinkbordas' : 'button weak'}
            key={'ANOS - ' + item}
            style={{ width: 70 }}
            onClick={() => {
              setano(item);
              // console.log(item);
            }}
          >
            {item}
          </div>
        ))}
      </div>
    )
  }

  function MesesSelector() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
        justifyContent: 'center', alignSelf: 'center',
        flexWrap: 'wrap', width: '80vw'
      }}>
        {arraymeses.map(item => (
          <div
            className={mesinicial == item.numero || mesfinal == item.numero ? 'button strong blinkbordas' : 'button weak'}
            key={'MES - ' + item.numero}
            style={{ width: 60 }}
            onClick={() => {
              if (mesinicial == null) {
                setmesinicial(item.numero);
                localStorage.setItem('inicio', item.numero);
              } else if (mesinicial != null && mesfinal == null) {
                setmesfinal(item.numero);
                localStorage.setItem('final', item.numero);
                mountArrayMeses(localStorage.getItem("inicio"), localStorage.getItem("final"));
              } else if (mesinicial != null && mesfinal != null) {
                setmesinicial(null);
                setmesfinal(null);
              }
            }}
          >
            {item.mes}
          </div>
        ))}
      </div>
    )
  }

  const [array_meses, setarray_meses] = useState([]);
  const mountArrayMeses = (inicio, final) => {
    let mesinicio = moment(inicio + '/' + ano, 'M/YYYY');
    let localarraymeses = [];
    localarraymeses.push(mesinicio.format('MM/YYYY'));

    while (parseInt(inicio) < parseInt(final)) {
      mesinicio = mesinicio.add(1, 'month');
      localarraymeses.push(mesinicio.format('MM/YYYY'));
      inicio = parseInt(inicio) + parseInt(1);
    }

    // console.log(localarraymeses);
    setarray_meses(localarraymeses);
    mountpacientes_status_mes(localarraymeses, 'AIH TRANSFERIDO', setpacientes_aih);
    mountpacientes_status_mes(localarraymeses, 'CONTATO DIRETO TRANSFERIDO', setpacientes_contato);
    mountpacientes_status_mes(localarraymeses, 'ALTA', setpacientes_alta);
    mountpacientes_status_mes(localarraymeses, 'EMAD TRANSFERIDO', setpacientes_emad);
    mountpacientes_status_mes(localarraymeses, 'CERSAM TRANSFERIDO', setpacientes_cersam);
    mountpacientes_status_mes(localarraymeses, 'EVASÃO', setpacientes_evasao);
    mountpacientes_status_mes(localarraymeses, 'ÓBITO', setpacientes_obito);
  }

  const mountpacientes_status_mes = (arraymeses, status, setdados) => {
    let localarray = []
    arraymeses.map(mes => localarray.push(pacientes.filter(paciente => paciente.status == status && moment(paciente.passometro_data, 'DD/MM/YYYY - HH:mm').format('MM/YYYY') == mes).length));
    // console.log(localarray);
    setdados(localarray);
  }

  const mountArrayDadosVersusDatas = (arraydatas, status, setarraydados) => {
    setarraydados([]);
    let localarraydados = [];
    arraydatas.map(item => localarraydados.push(pacientes.filter(paciente => moment(paciente.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY') == item && paciente.status.includes(status)).length));
    setarraydados(localarraydados);
  }


  let arraystatus = [
    {
      valor: 'ALTA',
      legenda: 'ALTA',
      cor: '#52be80',
    },
    {
      valor: 'AIH TRANSFERIDO',
      legenda: 'AIH',
      cor: '#85c1e9',
    },
    {
      valor: 'EMAD TRANSFERIDO',
      legenda: 'EMAD',
      cor: '#bb8fce',
    },
    {
      valor: 'EVASÃO',
      legenda: 'EVASÃO',
      cor: '#f7dc6f',
    },
    {
      valor: 'CONTATO DIRETO TRANSFERIDO',
      legenda: 'CONTATO DIRETO',
      cor: '#58d68d',
    },
    {
      valor: 'CERSAM TRANSFERIDO',
      legenda: 'CERSAM',
      cor: '#af7ac5',
    },
    {
      valor: 'ÓBITO',
      legenda: 'ÓBITO',
      cor: '#000000',
    },
  ]
  const mountArrayDadosVersusStatus = (datainicio, datatermino) => {
    console.log(datainicio);
    console.log(datatermino);
    let localpacientesperiodo = pacientes.filter(item => moment(item.passometro_data, 'DD/MM/YYYY') > moment(datainicio, 'DD/MM/YYYY') && moment(item.passometro_data, 'DD/MM/YYYY') < moment(datatermino, 'DD/MM/YYYY'));
    console.log(localpacientesperiodo);
    let localarraydadosstatus = [];
    arraystatus.map(status => {
      localarraydadosstatus.push(localpacientesperiodo.filter(paciente => paciente.status == status.valor).length);
      return null;
    })
    setarraydadosstatus(localarraydadosstatus);
    // console.log(localarraydadosstatus);
  }

  const ChartsDias = useCallback(() => {
    return (
      <div id='charts dias' style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {Chart('bar', 'AIH', '#52be80', arraydadosaih, arraydatas, 1,
            arraydatas.length < 11 && window.innerWidth > mobilewidth ? 0.5 * window.innerWidth : 0.8 * window.innerWidth
          )}
          {Chart('bar', 'ALTA', '#85c1e9', arraydadosalta, arraydatas, 1,
            arraydatas.length < 11 && window.innerWidth > mobilewidth ? 0.5 * window.innerWidth : 0.8 * window.innerWidth
          )}
          {Chart('line', ['AIH', 'ALTA'], ['#52be80', '#85c1e9'],
            [
              {
                name: 'AIH',
                type: 'line',
                data: arraydadosaih,
              },
              {
                name: 'ALTA',
                type: 'line',
                data: arraydadosalta,
              },
            ],
            arraydatas, 0,
            arraydatas.length < 11 && window.innerWidth > mobilewidth ? 0.5 * window.innerWidth : 0.8 * window.innerWidth
          )}
          {Chart('donut', 'DESFECHOS', arraystatus.map(item => item.cor), arraydadosstatus, arraystatus.map(item => item.legenda), 1,
            window.innerWidth > mobilewidth ? 0.5 * window.innerWidth : 0.8 * window.innerWidth)}
        </div>
      </div>
    )
  }, [arraydatas, arraydadosaih, arraydadosalta, arraydadosstatus, mobilewidth])

  return (
    <div
      className='scroll'
      style={{
        display: pagina == 'DASHBOARD' ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: '#f2f2f2',
        height: 'calc(100vh - 10px)', width: 'calc(100Avw - 20px)',
        overflowY: 'scroll',
        borderStyle: 'solid', borderColor: '#f2f2f2',
        borderWidth: 5,
        borderRadius: 0,
        position: 'relative',
      }}>
      <div id="dashboard"
        style={{
          display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
          <div className='text1' style={{ fontSize: 24 }}>{unidade + ' EM NÚMEROS'}</div>
          <div
            style={{ display: 'flex' }}
            className='button'
            onClick={() => {
              setpagina('PASSOMETRO');
            }} title="VOLTAR">
            <img
              alt=""
              src={back}
              style={{
                margin: 10,
                height: 30,
                width: 30,
              }}
            ></img>
          </div>
        </div>
        <Resumo></Resumo>
        <FiltroDias></FiltroDias>
        <ChartsDias></ChartsDias>
        <FiltroMeses></FiltroMeses>
        {Chart('line', arraystatus.map(item => item.legenda), arraystatus.map(item => item.cor), [
          {
            name: 'AIH',
            type: 'line',
            data: pacientes_aih,
          },
          {
            name: 'ALTA',
            type: 'area',
            data: pacientes_alta,
          },
          {
            name: 'EMAD',
            type: 'line',
            data: pacientes_emad,
          },
          {
            name: 'EVASÃO',
            type: 'line',
            data: pacientes_evasao,
          },
          {
            name: 'CONTATO DIRETO',
            type: 'line',
            data: pacientes_contato,
          },
          {
            name: 'CERSAM',
            type: 'line',
            data: pacientes_cersam,
          },
          {
            name: 'ÓBITO',
            type: 'line',
            data: pacientes_obito,
          },
        ], array_meses, 0, 0.8 * window.innerWidth)}
        <DatePicker ></DatePicker>
      </div>

    </div >
  );
}

export default Dashboard
