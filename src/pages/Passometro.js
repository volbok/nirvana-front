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
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import novo from '../images/novo.svg';
import people from '../images/people.svg';
import imprimir from '../images/imprimir.svg';
import alerta from '../images/alerta.svg';
import pbh from '../images/pbh.svg';
import modo_edicao from '../images/passometro_edicao.svg';
import modo_visualizacao from '../images/passometro_visualizacao.svg';

function Passometro() {

  // context.
  const {
    html,
    usuario,
    pagina, setpagina,
    pacientes, setpacientes,
    settoast,
    setdialogo,
    unidade,
    mobilewidth,
  } = useContext(Context);

  // carregar lista de pacientes internados.
  const [arraypacientes, setarraypacientes] = useState(pacientes);
  const loadPacientes = (valor) => {
    axios.get(html + 'list_pacientes').then((response) => {
      setpacientes(response.data.rows);
      setarraypacientes(response.data.rows);
      console.log('## INFO ## \nLISTA DE PACIENTES INTERNADOS CARREGADA.\nTOTAL DE PACIENTES INTERNADOS: ' + response.data.rows.length);
      if (valor != null) {
        setarraypacientes(valor);
      }
    });
  }

  // inserir registro de pacientes.
  const insertPaciente = () => {
    obj = {
      aih: null,
      procedimento: null,
      unidade_origem: unidade,
      setor_origem: setor,
      nome_paciente: null,
      nome_mae: null,
      dn_paciente: null,
      status: status == null ? 'REAVALIAÇÃO' : status,
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
      tipo_leito: null,
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
    }
    axios.post(html + 'insert_paciente/', obj).then(() => {
      axios.get(html + 'list_pacientes').then((response) => {
        var x = [];
        x = response.data.rows;
        setpacientes(x);
        setarraypacientes(x.filter(valor => valor.setor_origem == setor && valor.status == status));
        toast(settoast, 'REGISTRO INSERIDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      });
    });
  }

  // excluir registro de pacientes.
  const deletePaciente = (id) => {
    axios.get(html + 'delete_paciente/' + id).then(() => {
      axios.get(html + 'list_pacientes').then((response) => {
        var x = [];
        x = response.data.rows;
        setpacientes(x);
        setarraypacientes(x.filter(item => item.status == status && item.setor_origem == setor));
        toast(settoast, 'REGISTRO EXCLUÍDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      })
    });
  }

  var obj = {}
  // atualizar registro de pacientes.
  const updatePaciente = (item, id) => {
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
      tipo_leito: item.tipo_leito,
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


      passometro_checklist_evolucao: horizontal != 1 ? document.getElementById("check - passometro_checklist_evolucao - " + id).innerHTML : document.getElementById("check - hor-passometro_checklist_evolucao - " + id).innerHTML,
      passometro_checklist_prescricao: horizontal != 1 ? document.getElementById("check - passometro_checklist_prescricao - " + id).innerHTML : document.getElementById("check - hor-passometro_checklist_prescricao - " + id).innerHTML,
      passometro_checklist_laboratorio: horizontal != 1 ? document.getElementById("check - passometro_checklist_laboratorio - " + id).innerHTML : document.getElementById("check - hor-passometro_checklist_laboratorio - " + id).innerHTML,
      passometro_checklist_rx: horizontal != 1 ? document.getElementById("check - passometro_checklist_rx - " + id).innerHTML : document.getElementById("check - hor-passometro_checklist_rx - " + id).innerHTML,

      passometro_setor: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
      passometro_data: item.passometro_data,
      passometro_vulnerabilidade: document.getElementById("check - passometro_vulnerabilidade - " + id).innerHTML,
      passometro_cersam: document.getElementById("check - passometro_cersam - " + id).innerHTML,
      tag: document.getElementById("camposelecao - tag - " + id).innerHTML,
    }
    axios.post(html + 'update_paciente/' + id, obj).then(() => {
      console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
    });
  }

  var timeout = null;
  var interval = null;
  useEffect(() => {
    if (pagina == 'PASSOMETRO') {
      loadSetores();
      loadPacientes(pacientes.filter(item => item.status == 'REAVALIAÇÃO' && item.setor_origem == 'UDC'));
    }

    // eslint-disable-next-line
  }, [pagina])

  // identificação do usuário.
  function Usuario() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
      }}>
        <div className='button-red' onClick={() => setpagina(0)} title="SAIR">
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
          style={{ position: 'relative' }}
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
            className={horizontal == 1 ? 'button-green' : 'button-red'}
            onClick={(e) => {
              if (horizontal == 0) {
                sethorizontal(1);
              } else {
                sethorizontal(0);
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
            changePages(6, 5000, 'UDC');
            setmodo(1);
          }
        }}
        style={{
          display: window.innerWidth > mobilewidth ? 'flex' : 'none',
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
            height: 60,
            width: 60,
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
          display: window.innerWidth < mobilewidth ? 'none' : 'flex',
          width: '15vw',
          margin: 5,
        }}
        type="text"
        id="searchPaciente"
        defaultValue={filterpaciente}
        maxLength={100}
      ></input>
    )
  }

  // lista de pacientes internados.
  const [horizontal, sethorizontal] = useState(0);
  function ListaDePacientes() {
    return (
      <div
        style={{
          display: 'flex', position: 'relative', flexDirection: 'column', justifyContent: 'center', width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            position: 'absolute', top: 0, right: 0, left: 0,
          }}>
          <Usuario></Usuario>
          <FilterPaciente></FilterPaciente>
        </div>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          marginTop: 100, width: '100%',
        }}>
          <div className="text3" style={{ fontSize: 20 }}>{'PASSÔMETRO - ' + unidade}</div>
          <div className="text3" style={{ marginTop: 20 }}>{'SITUAÇÃO'}</div>
          <div
            style={{
              width: window.innerWidth > mobilewidth ? '80vw' : '80vw',
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
          <div className="text3" style={{ height: '70vh', display: arraypacientes.length > 0 ? 'none' : 'flex', color: 'rgb(82, 190, 128, 1)' }}>SEM PACIENTES INTERNADOS NA UNIDADE</div>
        </div>
      </div>
    )
    // eslint-disable-next-line
  };

  const arraystatus = [
    {
      valor: 'REAVALIAÇÃO',
      cor: '#f7dc6f',
    },
    {
      valor: 'AIH ENFERMARIA',
      cor: '#85c1e9',
    },
    {
      valor: 'AIH CTI',
      cor: '#f1948a',
    },
    {
      valor: 'ALTA',
      cor: '#7dcea0',
    },
    {
      valor: 'TRANSFERÊNCIA AIH',
      cor: '#7dcea0',
    },
    {
      valor: 'TRANSFERÊNCIA CONTATO DIRETO',
      cor: '#7dcea0',
    },
    {
      valor: 'TRANSFERÊNCIA CERSAM',
      cor: '#7dcea0',
    },
    {
      valor: 'TRANSFERÊNCIA CONVÊNIOS',
      cor: '#7dcea0',
    },
    {
      valor: 'EMAD',
      cor: '#7dcea0',
    },
    {
      valor: 'EVASÃO',
      cor: '#d5d8dc',
    },
    {
      valor: 'ÓBITO',
      cor: '#d5d8dc',
    },
  ]

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

  const [setor, setsetor] = useState('UDC');
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
          className={setor == 'TODOS' ? 'button' : 'button weak'}
          style={{
            width: window.innerWidth > mobilewidth ? 120 : 80,
            height: 30, minHeight: 30, maxHeight: 30,
          }}
          onClick={() => {
            axios.get(html + 'list_pacientes').then((response) => {
              var x = [];
              x = response.data.rows;
              setpacientes(x);
              setarraypacientes(x.filter(item => item.status == status));
              setsetor('TODOS');
              setTimeout(() => {
                var botoes = document.getElementById("lista de botões para filtro de setores").getElementsByClassName("button strong");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = 'button weak';
                }
                document.getElementById("botao todos os setores").className = "button strong";
              }, 100);
            })
          }}
        >
          {'TODOS'}
        </div>
        {arraypassometrosetor.map(item => (
          <div
            className={setor == item.valor ? 'button' : 'button weak'}
            key={"botao de unidade " + item.valor}
            id={"botao de unidade " + item.valor}
            style={{
              backgroundColor: item.cor,
              width: window.innerWidth > mobilewidth ? 120 : 80,
              height: 30, minHeight: 30, maxHeight: 30,
            }}
            onClick={() => {
              axios.get(html + 'list_pacientes').then((response) => {
                var x = [];
                x = response.data.rows;
                setpacientes(response.data.rows);
                setarraypacientes(x.filter(valor => valor.setor_origem == item.valor && valor.status == status));
                setsetor(item.valor);
                console.log('STATUS: ' + status);
                console.log('SETOR: ' + item.valor);
                setTimeout(() => {
                  var botoes = document.getElementById("lista de botões para filtro de setores").getElementsByClassName("button strong");
                  for (var i = 0; i < botoes.length; i++) {
                    botoes.item(i).className = 'button weak';
                  }
                  document.getElementById("botao de unidade " + item.valor).className = "button strong";
                }, 100);
              })
            }}
          >
            {item.valor}
          </div>
        ))}
      </div>
    )
  }

  function Seletor(obj, array, variavel) {
    let x = [];
    x = array;
    return (
      <div className='fundo'
        id={"lista - " + variavel + " - " + obj.id}
        style={{ display: 'none', zIndex: 5 }}>
        <div className='janela scroll' style={{ height: '80vh' }}>
          {x.map(item => (
            <div className="button"
              key={'seletor ' + item.valor}
              id={"opcao - " + item.valor}
              style={{ width: 200, backgroundColor: item.cor }}
              onClick={() => {
                document.getElementById("camposelecao - " + variavel + " - " + obj.id).innerHTML = item.valor;
                let objeto = {
                  aih: obj.aih,
                  procedimento: obj.procedimento,
                  unidade_origem: obj.unidade_origem,
                  setor_origem: document.getElementById("camposelecao - passometro_setor - " + obj.id).innerHTML,
                  nome_paciente: document.getElementById("campotexto - nome_paciente - " + obj.id).value.toUpperCase(),
                  nome_mae: obj.nome_mae,
                  dn_paciente: obj.dn_paciente,
                  status: document.getElementById("camposelecao - status - " + obj.id).innerHTML,
                  unidade_destino: obj.unidade_destino,
                  setor_destino: obj.setor_destino,
                  indicador_data_cadastro: obj.indicador_data_cadastro,
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
                  tipo_leito: obj.tipo_leito,
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
                }
                console.log(objeto);
                axios.post(html + 'update_paciente/' + obj.id, objeto).then(() => {
                  console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
                  axios.get(html + 'list_pacientes').then((response) => {
                    var x = [];
                    x = response.data.rows;
                    setpacientes(x);
                    setarraypacientes(x.filter(item => item.status == status && item.setor_origem == setor));
                    console.log('## INFO ## \nLISTA DE PACIENTES INTERNADOS CARREGADA.\nTOTAL DE PACIENTES INTERNADOS: ' + response.data.rows.length);
                  });
                });
              }}
            >
              {item.valor}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // campo no passômetro para seleção de uma opção.
  function CampoSelecao(obj, item, array, variavel, largura) {
    return (
      <div>
        <div
          id={"camposelecao - " + variavel + " - " + obj.id}
          className='button'
          style={{
            minWidth: largura, width: largura, maxWidth: largura,
            minHeight: 40, height: 40, maxHeight: 40,
            padding: 5, margin: 2.5,
            borderStyle: 'solid', borderWidth: 5,
            backgroundColor: array.filter(valor => valor.valor == item).length == 1 ? array.filter(valor => valor.valor == item).map(valor => valor.cor) : ''
          }}
          onClick={() => {
            document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'flex';
          }}
        >
          {item}
        </div>
        {
          Seletor(obj, array, variavel)
        }
      </div >
    )
  }
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
          alignSelf: horizontal == 0 ? 'center' : 'flex-start',
          minWidth: largura_minima, width: largura, maxWidth: largura_maxima,
          minHeight: altura, height: altura, maxHeight: altura,
          padding: 5, margin: 2.5,
          borderStyle: 'solid', borderWidth: 5,
        }}
        title={placeholder}
        defaultValue={item}
        id={"campotexto - " + variavel + " - " + obj.id}
        onKeyUp={(e) => {
          console.log(e.target.value);
          document.getElementById("campotexto - " + variavel + " - " + obj.id).value = e.target.value.toUpperCase();
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            updatePaciente(obj, obj.id);
          }, 1000);
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

  function Header(titulo, minlargura, largura, maxlargura) {
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
        }}
      >
        <div>
          {titulo}
        </div>
      </div>
    )
  }
  const expand = (item) => {
    document.getElementById("detalhes: " + item.id).classList.toggle("expand");
    document.getElementById('logo alerta ' + item.id).classList.toggle("show");
  }

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
          <div style={{ width: 100 }}></div>
          {Header('SETOR', '10vw', '10vw', '10vw')}
          {Header('LEITO', 75, 75, 75)}
          {Header('STATUS', '10vw', '10vw', '10vw')}
          {Header('NOME', '20vw', '20vw', '20vw')}
          {Header('SITUAÇÃO', '20vw', '20vw', '20vw')}
          <div style={{ width: 80 }}></div>
        </div>
        {arraypacientes.filter(item => item.unidade_origem == unidade && item.passometro_leito != null).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => {
          let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
          let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
          let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
          let alertaaih = moment().diff(entrada, 'hours') > 12 && item.status == 'REAVALIAÇÃO';
          return (
            <div key={'pacientes' + item.id}
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
                  minWidth: 100, width: 100, maxWidth: 100,
                  height: 50, minHeight: 50, maxHeight: 50,
                  margin: 2.5,
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                }}>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YYYY')}
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
                {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", '10vw')}
                {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 75, 75, 75, 40)}
                {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                    {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                  </div>
                  <div id={"checklist para horizontal"}
                    style={{
                      display: horizontal == 1 ? 'flex' : 'none',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignContent: 'flex-start',
                    }}
                  >
                    {CampoChecklist('LAB', item, item.passometro_checklist_laboratorio, "hor-passometro_checklist_laboratorio", 80)}
                    {CampoChecklist('RX', item, item.passometro_checklist_rx, "hor-passometro_checklist_rx", 80)}
                    {CampoChecklist('E', item, item.passometro_checklist_evolucao, "hor-passometro_checklist_evolucao", 80)}
                    {CampoChecklist('P', item, item.passometro_checklist_prescricao, "hor-passometro_checklist_prescricao", 80)}
                    {CampoSelecaoTag(item, item.tag, arraytag, 'tag')}
                  </div>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'row', width: 95,
                  alignSelf: horizontal == 0 ? 'center' : 'flex-start',
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
                    onClick={() => { expand(item) }}
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
                      display: horizontal == 1 ? 'none' : 'flex',
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
        {arraypacientes.filter(item => item.unidade_origem == unidade && item.passometro_leito == null).map(item => {
          let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
          let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
          let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
          let alertaaih = moment().diff(entrada, 'hours') > 12 && item.status == 'REAVALIAÇÃO';
          return (
            <div key={'pacientes' + item.id}
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
                  minWidth: 100, width: 100, maxWidth: 100,
                  height: 50, minHeight: 50, maxHeight: 50,
                  margin: 2.5,
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                }}>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YYYY')}
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
                {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", '10vw')}
                {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 75, 75, 75, 40)}
                {CampoSelecao(item, item.status, arraystatus, "status", '10vw')}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '20vw', '20vw', '20vw', 40)}
                    {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                  </div>
                  <div id={"checklist para horizontal"}
                    style={{
                      display: horizontal == 1 ? 'flex' : 'none',
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
                  alignSelf: horizontal == 0 ? 'center' : 'flex-start',
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
                    onClick={() => { expand(item) }}
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
                      display: horizontal == 1 ? 'none' : 'flex',
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
        {arraypacientes.filter(item => item.unidade_origem == unidade && item.passometro_leito != null).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => {
          return (
            <div key={'pacientes' + item.id}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
              }}>
              <div
                className="row"
                style={{
                  display: 'flex',
                  justifyContent: 'center', flexWrap: 'nowrap',
                }}
              >
                {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 30, 30, 30, 40)}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '40vw', '40vw', '40vw', 40)}
                  {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                </div>
              </div>
              <div id={"detalhes: " + item.id}
                title="MAIS CAMPOS"
                className='expand'
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
                  position: 'relative',
                }}
              >
                {alertas(item)}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                  {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '80vw', '80vw', '80vw', 100)}
                  {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '80vw', '80vw', '80vw', 100)}
                  {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '80vw', '80vw', '80vw', 100)}
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
                      display: horizontal == 1 ? 'none' : 'flex',
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
                <div style={{
                  position: 'absolute', top: 2.5, right: 2.5,
                  display: 'flex', flexDirection: 'row', width: 50,
                  alignSelf: horizontal == 0 ? 'center' : 'flex-start',
                }}>
                  <div id="botão para deletar paciente do passômetro"
                    className='button-red'
                    title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                    style={{
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
            </div>
          )
        })}
        {arraypacientes.filter(item => item.unidade_origem == unidade && item.passometro_leito == null).map(item => {
          return (
            <div key={'pacientes' + item.id}
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center',
              }}>
              <div
                className="row"
                style={{
                  display: 'flex',
                  justifyContent: 'center', flexWrap: 'nowrap',
                  backgroundColor: '#fcf3cf',
                }}
              >
                {CampoTexto(item, isNaN(parseInt(item.passometro_leito)) ? '' : parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 30, 30, 30, 40)}
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", '40vw', '40vw', '40vw', 40)}
                  {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", '20vw', '20vw', '20vw', 40)}
                </div>
              </div>
              <div id={"detalhes: " + item.id}
                title="MAIS CAMPOS"
                className='expand'
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
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 'calc(100% - 20px)' }}>
                  {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", '80vw', '80vw', '80vw', 100)}
                  {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", '80vw', '80vw', '80vw', 100)}
                  {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", '80vw', '80vw', '80vw', 100)}
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
                      display: horizontal == 1 ? 'none' : 'flex',
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
                <div style={{
                  position: 'absolute', top: 2.5, right: 2.5,
                  display: 'flex', flexDirection: 'row', width: 50,
                  alignSelf: horizontal == 0 ? 'center' : 'flex-start',
                }}>
                  <div id="botão para deletar paciente do passômetro"
                    className='button-red'
                    title={'EXCLUIR PACIENTE DO PASSÔMETRO'}
                    style={{
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
            </div>
          )
        })}
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

  const alertas = (item) => {
    let entrada = moment(item.passometro_data, 'DD/MM/YYYY - HH:mm');
    let alertalaboratorio = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_laboratorio == 1;
    let alertarx = moment().diff(entrada, 'hours') > 3 && item.passometro_checklist_rx == 1;
    let alertaaih = moment().diff(entrada, 'hours') > 12 && item.status == 'REAVALIAÇÃO';
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
          width: window.innerWidth > mobilewidth ? '' : '80vw',
          fontSize: window.innerWidth > mobilewidth ? '' : 10,
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
          <img
            id="botão de alertas"
            alt=""
            src={alerta}
            style={{
              display: alertalaboratorio == true || alertarx == true || alertaaih == true ? 'flex' : 'none',
              margin: 0,
              height: 60,
              width: 60,
            }}
          >
          </img>
          <div className='text2'
            style={{
              margin: 2.5, textAlign: 'left', textDecoration: 'underline', fontSize: 16,
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
  const [status, setstatus] = useState('REAVALIAÇÃO');
  const resumo = () => {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        flexWrap: 'wrap',
      }}>
        {arraystatus.map(valor => (
          <div
            className={status == valor.valor ? 'button' : 'button weak'}
            key={'resumo ' + valor.valor}
            style={{
              width: window.innerWidth > mobilewidth ? 100 : 90,
              minWidth: window.innerWidth > mobilewidth ? 100 : 90,
              height: window.innerWidth > mobilewidth ? 100 : 90,
              fontSize: window.innerWidth > mobilewidth ? '' : 10,
              padding: 10,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              backgroundColor: valor.cor,
            }}
            onClick={() => {
              setstatus(valor.valor);
              loadPacientes(pacientes.filter(item => item.status == valor.valor && item.setor_origem == setor));
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

  const pdfHeaders = (item, largura) => {
    return (
      <div
        style={{
          padding: 5,
          borderColor: 'black', borderWidth: 2.5, borderStyle: 'solid',
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
          borderColor: 'transparent', borderWidth: 2.5, borderStyle: 'solid',
          width: largura,
          margin: 2.5,
        }}>
        {item}
      </div>
    )
  }
  function Conteudo() {
    let array = [];
    pacientes.filter(item => item.passometro_setor == setor && item.status == status).sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => array.push(item));
    return (
      <div id="PDF passometro"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignSelf: 'center',
          width: 'calc(100vw - 20px)',
          fontFamily: 'Helvetica',
          breakInside: 'auto',
          whiteSpace: 'pre-wrap',
        }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          {pdfHeaders('SETOR', 75)}
          {pdfHeaders('LEITO', 50)}
          {pdfHeaders('NOME', 400)}
          {pdfHeaders('SITUAÇÃO', 400)}
          {pdfHeaders('STATUS', 200)}
        </div>
        {array.filter(item => item.passometro_setor == setor).map(item => (
          <div key={'pacientes_pdf ' + item.id}
            style={{
              display: 'flex', flexDirection: 'row', justifyContent: 'center',
              backgroundColor: array.indexOf(item) % 2 == 0 ? '#f0f3f4' : ''
            }}>
            {pdfItens(item.passometro_setor, 75)}
            {pdfItens(item.passometro_leito, 50)}
            {pdfItens(item.nome_paciente, 400)}
            {pdfItens(item.passometro_situacao, 400)}
            {pdfItens(item.status, 200)}
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
        <table style={{ width: '100%' }}>
          <thead style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
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
                      breakInside: 'auto',
                      whiteSpace: 'pre-wrap',
                      alignSelf: 'center',
                      fontWeight: 'bolder',
                      textDecoration: 'underline',
                    }}>
                    {'PASSÔMETRO: ' + unidade + ' - ' + setor}
                  </div>
                </div>
              </td>
            </tr>
          </thead>
          <tbody style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div id="campos"
                  style={{
                    display: 'flex', flexDirection: 'column',
                    breakInside: 'auto', alignSelf: 'center', width: '100%'
                  }}>
                  <Conteudo></Conteudo>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot style={{ width: '100%' }}>
            <tr style={{ width: '100%' }}>
              <td style={{ width: '100%' }}>
                <div
                  style={{
                    fontFamily: 'Helvetica',
                    breakInside: 'auto',
                    whiteSpace: 'pre-wrap',
                  }}>
                  {moment().format('DD/MM/YYYY')}
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div >
    )
  };

  // modo de exibição (passômetro x tela de exibição)
  const [modo, setmodo] = useState(0);


  // alternar páginas.
  const [indexpacientes, setindexpacientes] = useState([]);

  let localpage = 1;
  const changePages = (quantidade, intervalo) => {
    axios.get(html + 'list_pacientes').then((response) => {
      var y = response.data.rows;
      var x = y.filter(item => item.setor_origem == setor && (item.status == 'REAVALIAÇÃO' || item.status == 'AIH ENFERMARIA' || item.status == 'AIH CTI'));
      setpacientes(x);
      let totalpacientes = x.length;
      console.log('TOTAL DE PACIENTES: ' + totalpacientes);
      let totalpaginas = Math.ceil(totalpacientes / quantidade);
      console.log('TOTAL DE PÁGINAS: ' + totalpaginas);
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
          {Header('SETOR', '10vw', '10vw', '10vw')}
          {Header('LEITO', 75, 75, 75)}
          {Header('NOME', '30vw', '30vw', '30vw')}
          {Header('STATUS', '30vw', '30vw', '30vw')}
        </div>
        {indexpacientes.sort().sort((a, b) => parseInt(a.passometro_leito) > parseInt(b.passometro_leito) ? 1 : -1).map(item => {
          return (
            <div key={'pacientes' + item.id}
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
                    minWidth: 100, width: 100, maxWidth: 100,
                    height: 50, minHeight: 50, maxHeight: 50,
                    margin: 2.5,
                    display: 'flex', flexDirection: 'column',
                    position: 'relative',
                  }}>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YYYY')}
                  </div>
                  <div>
                    {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                  </div>
                </div>
                {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", '10vw')}
                {CampoTexto(item, parseInt(item.passometro_leito), 'LEITO', "passometro_leito", 75, 75, 75, 40)}
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
