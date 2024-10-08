/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import moment from 'moment';
// funções.
import toast from '../functions/toast';
import modal from '../functions/modal';
// imagens.
import power from '../images/power.svg';
import back from '../images/back.svg';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import novo from '../images/novo.svg';
import people from '../images/people.svg';
import imprimir from '../images/imprimir.svg';
import alerta from '../images/alerta.svg';
import pbh from '../images/pbh.svg';
import modo_edicao from '../images/passometro_edicao.svg';
import modo_visualizacao from '../images/passometro_visualizacao.svg';
import lupa from '../images/lupa.svg';
import dots from '../images/dots.svg';
import Filter from '../components/Filter';

function Passometro() {

  // context.
  const {
    html,
    usuario,
    pagina, setpagina,
    arraystatus,
    pacientes, setpacientes,
    settoast,
    setdialogo,
    unidade,
    mobilewidth,
    status, setstatus,
    setor, setsetor,
  } = useContext(Context);

  // carregar lista de pacientes internados.
  const [arraypacientes, setarraypacientes] = useState(pacientes);
  const loadPacientes = (status, setor) => {
    axios.get(html + 'list_pacientes').then((response) => {
      var x = response.data.rows;
      filtermanager(x, status, setor);
    });
  }

  const loadPacientesOnStart = () => {
    let xarray = [];
    let xarraysetor = ['SE', 'UDC', 'OBS 1', 'OBS 2', 'OBS 3', 'SE PED', 'OBS PED'];
    // carregando todos os registros em todos os setores, sem filtro por status.
    axios.get(html + 'list_pacientes').then((response) => {
      var x = response.data.rows;
      setpacientes(x);
      // inserindo em seguida os leitos em texto (cadeira, maca baixa, etc.).
      xarraysetor.map(valor => x.filter(item => item.setor_origem == valor && isNaN(item.passometro_leito) == true).sort((a, b) => a.passometro_leito < b.passometro_leito ? 1 : -1).map(item => xarray.push(item)));
      // inserindo primeiro os leitos numéricos.
      xarraysetor.map(valor => x.filter(item => item.setor_origem == valor && isNaN(item.passometro_leito) == false).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => xarray.push(item)));
      setarraypacientes(xarray.filter(item =>
      (
        item.status == 'VAGO' ||
        item.status.includes('REAVALIAÇÃO') == true ||
        item.status.includes('AUTORIZADO') == true ||
        item.status == 'AIH' ||
        item.status == 'CONTATO DIRETO' ||
        item.status == 'CERSAM' ||
        item.status == 'CONVÊNIOS' ||
        item.status == 'EMAD'
      )
      ).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    });
  }

  const filtermanager = (array, status, setor) => {
    setpacientes(array);
    if (status == 'TODOS' && setor != 'TODOS') {
      let xarray = [];
      // inserindo em seguida os leitos em texto (cadeira, maca baixa, etc.).
      arraypassometrosetor.map(valor => array.filter(item => item.setor_origem == valor.valor && isNaN(item.passometro_leito) == true).sort((a, b) => a.passometro_leito < b.passometro_leito ? 1 : -1).map(item => xarray.push(item)));
      // inserindo primeiro os leitos numéricos.
      arraypassometrosetor.map(valor => array.filter(item => item.setor_origem == valor.valor && isNaN(item.passometro_leito) == false).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => xarray.push(item)));
      setarraypacientes(xarray.filter(item => item.setor_origem == setor &&
        (
          item.status == 'VAGO' ||
          item.status.includes('REAVALIAÇÃO') == true ||
          item.status.includes('AUTORIZADO') == true ||
          item.status == 'AIH' ||
          item.status == 'CONTATO DIRETO' ||
          item.status == 'CERSAM' ||
          item.status == 'CONVÊNIOS' ||
          item.status == 'EMAD'
        )
      ).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    } else if (status != 'TODOS' && status != 'TRANSFERIDOS' && setor == 'TODOS') {
      setarraypacientes(array.filter(item => item.status == status).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    } else if (status == 'TODOS' && setor == 'TODOS') {
      let xarray = [];
      // inserindo em seguida os leitos em texto (cadeira, maca baixa, etc.).
      arraypassometrosetor.map(valor => array.filter(item => item.setor_origem == valor.valor && isNaN(item.passometro_leito) == true).sort((a, b) => a.passometro_leito < b.passometro_leito ? 1 : -1).map(item => xarray.push(item)));
      // inserindo primeiro os leitos numéricos.
      arraypassometrosetor.map(valor => array.filter(item => item.setor_origem == valor.valor && isNaN(item.passometro_leito) == false).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => xarray.push(item)));
      setarraypacientes(xarray.filter(item =>
        item.status == 'VAGO' ||
        item.status.includes('REAVALIAÇÃO') == true ||
        item.status.includes('AUTORIZADO') == true ||
        item.status == 'AIH' ||
        item.status == 'CONTATO DIRETO' ||
        item.status == 'CERSAM' ||
        item.status == 'CONVÊNIOS' ||
        item.status == 'EMAD'
      ).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    } else if (status == 'TRANSFERIDOS') {
      toast(settoast, 'EXIBINDO PACIENTES LIBERADOS NAS ÚLTIMAS 48H', '#52be80', 5000);
      setarraypacientes(array.filter(item => item.status.includes('TRANSFERIDO') == true).filter(item => moment(item.passometro_data, 'DD/MM/YYYY - HH:mm') > moment().subtract(2, 'days')).sort((a, b) => moment(a.passometro_data, 'DD/MM/YYYY - HH:mm') > moment(b.passometro_data, 'DD/MM/YYYY - HH:mm') ? -1 : 1));
    } else {
      setarraypacientes(array.filter(item => item.status == status && item.setor_origem == setor).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    }
  }

  const filterassistenciasocial = () => {
    axios.get(html + 'list_pacientes').then((response) => {
      var x = response.data.rows;
      setarraypacientes(x.filter(item => (
        item.status == 'AIH' ||
        item.status == 'CONTADO DIRETO' ||
        item.staatus == 'CERSAM' ||
        item.status == 'CONVÊNIOS' ||
        item.status == 'EMAD'
      )
        && item.setor_origem != null && (item.passometro_vulnerabilidade != 0 || item.passometro_cersam != 0)).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1));
    });
  }

  // inserir registro de pacientes.
  const insertPaciente = () => {
    obj = {
      aih: null,
      procedimento: null,
      unidade_origem: unidade,
      setor_origem: setor == null ? 'UDC' : setor,
      nome_paciente: null,
      nome_mae: null,
      dn_paciente: null,
      status: status == 'TODOS' ? 'REAVALIAÇÃO' : status,
      unidade_destino: null,
      setor_destino: null,
      indicador_data_cadastro: null,
      indicador_data_confirmacao: null,
      indicador_relatorio: null,
      indicador_solicitacao_transporte: null,
      indicador_saida_origem: null,
      indicador_chegada_destino: null,
      dados_susfacil: null,
      exames_ok: null,
      aih_ok: null,
      glasgow: null,
      pas: null,
      pad: null,
      fc: null,
      fr: null,
      sao2: null,
      ofertao2: null,
      tipo_leito: 'ENF',
      contato_nome: null,
      contato_telefone: null,
      leito_destino: null,
      passometro_leito: null,
      passometro_situacao: '',
      passometro_breve_historico: '',
      passometro_avaliacao: '',
      passometro_recomendacao: '',
      passometro_peso: '',
      passometro_notificacao_srag: 0,
      passometro_notificacao_dengue: 0,
      passometro_checklist_teste_covid: 0,
      passometro_checklist_teste_dengue: 0,
      passometro_checklist_evolucao: 0,
      passometro_checklist_prescricao: 0,
      passometro_checklist_laboratorio: 0,
      passometro_checklist_rx: 0,
      passometro_setor: setor,
      passometro_data: moment().format('DD/MM/YYYY - HH:mm'),
      passometro_vulnerabilidade: 0,
      passometro_cersam: 0,
      tag: 'TAG',
      passometro_responsavel: '',
    }
    axios.post(html + 'insert_paciente/', obj).then(() => {
      loadPacientes(status, setor);
    });
  }

  // excluir registro de pacientes.
  const deletePaciente = (id) => {
    axios.get(html + 'delete_paciente/' + id).then(() => {
      loadPacientes(status, setor);
    });
  }

  var obj = {}
  // atualizar registro de pacientes.
  const updatePaciente = (item, id) => {

    if (smartlist == 0) {
      obj = {
        aih: item.aih,
        procedimento: item.procedimento,
        unidade_origem: item.unidade_origem,
        setor_origem: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
        nome_paciente: document.getElementById("campotexto - nome_paciente - " + id).value.toUpperCase(),
        nome_mae: item.nome_mae,
        dn_paciente: item.dn_paciente,
        status: document.getElementById("camposelecao - status - " + id).innerHTML,
        unidade_destino: item.unidade_destino,
        setor_destino: item.setor_destino,
        indicador_data_cadastro: item.indicador_data_cadastro,
        indicador_data_confirmacao: item.indicador_data_confirmacao,
        indicador_relatorio: item.indicador_relatorio,
        indicador_solicitacao_transporte: item.indicador_solicitacao_transporte,
        indicador_saida_origem: item.indicador_saida_origem,
        indicador_chegada_destino: item.indicador_chegada_destino,
        dados_susfacil: item.dados_susfacil,
        exames_ok: item.exames_ok,
        aih_ok: item.aih_ok,
        glasgow: item.glasgow,
        pas: item.pas,
        pad: item.pad,
        fc: item.fc,
        fr: item.fr,
        sao2: item.sao2,
        ofertao2: item.ofertao2,
        tipo_leito: document.getElementById("camposelecao - tipo_leito - " + id).innerHTML,
        contato_nome: item.contato_nome,
        contato_telefone: item.contato_telefone,
        leito_destino: item.leito_destino,
        passometro_leito: document.getElementById("campotexto - passometro_leito - " + id).value.toUpperCase(),
        passometro_situacao: document.getElementById("campotexto - passometro_situacao - " + id).value.toUpperCase(),
        passometro_breve_historico: document.getElementById("campotexto - passometro_breve_historico - " + id).value.toUpperCase(),
        passometro_avaliacao: document.getElementById("campotexto - passometro_avaliacao - " + id).value.toUpperCase(),
        passometro_recomendacao: document.getElementById("campotexto - passometro_recomendacao - " + id).value.toUpperCase(),
        passometro_peso: item.passometro_peso,
        passometro_notificacao_srag: document.getElementById("check - passometro_notificacao_srag - " + id).innerHTML,
        passometro_notificacao_dengue: document.getElementById("check - passometro_notificacao_dengue - " + id).innerHTML,
        passometro_checklist_teste_covid: document.getElementById("check - passometro_checklist_teste_covid - " + id).innerHTML,
        passometro_checklist_teste_dengue: document.getElementById("check - passometro_checklist_teste_dengue - " + id).innerHTML,
        passometro_checklist_evolucao: document.getElementById("check - passometro_checklist_evolucao - " + id).innerHTML,
        passometro_checklist_prescricao: document.getElementById("check - passometro_checklist_prescricao - " + id).innerHTML,
        passometro_checklist_laboratorio: document.getElementById("check - passometro_checklist_laboratorio - " + id).innerHTML,
        passometro_checklist_rx: document.getElementById("check - passometro_checklist_rx - " + id).innerHTML,
        passometro_setor: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
        passometro_data: item.passometro_data,
        passometro_vulnerabilidade: document.getElementById("check - passometro_vulnerabilidade - " + id).innerHTML,
        passometro_cersam: document.getElementById("check - passometro_cersam - " + id).innerHTML,
        tag: document.getElementById("camposelecao - tag - " + id).innerHTML,
        passometro_responsavel: document.getElementById("campotexto - passometro_responsavel - " + id).value.toUpperCase(),
      }
    } else {
      obj = {
        aih: item.aih,
        procedimento: item.procedimento,
        unidade_origem: item.unidade_origem,
        setor_origem: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
        nome_paciente: document.getElementById("campotexto - nome_paciente - " + id).value.toUpperCase(),
        nome_mae: item.nome_mae,
        dn_paciente: item.dn_paciente,
        status: document.getElementById("camposelecao - status - " + id).innerHTML,
        unidade_destino: item.unidade_destino,
        setor_destino: item.setor_destino,
        indicador_data_cadastro: item.indicador_data_cadastro,
        indicador_data_confirmacao: item.indicador_data_confirmacao,
        indicador_relatorio: item.indicador_relatorio,
        indicador_solicitacao_transporte: item.indicador_solicitacao_transporte,
        indicador_saida_origem: item.indicador_saida_origem,
        indicador_chegada_destino: item.indicador_chegada_destino,
        dados_susfacil: item.dados_susfacil,
        exames_ok: item.exames_ok,
        aih_ok: item.aih_ok,
        glasgow: item.glasgow,
        pas: item.pas,
        pad: item.pad,
        fc: item.fc,
        fr: item.fr,
        sao2: item.sao2,
        ofertao2: item.ofertao2,
        tipo_leito: document.getElementById("camposelecao - tipo_leito - " + id).innerHTML,
        contato_nome: item.contato_nome,
        contato_telefone: item.contato_telefone,
        leito_destino: item.leito_destino,
        passometro_leito: document.getElementById("campotexto - passometro_leito - " + id).value.toUpperCase(),
        passometro_situacao: document.getElementById("campotexto - passometro_situacao - " + id).value.toUpperCase(),
        passometro_breve_historico: document.getElementById("campotexto - passometro_breve_historico - " + id).value.toUpperCase(),
        passometro_avaliacao: document.getElementById("campotexto - passometro_avaliacao - " + id).value.toUpperCase(),
        passometro_recomendacao: document.getElementById("campotexto - passometro_recomendacao - " + id).value.toUpperCase(),
        passometro_peso: item.passometro_peso,
        passometro_notificacao_srag: document.getElementById("check - passometro_notificacao_srag - " + id).innerHTML,
        passometro_notificacao_dengue: document.getElementById("check - passometro_notificacao_dengue - " + id).innerHTML,
        passometro_checklist_teste_covid: document.getElementById("check - passometro_checklist_teste_covid - " + id).innerHTML,
        passometro_checklist_teste_dengue: document.getElementById("check - passometro_checklist_teste_dengue - " + id).innerHTML,
        passometro_checklist_evolucao: document.getElementById("check - passometro_checklist_evolucao - " + id).innerHTML,
        passometro_checklist_prescricao: document.getElementById("check - passometro_checklist_prescricao - " + id).innerHTML,
        passometro_checklist_laboratorio: document.getElementById("check - passometro_checklist_laboratorio - " + id).innerHTML,
        passometro_checklist_rx: document.getElementById("check - passometro_checklist_rx - " + id).innerHTML,
        passometro_setor: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
        passometro_data: item.passometro_data,
        passometro_vulnerabilidade: document.getElementById("check - passometro_vulnerabilidade - " + id).innerHTML,
        passometro_cersam: document.getElementById("check - passometro_cersam - " + id).innerHTML,
        tag: document.getElementById("camposelecao - tag - " + id).innerHTML,
        passometro_responsavel: document.getElementById("campotexto - passometro_responsavel - " + id).value.toUpperCase(),
      }
    }
    axios.post(html + 'update_paciente/' + id, obj).then(() => {
      console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
    });
  }

  var timeout = null;
  var interval = null;

  // opção coringa para facilitar corrida de leitos do horizontal.
  const [horizontal, sethorizontal] = useState(0);
  const [smartlist, setsmartlist] = useState(0);
  useEffect(() => {
    if (pagina == 'PASSOMETRO') {
      console.log(usuario.tipo);
      if (usuario.tipo.includes('HORIZONTAL')) {
        sethorizontal(1);
      } else {
        sethorizontal(0);
      }
      loadSetores();
      loadPacientesOnStart();
    }
    // eslint-disable-next-line
  }, [pagina]);

  // interval para atualização automática das listas.
  const [refreshinterval, setrefreshinterval] = useState(null);
  useEffect(() => {
    if (pagina == 'PASSOMETRO') {
      clearInterval(refreshinterval);
      setrefreshinterval(setInterval(() => {
        console.log('ATUALIZANDO LISTA');
        console.log('SETOR: ' + setor);
        console.log('SETOR: ' + status);
        loadPacientes(status, setor);
      }, 300000)); // 300 segundos (5 minutos).
    }
  }, [setor, status]);

  // identificação do usuário.
  function Usuario() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
      }}>
        <div className='button-red'
          onClick={() => window.location.reload()}
          title="SAIR">
          <img
            alt=""
            src={power}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div className='button'
          style={{
            display: window.innerWidth > mobilewidth ? 'flex' : 'none',
          }}
          onClick={() => printDiv()} title="IMPRIMIR PASSÔMETRO">
          <img
            alt=""
            src={imprimir}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div className='button' onClick={() => setpagina('USUARIOS')} title="CADASTRO DE USUÁRIOS"
          style={{
            position: 'relative',
            display: horizontal == 1 ? 'flex' : 'none',
          }}
        >
          <img
            alt=""
            src={people}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
          <div
            className={smartlist == 1 ? 'button-green' : 'button-red'}
            onClick={(e) => {
              if (smartlist == 0) {
                setsmartlist(1);
                setstatus('TODOS');
                setsetor('TODOS');
                loadPacientes('TODOS', 'TODOS');
              } else {
                setsmartlist(0);
                setstatus('TODOS');
                setsetor('TODOS');
                loadPacientes('TODOS', 'TODOS');
              }
              e.stopPropagation();
            }}
            style={{
              display: window.innerWidth > mobilewidth ? 'flex' : 'none',
              position: 'absolute',
              right: -20, bottom: -20,
              borderRadius: 50,
              width: 10, minWidth: 10, maxWidth: 10,
              height: 10, minHeight: 10, maxHeight: 10,
              borderWidth: 5,
              borderStyle: 'solid',
              borderColor: '#f2f2f2',
            }}>
          </div>
        </div>
        <div className='text1'>{usuario.nome}</div>
      </div>
    )
  }

  function ModoButton() {
    return (
      <div
        className='button'
        onClick={() => {
          if (modo == 1) {
            setmodo(0);
          } else {
            changePages(5, 5000);
            setmodo(1);
          }
        }}
        style={{
          display: horizontal == 1 ? 'flex' : 'none',
          width: 50, maxWidth: 50,
          height: 50, maxHeight: 50,
          alignSelf: 'flex-end',
        }}
      >
        <img
          alt=""
          src={modo == 0 ? modo_edicao : modo_visualizacao}
          style={{
            margin: 10,
            height: 40,
            width: 40,
          }}
        ></img>
      </div>
    )
  }

  const [filterpaciente, setfilterpaciente] = useState('');
  var searchpaciente = '';
  const filterPaciente = () => {
    clearTimeout(timeout);
    document.getElementById("searchPaciente").focus();
    searchpaciente = document.getElementById("searchPaciente").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchpaciente == '') {
        setfilterpaciente('');
        setarraypacientes(pacientes);
        document.getElementById("searchPaciente").value = '';
        setTimeout(() => {
          document.getElementById("searchPaciente").focus();
        }, 100);
      } else {
        setfilterpaciente(searchpaciente);
        setarraypacientes(pacientes.filter(item => item.nome_paciente != null && item.nome_paciente.includes(searchpaciente) == true));
        document.getElementById("searchPaciente").value = searchpaciente;
        setTimeout(() => {
          document.getElementById("searchPaciente").focus();
        }, 100);
      }
    }, 1000);
  }
  // filtro de paciente por nome.
  function FilterPaciente() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR PACIENTE..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR PACIENTE...')}
        onKeyUp={() => filterPaciente()}
        style={{
          // display: window.innerWidth < mobilewidth ? 'none' : 'flex',
          display: 'flex',
          width: window.innerWidth < mobilewidth ? '80vw' : '15vw',
          margin: 5,
        }}
        type="text"
        id="searchPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
      ></input>
    )
  }

  const [showresumo, setshowresumo] = useState(0);
  const [viewseletorhospital, setviewseletorhospital] = useState(0);
  // lista de pacientes internados.
  function ListaDePacientes() {
    return (
      <div
        style={{
          display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'center', width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
            justifyContent: window.innerWidth < mobilewidth ? 'center' : 'space-between',
            position: window.innerWidth < mobilewidth ? 'unset' : 'absolute',
            top: 0, right: 0, left: 0,
            alignContent: 'center', alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Usuario></Usuario>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth < mobilewidth ? 'column' : 'row',
            justifyContent: 'center',
            alignContent: 'center',
          }}>
            <div
              className='button'
              style={{
                display: unidade != null ? 'flex' : 'none',
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: 150,
                alignSelf: 'center',
              }}
              onClick={() => setpagina('DASHBOARD')}
            >
              DASHBOARD
            </div>
            <FilterPaciente></FilterPaciente>
          </div>
          <SeletorHospital></SeletorHospital>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          marginTop: window.innerWidth > mobilewidth ? 100 : 20,
          width: '100%',
        }}>
          <div className="text3" style={{ fontSize: 20 }}>{'PASSÔMETRO - ' + unidade}</div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', marginTop: 20 }}>
            <div className="text3">{'SITUAÇÃO'}</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 10,
                height: 25, width: 25,
                backgroundColor: 'grey', borderRadius: 5,
                alignSelf: 'center',
              }}
              onClick={() => {
                if (showresumo == 1) {
                  setshowresumo(0);
                } else {
                  setshowresumo(1);
                }
              }}>
              <img
                alt=""
                src={lupa}
                style={{
                  display: 'flex',
                  margin: 2.5,
                  height: 20,
                  width: 20,
                }}
              >
              </img>
            </div>
          </div>
          <div
            style={{
              display: showresumo == 1 ? 'flex' : 'none',
              width: '90vw',
              overflowX: 'hidden',
              overflowY: 'hidden',
              alignContent: 'center',
              alignSelf: 'center',
            }}
          >
            {resumo()}
          </div>
          <div className="text3" style={{ marginTop: 20 }}>{'SETORES'}</div>
          <FilterSetores></FilterSetores>
          <PassometroSbar></PassometroSbar>
          <PassometroSbarMobile></PassometroSbarMobile>
          <div className="text3" style={{ height: '70vh', display: arraypacientes.length > 0 ? 'none' : 'flex' }}>CLIQUE NOS SETORES PARA EXIBIR PACIENTES</div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  };

  const arraytipoleito = [
    {
      valor: 'ENF',
      cor: '#85c1e9',
    },
    {
      valor: 'CTI',
      cor: '#f1948a',
    },
  ]

  /*
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
    },
  ]
  */

  const arraytag = [
    {
      valor: 'ALTA',
      cor: '#a9dfbf',
    },
    {
      valor: 'EMAD',
      cor: '#a9dfbf',
    },
    {
      valor: 'CERSAM',
      cor: '#a9dfbf',
    },
    {
      valor: 'JUDICIAL',
      cor: '#f9e79f',
    },
    {
      valor: 'GRAVE',
      cor: '#ec7063',
    }
  ]

  const [arraypassometrosetor, setarraypassometrosetor] = useState([]);
  const loadSetores = () => {
    if (unidade == 'UPA-VN') {
      setarraypassometrosetor(
        [
          {
            valor: 'SE',
            cor: '#f1948a',
          },
          {
            valor: 'UDC',
            cor: '#f7dc6f',
          },
          {
            valor: 'OBS 1',
            cor: '#85c1e9',
          },
          {
            valor: 'OBS 2',
            cor: '#85c1e9',
          },
          {
            valor: 'OBS 3',
            cor: '#85c1e9',
          },
          {
            valor: 'SE PED',
            cor: '#f1948a',
          },
          {
            valor: 'OBS PED',
            cor: '#85c1e9',
          },
        ]
      );
    }
  }

  function FilterSetores() {
    return (
      <div id="lista de botões para filtro de setores"
        style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center',
          flexWrap: 'wrap',
          width: window.innerWidth > mobilewidth ? '90vw' : '80vw',
          alignSelf: 'center',
        }}>
        <div
          id="botao todos os setores"
          className={setor == 'TODOS' ? 'button strong blinkbordas' : 'button weak'}
          style={{
            width: window.innerWidth > mobilewidth ? 120 : 80,
            height: 30, minHeight: 30, maxHeight: 30,
          }}
          onClick={() => {
            setsetor('TODOS');
            loadPacientes(status, 'TODOS');
          }}
        >
          {'TODOS'}
        </div>
        {arraypassometrosetor.map(item => (
          <div
            className={setor == item.valor ? 'button strong blinkbordas' : 'button weak'}
            key={"botao de unidade " + item.valor}
            id={"botao de unidade " + item.valor}
            style={{
              backgroundColor: item.cor,
              width: window.innerWidth > mobilewidth ? 120 : 80,
              height: 30, minHeight: 30, maxHeight: 30,
            }}
            onClick={() => {
              setsetor(item.valor);
              loadPacientes(status, item.valor);
            }}
          >
            {item.valor}
          </div>
        ))}
      </div>
    )
  }

  // seletor de opção única.
  function Seletor(obj, array, variavel) {
    let x = [];
    x = array;
    return (
      <div className='fundo'
        id={"lista - " + variavel + " - " + obj.id}
        style={{
          display: 'none',
          zIndex: 5
        }}>
        <div className='janela scroll' style={{ height: '80vh' }}>
          {x.map(item => (
            <div className="button"
              key={'seletor ' + item.valor}
              id={"opcao - " + item.valor}
              style={{
                display: item.valor == 'TRANSFERIDOS' ? 'none' : 'flex',
                width: 200, backgroundColor: item.cor
              }}
              onClick={() => {
                document.getElementById("camposelecao - " + variavel + " - " + obj.id).innerHTML = item.valor;
                let objsetor = null;
                let objstatus = null;
                let tipo = null;
                if (window.innerWidth > mobilewidth) {
                  objsetor = document.getElementById("camposelecao - passometro_setor - " + obj.id).innerHTML;
                  objstatus = document.getElementById("camposelecao - status - " + obj.id).innerHTML;
                  tipo = document.getElementById("camposelecao - tipo_leito - " + obj.id).innerHTML;
                } else {
                  objsetor = document.getElementById("camposelecao - passometro_setor_mobile - " + obj.id).innerHTML;
                  objstatus = document.getElementById("camposelecao - status_mobile - " + obj.id).innerHTML;
                  tipo = document.getElementById("camposelecao - tipo_leito_mobile - " + obj.id).innerHTML;
                }

                let objeto = {
                  aih: obj.aih,
                  procedimento: obj.procedimento,
                  unidade_origem: obj.unidade_origem,
                  setor_origem: objsetor, // atualiza aqui.
                  nome_paciente: document.getElementById("campotexto - nome_paciente - " + obj.id).value.toUpperCase(),
                  nome_mae: obj.nome_mae,
                  dn_paciente: obj.dn_paciente,
                  status: objstatus, // atualiza aqui.
                  unidade_destino: obj.unidade_destino,
                  setor_destino: obj.setor_destino,
                  indicador_data_cadastro: item.valor == 'AIH' ? moment().format('DD/MM/YYYY - HH:mm') : obj.indicador_data_cadastro,
                  indicador_data_confirmacao: obj.indicador_data_confirmacao,
                  indicador_relatorio: obj.indicador_relatorio,
                  indicador_solicitacao_transporte: obj.indicador_solicitacao_transporte,
                  indicador_saida_origem: obj.indicador_saida_origem,
                  indicador_chegada_destino: obj.indicador_chegada_destino,
                  dados_susfacil: obj.dados_susfacil,
                  exames_ok: obj.exames_ok,
                  aih_ok: obj.aih_ok,
                  glasgow: obj.glasgow,
                  pas: obj.pas,
                  pad: obj.pad,
                  fc: obj.fc,
                  fr: obj.fr,
                  sao2: obj.sao2,
                  ofertao2: obj.ofertao2,
                  tipo_leito: tipo, // atualiza aqui. 
                  contato_nome: obj.contato_nome,
                  contato_telefone: obj.contato_telefone,
                  leito_destino: obj.leito_destino,
                  passometro_leito: document.getElementById("campotexto - passometro_leito - " + obj.id).value.toUpperCase(),
                  passometro_situacao: document.getElementById("campotexto - passometro_situacao - " + obj.id).value.toUpperCase(),
                  passometro_breve_historico: document.getElementById("campotexto - passometro_breve_historico - " + obj.id).value.toUpperCase(),
                  passometro_avaliacao: document.getElementById("campotexto - passometro_avaliacao - " + obj.id).value.toUpperCase(),
                  passometro_recomendacao: document.getElementById("campotexto - passometro_recomendacao - " + obj.id).value.toUpperCase(),
                  passometro_peso: obj.passometro_peso,
                  passometro_notificacao_srag: document.getElementById("check - passometro_notificacao_srag - " + obj.id).innerHTML,
                  passometro_notificacao_dengue: document.getElementById("check - passometro_notificacao_dengue - " + obj.id).innerHTML,
                  passometro_checklist_teste_covid: document.getElementById("check - passometro_checklist_teste_covid - " + obj.id).innerHTML,
                  passometro_checklist_teste_dengue: document.getElementById("check - passometro_checklist_teste_dengue - " + obj.id).innerHTML,
                  passometro_checklist_evolucao: document.getElementById("check - passometro_checklist_evolucao - " + obj.id).innerHTML,
                  passometro_checklist_prescricao: document.getElementById("check - passometro_checklist_prescricao - " + obj.id).innerHTML,
                  passometro_checklist_laboratorio: document.getElementById("check - passometro_checklist_laboratorio - " + obj.id).innerHTML,
                  passometro_checklist_rx: document.getElementById("check - passometro_checklist_rx - " + obj.id).innerHTML,
                  passometro_setor: objsetor,
                  passometro_data: obj.passometro_data,
                  passometro_vulnerabilidade: document.getElementById("check - passometro_vulnerabilidade - " + obj.id).innerHTML,
                  passometro_cersam: document.getElementById("check - passometro_cersam - " + obj.id).innerHTML,
                  tag: document.getElementById("camposelecao - tag - " + obj.id).innerHTML,
                  passometro_responsavel: document.getElementById("campotexto - passometro_responsavel - " + obj.id).value.toUpperCase(),
                }
                axios.post(html + 'update_paciente/' + obj.id, objeto).then(() => {
                  console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
                  loadPacientes(status, setor);
                  document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'none';
                });
              }}
            >
              {item.valor}
            </div>
          ))}
          <div id="botão para liberação do paciente transferido"
            className='button'
            style={{
              width: 200,
              backgroundColor: 'black',
              display:
                obj.status == 'AIH' ||
                  obj.status == 'CONTATO DIRETO' ||
                  obj.status == 'CERSAM' ||
                  obj.status == 'CONVÊNIOS' ||
                  obj.status == 'EMAD' ? 'flex' : 'none'
            }}
            onClick={() => {
              updatePacienteFromSeletor(obj, variavel, document.getElementById("camposelecao - status - " + obj.id).innerHTML + ' AUTORIZADO', null, moment().format('DD/MM/YYYY - HH:mm'), null);
            }}>
            {'AUTORIZADO'}
          </div>
          <div id="botão para liberação do paciente transferido"
            className='button'
            style={{
              width: 200,
              backgroundColor: 'black',
              display:
                obj.status == 'AIH AUTORIZADO' ||
                  obj.status == 'CONTATO DIRETO AUTORIZADO' ||
                  obj.status == 'CERSAM AUTORIZADO' ||
                  obj.status == 'CONVÊNIOS AUTORIZADO' ||
                  obj.status == 'EMAD AUTORIZADO' ? 'flex' : 'none'
            }}
            onClick={() => {
              let status = document.getElementById("camposelecao - status - " + obj.id).innerHTML;
              let changestatus = status.replace('AUTORIZADO', 'TRANSFERIDO');
              document.getElementById("camposelecao - status - " + obj.id).innerHTML = changestatus;
              localStorage.setItem('objeto', JSON.stringify(obj));
              console.log(JSON.parse(localStorage.getItem('objeto')))
              localStorage.setItem('variavel', variavel);
              localStorage.setItem('changestatus', changestatus);
              setviewseletorhospital(1);
            }}>
            {'TRANSFERIDO'}
          </div>
          <div
            className='button'
            onClick={() => document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'none'}>
            <img
              alt=""
              src={back}
              style={{
                display: 'flex',
                margin: 5,
                height: 30,
                width: 30,
              }}
            >
            </img>
          </div>
        </div>
      </div >
    )
  }

  // componente para seleção dos destinos dos pacientes.
  let localarrayhospitais = [
    {
      nome: 'HOSPITAL DAS CLÍNICAS',
      sigla: 'HC',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'SANTA CASA DE BELO HORIZONTE',
      sigla: 'SCBH',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'COMPLEXO HOSPITALAR SÃO FRANCISCO',
      sigla: 'CHSF',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL JULIA KUBITSCHEK',
      sigla: 'HJK',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL ODILON BEHRENS',
      sigla: 'HOB',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL RISOLETA TOLENTINA NEVES',
      sigla: 'HRTN',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL MUNICIPAL DOUTOR CÉLIO DE CASTRO',
      sigla: 'HMDCC',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL JOÃO XXIII',
      sigla: 'HJXXIII',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'MATERNIDADE ODETE VALADARES',
      sigla: 'MOV',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL EVANGÉLICO',
      sigla: 'HE',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL INFANTIL JOÃO PAULO II',
      sigla: 'HIJPII',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL UNIVERSITÁRIO DE CIÊNCIAS MÉDICAS',
      sigla: 'HUCM',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL DA BALEIA',
      sigla: 'HB',
      endereço: '',
      telefone: '',
    },
    {
      nome: 'HOSPITAL ALBERTO CAVALCANTE',
      sigla: 'HAC',
      endereço: '',
      telefone: '',
    },
  ];
  const hospitais = localarrayhospitais;
  const [arrayhospitais, setarrayhospitais] = useState(localarrayhospitais);
  function SeletorHospital() {
    return (
      <div className='fundo'
        id="lista - hospitais"
        onClick={() => setviewseletorhospital(0)}
        style={{
          display: viewseletorhospital == 1 ? 'flex' : 'none',
          zIndex: 5
        }}>
        <div className='janela scroll' style={{ height: '80vh', width: '60vw' }}
          onClick={(e) => e.stopPropagation()}
        >
          {Filter(setarrayhospitais, hospitais, 'item.nome')}
          {arrayhospitais.map((item) => (
            <div
              id={'HOSPITAL - ' + item.sigla}
              key={'HOSPITAL - ' + item.sigla}
              className='button'
              style={{ width: 'calc(100% - 20px)', minWidth: 'calc(100% - 20px)' }}
              onClick={() => {
                updatePacienteFromSeletor(JSON.parse(localStorage.getItem('objeto')), localStorage.getItem('variavel'), localStorage.getItem('changestatus'), null, null, item.nome);
                setviewseletorhospital(0);
              }}
            >
              {item.nome}
            </div>
          ))}
          <div
            style={{ display: 'flex' }}
            className='button-red'
            onClick={() => {
              setviewseletorhospital(0);
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
      </div>
    )
  }

  const updatePacienteFromSeletor = (obj, variavel, valor, data_cadastro, data_confirmacao, unidade_destino) => {
    let objeto = {
      aih: obj.aih,
      procedimento: obj.procedimento,
      unidade_origem: obj.unidade_origem,
      setor_origem: document.getElementById("camposelecao - passometro_setor - " + obj.id).innerHTML,
      nome_paciente: document.getElementById("campotexto - nome_paciente - " + obj.id).value.toUpperCase(),
      nome_mae: obj.nome_mae,
      dn_paciente: obj.dn_paciente,
      status: valor,
      unidade_destino: unidade_destino == null ? obj.unidade_destino : unidade_destino,
      setor_destino: obj.setor_destino,
      indicador_data_cadastro: data_cadastro == null ? obj.indicador_data_cadastro : data_cadastro,
      indicador_data_confirmacao: data_confirmacao == null ? obj.indicador_data_confirmacao : data_confirmacao,
      indicador_relatorio: obj.indicador_relatorio,
      indicador_solicitacao_transporte: obj.indicador_solicitacao_transporte,
      indicador_saida_origem: obj.indicador_saida_origem,
      indicador_chegada_destino: obj.indicador_chegada_destino,
      dados_susfacil: obj.dados_susfacil,
      exames_ok: obj.exames_ok,
      aih_ok: obj.aih_ok,
      glasgow: obj.glasgow,
      pas: obj.pas,
      pad: obj.pad,
      fc: obj.fc,
      fr: obj.fr,
      sao2: obj.sao2,
      ofertao2: obj.ofertao2,
      tipo_leito: document.getElementById("camposelecao - tipo_leito - " + obj.id).innerHTML,
      contato_nome: obj.contato_nome,
      contato_telefone: obj.contato_telefone,
      leito_destino: obj.leito_destino,
      passometro_leito: document.getElementById("campotexto - passometro_leito - " + obj.id).value.toUpperCase(),
      passometro_situacao: document.getElementById("campotexto - passometro_situacao - " + obj.id).value.toUpperCase(),
      passometro_breve_historico: document.getElementById("campotexto - passometro_breve_historico - " + obj.id).value.toUpperCase(),
      passometro_avaliacao: document.getElementById("campotexto - passometro_avaliacao - " + obj.id).value.toUpperCase(),
      passometro_recomendacao: document.getElementById("campotexto - passometro_recomendacao - " + obj.id).value.toUpperCase(),
      passometro_peso: obj.passometro_peso,
      passometro_notificacao_srag: document.getElementById("check - passometro_notificacao_srag - " + obj.id).innerHTML,
      passometro_notificacao_dengue: document.getElementById("check - passometro_notificacao_dengue - " + obj.id).innerHTML,
      passometro_checklist_teste_covid: document.getElementById("check - passometro_checklist_teste_covid - " + obj.id).innerHTML,
      passometro_checklist_teste_dengue: document.getElementById("check - passometro_checklist_teste_dengue - " + obj.id).innerHTML,
      passometro_checklist_evolucao: document.getElementById("check - passometro_checklist_evolucao - " + obj.id).innerHTML,
      passometro_checklist_prescricao: document.getElementById("check - passometro_checklist_prescricao - " + obj.id).innerHTML,
      passometro_checklist_laboratorio: document.getElementById("check - passometro_checklist_laboratorio - " + obj.id).innerHTML,
      passometro_checklist_rx: document.getElementById("check - passometro_checklist_rx - " + obj.id).innerHTML,
      passometro_setor: document.getElementById("camposelecao - passometro_setor - " + obj.id).innerHTML,
      passometro_data: obj.passometro_data,
      passometro_vulnerabilidade: document.getElementById("check - passometro_vulnerabilidade - " + obj.id).innerHTML,
      passometro_cersam: document.getElementById("check - passometro_cersam - " + obj.id).innerHTML,
      tag: document.getElementById("camposelecao - tag - " + obj.id).innerHTML,
      passometro_responsavel: document.getElementById("campotexto - passometro_responsavel - " + obj.id).value.toUpperCase(),
    }
    axios.post(html + 'update_paciente/' + obj.id, objeto).then(() => {
      console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
      loadPacientes(status, setor);
    });
    document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'none'
  }

  // campo no passômetro para seleção de uma opção.
  function CampoSelecao(obj, item, array, variavel, largura) {
    return (
      <div>
        <div
          className='button'
          style={{
            position: 'relative',
            display: 'flex', flexDirection: 'row',
            minWidth: largura, width: largura, maxWidth: largura,
            minHeight: 40, height: 40, maxHeight: 40,
            padding: 5, margin: 2.5,
            borderStyle: 'solid', borderWidth: 5,
            backgroundColor: array.filter(valor => valor.valor == item).length == 1 ?
              array.filter(valor => valor.valor == item).map(valor => valor.cor) :
              (item != null && (item.includes('AUTORIZADO') || item.includes('TRANSFERIDO'))) ? '#a9dfbf' : '',
          }}
          onClick={() => {
            document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'flex';
          }}
        >
          <div
            style={{
              display: item != null && item.includes('REAVALIAÇÃO ') ? 'flex' : 'none',
              flexDirection: 'row',
              justifyContent: 'center',
              position: 'absolute', top: 0, left: 0, bottom: 0,
            }}>
            <div style={{
              display: 'flex',
              backgroundColor: item == 'REAVALIAÇÃO AMARELA' ? '#f4d03f' : item == 'REAVALIAÇÃO VERDE' ? '#7dcea0' : item == 'REAVALIAÇÃO CIRURGIA' ? '#7e5109' : '#ec7063',
              width: 20, height: '100%',
              borderRadius: 5, marginRight: 5,
            }}>
            </div>
            <div id={"camposelecao - " + variavel + " - " + obj.id}
              style={{ alignSelf: 'center' }}>{item}
            </div>
          </div>
          <div id={"camposelecao - " + variavel + " - " + obj.id}
            style={{
              display: item != null && !item.includes('REAVALIAÇÃO ') ? 'flex' : 'none'
            }}>{item}
          </div>
        </div>
        {
          Seletor(obj, array, variavel)
        }
      </div >
    )
  }
  // tag para atividades do horizontal.
  function CampoSelecaoTag(obj, item, array, variavel) {
    return (
      <div>
        <div
          className='text2'
          id={"camposelecao - " + variavel + " - " + obj.id}
          style={{
            minHeight: 30, height: 30, maxHeight: 30,
            padding: 2.5, paddingLeft: 10, paddingRight: 10,
            margin: 2.5,
            borderRadius: 5,
            backgroundColor: array.filter(valor => valor.valor == item).length == 1 ? array.filter(valor => valor.valor == item).map(valor => valor.cor) : 'grey',
            opacity: item != 'TAG' ? 1 : 0.7,
          }}
          onDoubleClick={() => {
            document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'flex';
          }}
          onClick={() => {
            document.getElementById("camposelecao - " + variavel + " - " + obj.id).innerHTML = 'TAG';
            document.getElementById("camposelecao - " + variavel + " - " + obj.id).style.backgroundColor = 'grey';
            document.getElementById("camposelecao - " + variavel + " - " + obj.id).style.opacity = 0.7;
            updatePaciente(obj, obj.id);
          }}
        >
          {item != null ? item : 'TAG'}
        </div>
        {
          Seletor(obj, array, variavel)
        }
      </div >
    )
  }
  // campo no passômetro para edição (texto).
  function CampoTexto(obj, item, placeholder, variavel, largura_minima, largura, largura_maxima, altura) {
    return (
      <textarea
        className="textarea"
        placeholder={placeholder}
        onFocus={(e) => (e.target.placeholder = '')}
        style={{
          display: 'flex', flexDirection: 'center',
          alignSelf: smartlist == 0 ? 'center' : 'flex-start',
          minWidth: largura_minima, width: largura, maxWidth: largura_maxima,
          minHeight: altura, height: altura, maxHeight: altura,
          padding: 5, margin: 2.5,
          borderStyle: 'solid', borderWidth: 5,
        }}
        title={placeholder}
        defaultValue={item}
        id={"campotexto - " + variavel + " - " + obj.id}
        onClick={(e) => localStorage.setItem("texto", e.target.value)}
        onKeyUp={(e) => {
          document.getElementById("campotexto - " + variavel + " - " + obj.id).value = e.target.value.toUpperCase();
          clearTimeout(timeout);
          if (document.getElementById("campotexto - " + variavel + " - " + obj.id).value == '' && variavel == 'nome_paciente') {
            setexplicacao(1);
          } else {
            timeout = setTimeout(() => {
              updatePaciente(obj, obj.id);
            }, 1000);
          }
        }}
      ></textarea>
    )
  }
  // campo para checklist.
  function CampoChecklist(titulo, obj, item, variavel, largura) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: largura }}>
        <div
          id={'check - ' + variavel + ' - ' + obj.id}
          className='button'
          style={{
            minHeight: 20, height: 20, maxHeight: 20,
            minWidth: 20, width: 20, maxWidth: 20,
            color: 'transparent',
            backgroundColor: item == 1 ? '#f7dc6f' : item == 2 ? '#82e0aa' : '',
          }}
          onClick={(e) => {
            if (document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML == 0) {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 1;
              e.target.style.backgroundColor = '#f7dc6f';
            } else if (document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML == 1) {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 2;
              e.target.style.backgroundColor = '#82e0aa';
            } else {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 0
              e.target.style.backgroundColor = '';
            }
            updatePaciente(obj, obj.id);
          }}
        >
          {item}
        </div>
        <div className='text1' style={{ alignSelf: 'center', textAlign: 'left', marginLeft: 0 }}>{titulo}</div>
      </div>
    )
  }

  // cabeçalho das listas de pacientes.
  function Header(titulo, minlargura, largura, maxlargura, fonte) {
    return (
      <div className="button"
        style={{
          minWidth: minlargura, width: largura, maxWidth: maxlargura,
          height: 30, minHeight: 30, maxHeight: 30,
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'transparent',
          color: 'grey',
          margin: 2.5, marginBottom: -10, marginTop: 0, paddingTop: 0, paddingBottom: 0,
          borderStyle: 'solid', borderWidth: 5,
          fontSize: fonte,
        }}
      // onClick={() => classificador(titulo)}
      >
        <div>
          {titulo}
        </div>
      </div>
    )
  }
  // visualização dos campos extras do passômetro (checklists, campos do SBAR).
  const expand = (elemento) => {
    document.getElementById(elemento).classList.toggle("expand");
  }

  // visualização de pacientes para a versão desktop.
  function PassometroSbar() {
    return (
      <div style={{
        display: window.innerWidth > mobilewidth ? 'flex' : 'none',
        flexDirection: 'column', justifyContent: 'center',
        alignSelf: 'center', alignContent: 'center',
      }}>
        <div
          id="header - passômetro"
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            marginBottom: 0, paddingBottom: 0,
          }}
        >
          <div style={{ width: 70, display: 'flex' }}></div>
          {Header('SETOR', 50, 50, 50)}
          {Header('LEITO', 50, 50, 50)}
          {Header('RESPONSÁVEL', 150, 150, 150)}
          {Header('STATUS', '10vw', '10vw', '10vw')}
          {Header('TIPO', '5vw', '5vw', '5vw')}
          {Header('NOME', '20vw', '20vw', '20vw')}
          {Header('SITUAÇÃO', 200, 200, 200)}
          <div style={{ width: 80 }}></div>
        </div>
        {arraypassometrosetor.map(setor => (
          <div key={'passometro desktop ' + setor.valor}>
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && (item.status == 'VAGO' || (item.nome_paciente != null && item.nome_paciente != '' && item.passometro_leito != null && item.passometro_leito != '' && isNaN(parseInt(item.passometro_leito)) == false))).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => {
              let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
              let alertalaboratorio = moment().diff(entrada, 'seconds') > 5 && item.passometro_checklist_laboratorio == 1;
              let alertarx = moment().diff(entrada, 'seconds') > 5 && item.passometro_checklist_rx == 1;
              let alertaaih = moment().diff(entrada, 'hours') > 6 && (item.status.includes('REAVALIAÇÃO') == true);
              return (
                <div key={'pacientes desktop ' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                    position: 'relative',
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                    }}
                  >
                    <div className="button" style={{
                      minWidth: 70, width: 70, maxWidth: 70,
                      height: 50, minHeight: 50, maxHeight: 50,
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY')}
                      </div>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                      </div>
                      <img
                        id={'logo alerta ' + item.id}
                        className='show'
                        alt=""
                        src={alerta}
                        style={{
                          display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
                          position: 'absolute',
                          left: -10, bottom: -20,
                          margin: 0, marginTop: 5,
                          height: 50,
                          width: 50,
                        }}
                      >
                      </img>
                    </div>
                    {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 50)}
                    {CampoTexto(item, parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 50, 50, 50, 40)}
                    {CampoTexto(item, item.passometro_responsavel, 'RESPONSÁVEL', "passometro_responsavel", 150, 150, 150, 40)}
                    {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}
                    {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito", '5vw')}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", 200, 200, 200, 40)}
                      </div>
                      <div id={"checklist para horizontal"}
                        style={{
                          display: smartlist == 1 ? 'flex' : 'none',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LAB', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 80)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 80)}
                        {CampoChecklist('E', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 80)}
                        {CampoChecklist('P', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 80)}
                        {CampoSelecaoTag(item, item.tag, arraytag, 'tag')}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'row', width: 95,
                      alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                    }}>
                      <div id={"toggle_details " + item.id}
                        className='button-green'
                        title={'EXIBIR/OCULTAR DETALHES'}
                        style={{
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                          fontWeight: 'bolder',
                          fontSize: 20,
                          marginRight: 0,
                        }}
                        onClick={() => { expand("detalhes: " + item.id) }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                      <div id="botão para deletar paciente do passômetro"
                        className='button-red'
                        title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                        style={{
                          display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                        }}
                        onClick={
                          (e) => {
                            modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                          }}
                      >
                        <img
                          alt=""
                          src={deletar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div id={"detalhes: " + item.id}
                    title="MAIS CAMPOS"
                    className='retract'
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#d7dbdd',
                      marginTop: -8,
                      marginBottom: 20,
                      alignSelf: 'center',
                    }}
                  >
                    {alertas(item)}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                      {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '25vw', '25vw', '25vw', 100)}
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      width: '80vw',
                    }}>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 250)}
                        {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 250)}
                        {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 250)}
                        {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 250)}
                      </div>
                      <div
                        style={{
                          display: smartlist == 1 ? 'none' : 'flex',
                          flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 250)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 250)}
                        {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 250)}
                        {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 250)}
                      </div>
                      <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                        {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && (item.status == 'VAGO' || (item.nome_paciente != null && item.nome_paciente != '' && item.passometro_leito != null && item.passometro_leito != '' && isNaN(parseInt(item.passometro_leito)) == true))).map(item => {
              let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
              let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
              let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
              let alertaaih = moment().diff(entrada, 'hours') > 12 && (item.status.includes('REAVALIAÇÃO') == true);
              return (
                <div key={'pacientes desktop ' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                    position: 'relative',
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                    }}
                  >
                    <div className="button" style={{
                      minWidth: 70, width: 70, maxWidth: 70,
                      height: 50, minHeight: 50, maxHeight: 50,
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY')}
                      </div>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                      </div>
                      <img
                        id={'logo alerta ' + item.id}
                        className='show'
                        alt=""
                        src={alerta}
                        style={{
                          display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
                          position: 'absolute',
                          left: -10, bottom: -20,
                          margin: 0, marginTop: 5,
                          height: 50,
                          width: 50,
                        }}
                      >
                      </img>
                    </div>
                    {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 50)}
                    {CampoTexto(item, item.passometro_leito, 'LEITO', "passometro_leito", 50, 50, 50, 40)}
                    {CampoTexto(item, item.passometro_responsavel, 'RESPONSÁVEL', "passometro_responsavel", 150, 150, 150, 40)}
                    {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}
                    {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito", '5vw')}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", 200, 200, 200, 40)}
                      </div>
                      <div id={"checklist para horizontal"}
                        style={{
                          display: smartlist == 1 ? 'flex' : 'none',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LAB', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 80)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 80)}
                        {CampoChecklist('E', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 80)}
                        {CampoChecklist('P', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 80)}
                        {CampoSelecaoTag(item, item.tag, arraytag, 'tag')}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'row', width: 95,
                      alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                    }}>
                      <div id={"toggle_details " + item.id}
                        className='button-green'
                        title={'EXIBIR/OCULTAR DETALHES'}
                        style={{
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                          fontWeight: 'bolder',
                          fontSize: 20,
                          marginRight: 0,
                        }}
                        onClick={() => { expand("detalhes: " + item.id) }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                      <div id="botão para deletar paciente do passômetro"
                        className='button-red'
                        title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                        style={{
                          display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                        }}
                        onClick={
                          (e) => {
                            modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                          }}
                      >
                        <img
                          alt=""
                          src={deletar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div id={"detalhes: " + item.id}
                    title="MAIS CAMPOS"
                    className='retract'
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#d7dbdd',
                      marginTop: -8,
                      marginBottom: 20,
                      alignSelf: 'center',
                    }}
                  >
                    {alertas(item)}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                      {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '25vw', '25vw', '25vw', 100)}
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      width: '80vw',
                    }}>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 250)}
                        {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 250)}
                        {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 250)}
                        {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 250)}
                      </div>
                      <div
                        style={{
                          display: smartlist == 1 ? 'none' : 'flex',
                          flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 250)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 250)}
                        {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 250)}
                        {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 250)}
                      </div>
                      <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                        {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && item.status != 'VAGO' && item.nome_paciente != null && item.nome_paciente != '' && (item.passometro_leito == null || item.passometro_leito == '')).map(item => {
              let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
              let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
              let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
              let alertaaih = moment().diff(entrada, 'hours') > 12 && (item.status.includes('REAVALIAÇÃO') == true);
              return (
                <div key={'pacientes dektop new' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                    position: 'relative',
                    borderRadius: 5,
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                    }}
                  >
                    <div className="button" style={{
                      minWidth: 70, width: 70, maxWidth: 70,
                      height: 50, minHeight: 50, maxHeight: 50,
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY')}
                      </div>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                      </div>
                      <img
                        id={'logo alerta ' + item.id}
                        className='show'
                        alt=""
                        src={alerta}
                        style={{
                          display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
                          position: 'absolute',
                          left: -10, bottom: -20,
                          margin: 0, marginTop: 5,
                          height: 50,
                          width: 50,
                        }}
                      >
                      </img>
                    </div>
                    {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 50)}
                    {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? item.passometro_leito : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 50, 50, 50, 40)}
                    {CampoTexto(item, item.passometro_responsavel, 'RESPONSÁVEL', "passometro_responsavel", 150, 150, 150, 40)}
                    {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}
                    {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito", '5vw')}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", 200, 200, 200, 40)}
                      </div>
                      <div id={"checklist para horizontal"}
                        style={{
                          display: smartlist == 1 ? 'flex' : 'none',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LAB', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 80)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 80)}
                        {CampoChecklist('E', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 80)}
                        {CampoChecklist('P', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 80)}
                        {CampoSelecaoTag(item, item.tag, arraytag, 'tag')}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'row', width: 95,
                      alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                    }}>
                      <div id={"toggle_details " + item.id}
                        className='button-green'
                        title={'EXIBIR/OCULTAR DETALHES'}
                        style={{
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                          fontWeight: 'bolder',
                          fontSize: 20,
                          marginRight: 0,
                        }}
                        onClick={() => { expand("detalhes: " + item.id) }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                      <div id="botão para deletar paciente do passômetro"
                        className='button-red'
                        title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                        style={{
                          display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                        }}
                        onClick={
                          (e) => {
                            modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                          }}
                      >
                        <img
                          alt=""
                          src={deletar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div id={"detalhes: " + item.id}
                    title="MAIS CAMPOS"
                    className='retract'
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#d7dbdd',
                      marginTop: -8,
                      marginBottom: 15,
                      alignSelf: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                      {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '25vw', '25vw', '25vw', 100)}
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      width: '80vw'
                    }}>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 250)}
                        {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 250)}
                        {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 250)}
                        {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 250)}
                      </div>
                      <div
                        style={{
                          display: smartlist == 1 ? 'none' : 'flex',
                          flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 250)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 250)}
                        {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 250)}
                        {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 250)}
                      </div>
                      <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                        {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && item.status != 'VAGO' && (item.nome_paciente == null || item.nome_paciente == '')).map(item => {
              let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
              let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
              let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
              let alertaaih = moment().diff(entrada, 'hours') > 12 && (item.status.includes('REAVALIAÇÃO') == true);
              return (
                <div key={'pacientes dektop new' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                    position: 'relative',
                    backgroundColor: '#fcf3cf',
                    borderRadius: 5,
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                    }}
                  >
                    <div className="button" style={{
                      minWidth: 70, width: 70, maxWidth: 70,
                      height: 50, minHeight: 50, maxHeight: 50,
                      margin: 2.5,
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                    }}>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY')}
                      </div>
                      <div>
                        {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                      </div>
                      <img
                        id={'logo alerta ' + item.id}
                        className='show'
                        alt=""
                        src={alerta}
                        style={{
                          display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
                          position: 'absolute',
                          left: -10, bottom: -20,
                          margin: 0, marginTop: 5,
                          height: 50,
                          width: 50,
                        }}
                      >
                      </img>
                    </div>
                    {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 50)}
                    {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? item.passometro_leito : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 50, 50, 50, 40)}
                    {CampoTexto(item, item.passometro_responsavel, 'RESPONSÁVEL', "passometro_responsavel", 150, 150, 150, 40)}
                    {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}
                    {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito", '5vw')}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", 200, 200, 200, 40)}
                      </div>
                      <div id={"checklist para horizontal"}
                        style={{
                          display: smartlist == 1 ? 'flex' : 'none',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LAB', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 80)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 80)}
                        {CampoChecklist('E', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 80)}
                        {CampoChecklist('P', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 80)}
                        {CampoSelecaoTag(item, item.tag, arraytag, 'tag')}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'row', width: 95,
                      alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                    }}>
                      <div id={"toggle_details " + item.id}
                        className='button-green'
                        title={'EXIBIR/OCULTAR DETALHES'}
                        style={{
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                          fontWeight: 'bolder',
                          fontSize: 20,
                          marginRight: 0,
                        }}
                        onClick={() => { expand("detalhes: " + item.id) }}
                      >
                        <img
                          alt=""
                          src={editar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                      <div id="botão para deletar paciente do passômetro"
                        className='button-red'
                        title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                        style={{
                          display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                          minWidth: 30, width: 30, maxWidth: 30,
                          minHeight: 30, height: 30, maxHeight: 30,
                          alignSelf: 'center',
                        }}
                        onClick={
                          (e) => {
                            modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                          }}
                      >
                        <img
                          alt=""
                          src={deletar}
                          style={{
                            margin: 10,
                            height: 20,
                            width: 20,
                          }}
                        ></img>
                      </div>
                    </div>
                  </div>
                  <div id={"detalhes: " + item.id}
                    title="MAIS CAMPOS"
                    className='retract'
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#d7dbdd',
                      marginTop: -8,
                      marginBottom: 15,
                      alignSelf: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                      {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '25vw', '25vw', '25vw', 100)}
                      {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '25vw', '25vw', '25vw', 100)}
                    </div>
                    <div style={{
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                      alignSelf: 'flex-start',
                      marginTop: 10,
                      width: '80vw'
                    }}>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 250)}
                        {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 250)}
                        {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 250)}
                        {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 250)}
                      </div>
                      <div
                        style={{
                          display: smartlist == 1 ? 'none' : 'flex',
                          flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 250)}
                        {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 250)}
                        {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 250)}
                        {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 250)}
                      </div>
                      <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                      <div
                        style={{
                          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                        }}
                      >
                        {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                        {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div id="botão para inserir paciente no passômetro"
          className='button-green'
          title={'INSERIR PACIENTE'}
          style={{
            display: setor != 'TODOS' ? 'flex' : 'none',
            minWidth: 40, width: 40, maxWidth: 40,
            minHeight: 40, height: 40, maxHeight: 40,
            alignSelf: 'center',
          }}
          onClick={
            () => { insertPaciente() }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    )
  };
  // visualização de pacientes para a versão mobile.
  function PassometroSbarMobile() {
    return (
      <div style={{
        display: window.innerWidth > mobilewidth ? 'none' : 'flex',
        flexDirection: 'column', justifyContent: 'center',
        alignSelf: 'center', alignContent: 'center',
      }}>
        <div
          id="header - passômetro"
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'nowrap',
            marginBottom: 0, paddingBottom: 0,
          }}
        >
          {Header('LEITO', 30, 30, 30)}
          {Header('NOME', '40vw', '40vw', '40vw')}
          {Header('SITUAÇÃO', '20vw', '20vw', '20vw')}
        </div>
        {arraypassometrosetor.map(setor => (
          <div key={'passometro mobile ' + setor.valor}>
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && item.passometro_leito != null).map(item => {
              return (
                <div key={'pacientes mobile' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                      margIn: 5,
                      marginBottom: 20,
                      backgroundColor: '#d5dbdb',
                      borderRadius: 5,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LTO', "passometro_leito", 30, 30, 30, 40)}
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '40vw', '40vw', '40vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: -10 }}>
                        {Header('SETOR', '20vw', '20vw', '20vw', 10)}
                        {Header('STATUS', '30vw', '30vw', '30vw', 10)}
                        {Header('TIPO', '15vw', '15vw', '15vw', 10)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor_mobile", '20vw')}
                        {CampoSelecao(item, item.status, arraystatus, "status_mobile", '30vw')}
                        {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito_mobile", '15vw')}
                      </div>
                      <div id="botões para expandir detalhes e deletar registro."
                        style={{
                          display: 'flex', flexDirection: 'row',
                          alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                        }}>
                        <div id={"toggle_details " + item.id}
                          className='button-green'
                          title={'EXIBIR/OCULTAR DETALHES'}
                          style={{
                            minWidth: 20, width: 20, maxWidth: 20,
                            minHeight: 20, height: 20, maxHeight: 20,
                            alignSelf: 'center',
                            fontWeight: 'bolder',
                            fontSize: 20,
                            marginRight: 0,
                          }}
                          onClick={() => { expand("detalhes_mobile: " + item.id) }}
                        >
                          <img
                            alt=""
                            src={editar}
                            style={{
                              margin: 5,
                              height: 15,
                              width: 15,
                            }}
                          ></img>
                        </div>
                        <div id="botão para deletar paciente do passômetro"
                          className='button-red'
                          title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                          style={{
                            display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                            minWidth: 20, width: 20, maxWidth: 20,
                            minHeight: 20, height: 20, maxHeight: 20,
                            marginLeft: 2.5,
                            alignSelf: 'center',
                          }}
                          onClick={
                            (e) => {
                              modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                            }}
                        >
                          <img
                            alt=""
                            src={deletar}
                            style={{
                              margin: 5,
                              height: 15,
                              width: 15,
                            }}
                          ></img>
                        </div>
                      </div>
                      <div id={"detalhes_mobile: " + item.id}
                        title="MAIS CAMPOS"
                        className='retract'
                        style={{
                          flexDirection: 'column',
                          flexWrap: 'nowrap',
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#d7dbdd',
                          margin: 0, padding: 0,
                          alignSelf: 'center',
                        }}
                      >
                        {alertas(item)}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '75vw', '75vw', '75vw', 100)}
                          {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '75vw', '75vw', '75vw', 100)}
                          {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '75vw', '70vw', '70vw', 100)}
                        </div>
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                          alignSelf: 'flex-start',
                        }}>
                          <div
                            style={{
                              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw',
                              marginTop: 10,
                            }}
                          >
                            {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 200)}
                            {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 200)}
                            {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 200)}
                            {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 200)}
                          </div>
                          <div
                            style={{
                              display: smartlist == 1 ? 'none' : 'flex',
                              flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw'
                            }}
                          >
                            {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 200)}
                            {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 200)}
                            {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 200)}
                            {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 200)}
                          </div>
                          <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                          <div
                            style={{
                              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw',
                              marginBottom: 10
                            }}
                          >
                            {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                            {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            {arraypacientes.filter(item => item.setor_origem == setor.valor && item.unidade_origem == unidade && item.passometro_leito == null).map(item => {
              return (
                <div key={'pacientes mobile' + item.id}
                  style={{
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
                  }}>
                  <div
                    className="row"
                    style={{
                      display: 'flex',
                      justifyContent: 'center', flexWrap: 'nowrap',
                      margIn: 5,
                      marginBottom: 20,
                      backgroundColor: '#fcf3cf',
                      borderRadius: 5,
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LTO', "passometro_leito", 30, 30, 30, 40)}
                        {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '40vw', '40vw', '40vw', 40)}
                        {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: -10 }}>
                        {Header('SETOR', '20vw', '20vw', '20vw', 10)}
                        {Header('STATUS', '30vw', '30vw', '30vw', 10)}
                        {Header('TIPO', '15vw', '15vw', '15vw', 10)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor_mobile", '20vw')}
                        {CampoSelecao(item, item.status, arraystatus, "status_mobile", '30vw')}
                        {CampoSelecao(item, item.tipo_leito, arraytipoleito, "tipo_leito_mobile", '15vw')}
                      </div>
                      <div id="botões para expandir detalhes e deletar registro."
                        style={{
                          display: 'flex', flexDirection: 'row',
                          alignSelf: smartlist == 0 ? 'center' : 'flex-start',
                        }}>
                        <div id={"toggle_details " + item.id}
                          className='button-green'
                          title={'EXIBIR/OCULTAR DETALHES'}
                          style={{
                            minWidth: 20, width: 20, maxWidth: 20,
                            minHeight: 20, height: 20, maxHeight: 20,
                            alignSelf: 'center',
                            fontWeight: 'bolder',
                            fontSize: 20,
                            marginRight: 0,
                          }}
                          onClick={() => { expand("detalhes_mobile: " + item.id) }}
                        >
                          <img
                            alt=""
                            src={editar}
                            style={{
                              margin: 5,
                              height: 15,
                              width: 15,
                            }}
                          ></img>
                        </div>
                        <div id="botão para deletar paciente do passômetro"
                          className='button-red'
                          title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                          style={{
                            display: usuario.tipo == 'ENFERMEIRO NIR' || usuario.tipo == 'MÉDICO HORIZONTAL' ? 'flex' : 'none',
                            minWidth: 20, width: 20, maxWidth: 20,
                            minHeight: 20, height: 20, maxHeight: 20,
                            marginLeft: 2.5,
                            alignSelf: 'center',
                          }}
                          onClick={
                            (e) => {
                              modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO PACIENTE?', deletePaciente, item.id); e.stopPropagation();
                            }}
                        >
                          <img
                            alt=""
                            src={deletar}
                            style={{
                              margin: 5,
                              height: 15,
                              width: 15,
                            }}
                          ></img>
                        </div>
                      </div>
                      <div id={"detalhes_mobile: " + item.id}
                        title="MAIS CAMPOS"
                        className='retract'
                        style={{
                          flexDirection: 'column',
                          flexWrap: 'nowrap',
                          justifyContent: 'center',
                          alignContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#d7dbdd',
                          margin: 0, padding: 0,
                          alignSelf: 'center',
                        }}
                      >
                        {alertas(item)}
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '75vw', '75vw', '75vw', 100)}
                          {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '75vw', '75vw', '75vw', 100)}
                          {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '75vw', '70vw', '70vw', 100)}
                        </div>
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignContent: 'flex-start',
                          alignSelf: 'flex-start',
                        }}>
                          <div
                            style={{
                              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw',
                              marginTop: 10,
                            }}
                          >
                            {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag", 200)}
                            {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue", 200)}
                            {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid", 200)}
                            {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue", 200)}
                          </div>
                          <div
                            style={{
                              display: smartlist == 1 ? 'none' : 'flex',
                              flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw'
                            }}
                          >
                            {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio", 200)}
                            {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx", 200)}
                            {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao", 200)}
                            {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao", 200)}
                          </div>
                          <div className='text1' style={{ marginTop: 10, marginLeft: 0, alignSelf: 'flex-start' }}>SOCIAL:</div>
                          <div
                            style={{
                              display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                              justifyContent: 'flex-start',
                              alignContent: 'flex-start',
                              width: '75vw',
                              marginBottom: 10
                            }}
                          >
                            {CampoChecklist('VULNERABILIDADE SOCIAL', item, item.passometro_vulnerabilidade, "passometro_vulnerabilidade", 250)}
                            {CampoChecklist('CERSAM', item, item.passometro_cersam, "passometro_cersam", 250)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div id="botão para inserir paciente no passômetro"
          className='button-green'
          title={'INSERIR PACIENTE'}
          style={{
            minWidth: 40, width: 40, maxWidth: 40,
            minHeight: 40, height: 40, maxHeight: 40,
            alignSelf: 'center',
          }}
          onClick={
            () => { insertPaciente() }}
        >
          <img
            alt=""
            src={novo}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
      </div>
    )
  }

  const [explicacao, setexplicacao] = useState(0);
  function Orientacoes() {
    return (
      <div className='fundo'
        id={"explicação"}
        style={{
          display: explicacao == 1 ? 'flex' : 'none',
          zIndex: 5
        }}>
        <div className='janela' style={{ width: '40vw' }}>
          <img className='shake'
            alt=""
            src={alerta}
            style={{
              display: 'flex',
              margin: 5,
              height: 80,
              width: 80,
            }}
          >
          </img>
          <div className='text1' style={{ color: '#e74c3c', fontSize: 20 }}>
            {'NÃO SUBSTITUA O NOME DO PACIENTE, CADASTRE UM NOVO!'}
          </div>
          <div className='text1'>
            {'NÃO ADICIONE UM NOVO PACIENTE APAGANDO ESTE CAMPO PARA REAPROVEITAR O LEITO. VOCÊ DEVE INDICAR UM DESFECHO PARA ESTE PACIENTE (SELECIONANDO ALGUMA OPÇÃO EM STATUS) E REGISTRAR UM NOVO PACIENTE APERTANDO O BOTÃO VERDE NOVO (+), NO FINAL DA LISTA! ESTE CONTROLE É FUNDAMENTAL PARA GERAR INDICADORES FIDEDIGNOS.'}
          </div>
          <div
            className='button'
            onClick={() => setexplicacao(0)}>
            <img
              alt=""
              src={back}
              style={{
                display: 'flex',
                margin: 5,
                height: 30,
                width: 30,
              }}
            >
            </img>
          </div>
        </div>
      </div>
    )
  }

  // CARDS PARA FILTRO STATUS (reavaliação, aih para enfermaria ou CTI, etc).
  const resumo = () => {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        flexWrap: 'wrap',
      }}>
        <div
          id='status todos'
          className={status == 'TODOS' ? 'button strong blinkbordas' : 'button weak'}
          style={{
            width: window.innerWidth > mobilewidth ? 100 : '30vw',
            minWidth: window.innerWidth > mobilewidth ? 100 : '30vw',
            height: window.innerWidth > mobilewidth ? 100 : '30vw',
            fontSize: window.innerWidth > mobilewidth ? '' : 12,
            padding: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            backgroundColor: 'grey',
            opacity: status == 'TODOS' ? 1 : 0.7
          }}
          onClick={() => {
            setstatus('TODOS');
            loadPacientes('TODOS', setor);
          }}
        >
          <div>{'TODOS'}</div>
        </div>
        {arraystatus.map(valor => (
          <div
            className={status == valor.valor ? 'button strong blinkbordas' : 'button weak'}
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
            onClick={() => {
              setstatus(valor.valor);
              loadPacientes(valor.valor, setor);
            }}
          >
            <div>{valor.valor}</div>
            <div style={{ display: valor.valor.includes('TRANSFERIDO') == true ? 'flex' : 'none' }}>
              {pacientes.filter(item => item.status.includes('TRANSFERIDO')).length}
            </div>
            <div style={{ display: valor.valor.includes('TRANSFERIDO') == false ? 'flex' : 'none' }}>
              {pacientes.filter(item => item.status == valor.valor).length}
            </div>
          </div>
        ))}
        <div
          id='status assistencia social'
          className={status == 'ASSISTÊNCIA SOCIAL' ? 'button strong blinkbordas' : 'button weak'}
          style={{
            width: window.innerWidth > mobilewidth ? 100 : '30vw',
            minWidth: window.innerWidth > mobilewidth ? 100 : '30vw',
            height: window.innerWidth > mobilewidth ? 100 : '30vw',
            fontSize: window.innerWidth > mobilewidth ? '' : 12,
            padding: 10,
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            backgroundColor: '#c39bd3',
            opacity: status == 'ASSISTÊNCIA SOCIAL' ? 1 : 0.8
          }}
          onClick={() => {
            setstatus('ASSISTÊNCIA SOCIAL');
            setsetor('TODOS');
            filterassistenciasocial();
          }}
        >
          <div>{'ASSISTÊNCIA SOCIAL'}</div>
        </div>
      </div>
    )
  }

  // geração de alertas (exames pendentes, risco social, etc.)
  const alertas = (item) => {
    let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
    let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
    let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
    let alertaaih = moment().diff(entrada, 'hours') > 12 && (item.status.includes('REAVALIAÇÃO') == true);
    let alertavulneravel = item.passometro_vulnerabilidade;
    let alertacersam = item.passometro_cersam;
    return (
      <div
        style={{
          display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'grey',
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
          alignContent: 'flex-start',
          alignSelf: 'flex-start',
          width: window.innerWidth > mobilewidth ? '' : '',
          fontSize: window.innerWidth > mobilewidth ? '' : 10,
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <img
            id="logo de alertas"
            alt=""
            src={alerta}
            style={{
              display: 'flex',
              margin: 0,
              height: window.innerWidth > mobilewidth ? 50 : 40,
              width: window.innerWidth > mobilewidth ? 50 : 40,
            }}
          >
          </img>
          <div className='text2'
            style={{
              margin: 2.5, textAlign: 'left', textDecoration: 'underline',
              fontSize: window.innerWidth > mobilewidth ? 14 : 12,
              alignSelf: 'center',
            }}
          >
            {'PAINEL DE ALERTAS:'}
          </div>
        </div>
        <div
          className='text2'
          style={{ display: alertalaboratorio ? 'flex' : 'none', margin: 2.5, textAlign: 'left', alignSelf: 'flex-start' }}
        >
          {'• COBRAR EXAMES LABORATORIAIS'}
        </div>
        <div
          className='text2'
          style={{ display: alertarx == 1 ? 'flex' : 'none', margin: 2.5, textAlign: 'left', alignSelf: 'flex-start' }}
        >
          {'• COBRAR RX'}
        </div>
        <div
          className='text2'
          style={{ display: alertaaih == 1 ? 'flex' : 'none', margin: 2.5, textAlign: 'left', alignSelf: 'flex-start' }}
        >
          {'• DEFINIR CONDUTA (ALTA, AIH, TRANSFERÊNCIA)'}
        </div>
        <div
          className='text2'
          style={{ display: alertavulneravel == 2 ? 'flex' : 'none', margin: 2.5, textAlign: 'left', alignSelf: 'flex-start' }}
        >
          {'• ALERTA DE VULNERABILIDADE SOCIAL'}
        </div>
        <div
          className='text2'
          style={{ display: alertacersam == 2 ? 'flex' : 'none', margin: 2.5, textAlign: 'left', alignSelf: 'flex-start' }}
        >
          {'• PACIENTE VINCULADO AO CERSAM'}
        </div>
      </div>
    )
  }

  // ## IMPRESSÃO EM PDF ##
  const pdfHeaders = (item, largura) => {
    return (
      <div
        style={{
          padding: 5,
          borderColor: 'black', borderWidth: 1, borderStyle: 'solid',
          backgroundColor: '#b2bebe',
          width: largura,
          margin: 2.5,
        }}>
        {item}
      </div>
    )
  }
  const pdfItens = (item, largura) => {
    return (
      <div
        style={{
          padding: 5,
          borderColor: 'black', borderWidth: 1, borderStyle: 'solid',
          width: largura,
          margin: 2.5,
          // backgroundColor: item.passometro_setor == 'SE' ? '#d7dbdd' : '',
        }}>
        {item}
      </div>
    )
  }
  function Conteudo() {
    let array = [];
    arraypacientes.map(item => array.push(item));
    return (
      <div id="PDF passometro"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
          width: 'calc(100vw - 20px)',
          fontFamily: 'Helvetica',
          whiteSpace: 'pre-wrap',
        }}>
        {arraypassometrosetor.map(setor => (
          <div key={'pdf ' + setor.valor}>
            <div className='text2'
              style={{
                display: arraypacientes.filter(item => item.passometro_setor == setor.valor).length > 0 ? 'flex' : 'none',
                flexDirection: 'row',
                justifyContent: 'center',
                margin: 30, fontWeight: 'bolder', fontSize: 20, alignSelf: 'center', width: '100%', textAlign: 'center'
              }}>
              {'SETOR: ' + setor.valor}
            </div>
            <div style={{
              display: arraypacientes.filter(item => item.passometro_setor == setor.valor).length > 0 ? 'flex' : 'none',
              flexDirection: 'row', justifyContent: 'center'
            }}>
              {pdfHeaders('SETOR', 75)}
              {pdfHeaders('LEITO', 50)}
              {pdfHeaders('NOME', 400)}
              {pdfHeaders('SITUAÇÃO', 400)}
              {pdfHeaders('STATUS', 200)}
            </div>
            {array.filter(item => item.passometro_setor == setor.valor && (item.passometro_leito != null && item.passometro_leito != '')).map(item => (
              <div key={'pacientes_pdf ' + item.id}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  breakInside: 'avoid',
                }}>
                <div style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                }}>
                  {pdfItens(item.passometro_setor, 75)}
                  {pdfItens(item.passometro_leito.substring(0, 3), 50)}
                  {pdfItens(item.nome_paciente, 400)}
                  {pdfItens(item.passometro_situacao, 400)}
                  {pdfItens(item.status, 200)}
                </div>
                <div
                  style={{
                    display: item.passometro_setor == 'SE' ? 'flex' : 'none',
                    flexDirection: 'row', justifyContent: 'center',
                  }}>
                  {pdfItens(item.passometro_breve_historico != undefined && item.passometro_breve_historico != '' ? 'BREVE HISTÓRICO: ' + item.passometro_breve_historico : 'BREVE HITÓRICO: -X-', 375)}
                  {pdfItens(item.passometro_avaliacao != undefined && item.passometro_avaliacao != '' ? 'AVALIAÇÃO: ' + item.passometro_avaliacao : 'AVALIAÇÃO: -X-', 375)}
                  {pdfItens(item.passometro_recomoendacao != undefined && item.passometro_recomoendacao != '' ? 'RECOMENDAÇÃO: ' + item.passometro_recomoendacao : 'RECOMENDAÇÃO: -X-', 375)}
                </div>
                <div
                  style={{
                    display: item.passometro_setor == 'SE' ? 'flex' : 'none',
                    flexDirection: 'row', justifyContent: 'center',
                  }}>
                  <img
                    alt=""
                    src={dots}
                    style={{
                      margin: 0,
                      height: 20,
                    }}
                  >
                  </img>
                </div>
              </div>
            ))}
            {array.filter(item => item.passometro_setor == setor.valor && (item.passometro_leito == null || item.passometro_leito == '')).map(item => (
              <div key={'pacientes_pdf ' + item.id}
                style={{
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  breakInside: 'avoid',
                }}>
                <div style={{
                  display: 'flex', flexDirection: 'row', justifyContent: 'center',
                }}>
                  {pdfItens(item.passometro_setor, 75)}
                  {pdfItens(item.passometro_leito != null ? item.passometro_leito.substring(0, 3) : null, 50)}
                  {pdfItens(item.nome_paciente, 400)}
                  {pdfItens(item.passometro_situacao, 400)}
                  {pdfItens(item.status, 200)}
                </div>
                <div
                  style={{
                    display: item.passometro_setor == 'SE' ? 'flex' : 'none',
                    flexDirection: 'row', justifyContent: 'center',
                  }}>
                  {pdfItens(item.passometro_breve_historico != undefined && item.passometro_breve_historico != '' ? 'BREVE HISTÓRICO: ' + item.passometro_breve_historico : 'BREVE HITÓRICO: -X-', 375)}
                  {pdfItens(item.passometro_avaliacao != undefined && item.passometro_avaliacao != '' ? 'AVALIAÇÃO: ' + item.passometro_avaliacao : 'AVALIAÇÃO: -X-', 375)}
                  {pdfItens(item.passometro_recomoendacao != undefined && item.passometro_recomoendacao != '' ? 'RECOMENDAÇÃO: ' + item.passometro_recomoendacao : 'RECOMENDAÇÃO: -X-', 375)}
                </div>
                <div
                  style={{
                    display: item.passometro_setor == 'SE' ? 'flex' : 'none',
                    flexDirection: 'row', justifyContent: 'center',
                  }}>
                  <img
                    alt=""
                    src={dots}
                    style={{
                      margin: 0,
                      height: 20,
                    }}
                  >
                  </img>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
  function printDiv() {
    console.log('PREPARANDO DOCUMENTO PARA IMPRESSÃO');
    let printdocument = document.getElementById("IMPRESSÃO - DOCUMENTO").innerHTML;
    var a = window.open();
    a.document.write('<html>');
    a.document.write(printdocument);
    a.document.write('</html>');
    setTimeout(() => {
      a.print();
      a.close();
    }, 300);
  }
  function PrintDocumento() {
    return (
      <div id="IMPRESSÃO - DOCUMENTO"
        className="print"
        style={{
          fontFamily: 'Helvetica',
          breakInside: 'auto',
          whiteSpace: 'pre-wrap',
        }}
      >
        <div style={{
          display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center',
          breakInside: 'avoid',
        }}>
          <img
            alt=""
            src={pbh}
            style={{
              margin: 10,
              height: 50,
              marginRight: 50
            }}
          >
          </img>
          <div
            style={{
              fontFamily: 'Helvetica',
              whiteSpace: 'pre-wrap',
              alignSelf: 'center',
              fontWeight: 'bolder',
              textDecoration: 'underline',
            }}>
            {'PASSÔMETRO: ' + unidade + ' - ' + moment().format('DD/MM/YYYY - HH:mm')}
          </div>
        </div>
        <div id="campos"
          style={{
            display: 'flex', flexDirection: 'column',
            alignSelf: 'center', width: '100%'
          }}>
          <Conteudo></Conteudo>
        </div>
      </div >
    )
  };

  // modo de exibição (passômetro x tela de exibição)
  const [modo, setmodo] = useState(0);

  // ## TELA PARA EXIBIÇÃO PÚBLICA DE ATENDIMENTOS (monitores da upa) ##
  const [indexpacientes, setindexpacientes] = useState([]);
  // let localpage = 1;
  // alternar páginas.
  const changePages = (quantidade, intervalo) => {
    axios.get(html + 'list_pacientes').then((response) => {
      var y = response.data.rows;
      var x = y.filter(item => item.setor_origem == setor && (item.status.includes('REAVALIAÇÃO') == true || item.status == 'AIH'));
      setpacientes(x);
      let totalpacientes = x.length;
      console.log('TOTAL DE PACIENTES: ' + totalpacientes);
      let totalpaginas = Math.ceil(totalpacientes / quantidade);
      console.log('TOTAL DE PÁGINAS: ' + totalpaginas);

      let page = 1;
      let arraypct = [];
      let pctindex = 0;

      while (totalpaginas > 0) {
        totalpaginas = totalpaginas - 1;
        console.log('PÁGINA: ' + page);
        arraypct.push(
          {
            pagina: page,
            array: x.slice(pctindex * quantidade, ((pctindex + 1) * quantidade) - 1),
          }
        );
        page = page + 1;
        pctindex = pctindex + 1;
      }
      console.log(arraypct);
      setindexpacientes(arraypct);

      clearInterval(interval);
      let countpage = 1;
      interval = setInterval(() => {
        if (countpage <= totalpaginas) {
          setindexpacientes(arraypct.filter(item => item.page == countpage));
          countpage = countpage + 1;
        } else {
          countpage = 1;
        }
      }, intervalo);

      /*
      let inicio = 0;
      let final = 0;
      
      clearInterval(interval);
      interval = setInterval(() => {
        if (localpage == 1) {
          inicio = 0;
          final = quantidade;
          setindexpacientes(x.slice(inicio, final));
          localpage = localpage + 1;
        } else if (localpage > 1 && localpage <= totalpaginas) {
          inicio = inicio + quantidade;
          final = inicio + quantidade;
          setindexpacientes(x.slice(inicio, final));
          localpage = localpage + 1;
        } else if (localpage > totalpaginas) {
          localpage = 1;
        }
      }, intervalo);
      */

    })
  }
  function Tela() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          alignSelf: 'center', alignContent: 'center',
          width: '100%',
        }}>
        <div
          id="header - passômetro"
          className="row"
          style={{
            display: 'flex',
            justifyContent: 'center', flexWrap: 'nowrap',
            marginBottom: 0, paddingBottom: 0,
          }}
        >
          <div style={{ width: 100 }}></div>
          {Header('SETOR', 75, 75, 75)}
          {Header('LEITO', 50, 50, 50)}
          {Header('NOME', '30vw', '30vw', '30vw')}
          {Header('STATUS', '30vw', '30vw', '30vw')}
        </div>
        {indexpacientes.map(item => item.array).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => {
          return (
            <div key={'pacientes exibição' + item.id}
              style={{
                display: 'flex',
                flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
              }} >
              <div
                className="row"
                style={{
                  display: 'flex',
                  justifyContent: 'center', flexWrap: 'nowrap',
                }}
              >
                <div
                  className="button"
                  style={{
                    minWidth: 70, width: 70, maxWidth: 70,
                    height: 50, minHeight: 50, maxHeight: 50,
                    margin: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YY')}
                  </div>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                  </div>
                </div>
                {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 50)}
                {CampoTexto(item, parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 50, 50, 50, 40)}
                {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '30vw', '30vw', '30vw', 40)}
                {CampoSelecao(item, item.status, arraystatus, "status", '30vw')}
              </div>
            </div>
          )
        })
        }
      </div>
    )
  }

  return (
    <div
      className='scroll'
      style={{
        display: pagina == 'PASSOMETRO' ? 'flex' : 'none',
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
      <ModoButton></ModoButton>
      <div id="passômetro"
        style={{
          display: modo == 0 ? 'flex' : 'none',
          visibility: modo == 0 ? 'visible' : 'hidden',
          flexDirection: 'column', justifyContent: 'center',
        }}>
        <ListaDePacientes></ListaDePacientes>
        <Orientacoes></Orientacoes>
        <PrintDocumento></PrintDocumento>
      </div>
      <div id="telas de exibição"
        style={{
          display: modo == 1 ? 'flex' : 'none',
          visibility: modo == 1 ? 'visible' : 'hidden',
          flexDirection: 'column', justifyContent: 'center',
        }}>
        <Tela></Tela>
      </div>
    </div>
  );
}

export default Passometro
