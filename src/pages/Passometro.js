/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useCallback, useState } from 'react';
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
  } = useContext(Context);

  // carregar lista de pacientes internados.
  const [arraypacientes, setarraypacientes] = useState(pacientes);
  const loadPacientes = () => {
    axios.get(html + 'list_pacientes').then((response) => {
      setpacientes(response.data.rows);
      setarraypacientes(response.data.rows);
      console.log('## INFO ## \nLISTA DE PACIENTES INTERNADOS CARREGADA.\nTOTAL DE PACIENTES INTERNADOS: ' + response.data.rows.length);
    })
  }

  // inserir registro de pacientes.
  const insertPaciente = () => {
    obj = {
      aih: null,
      procedimento: null,
      unidade_origem: unidade,
      setor_origem: null,
      nome_paciente: null,
      nome_mae: null,
      dn_paciente: null,
      status: 'REAVALIAÇÃO',
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
      passometro_situacao: null,
      passometro_breve_historico: null,
      passometro_avaliacao: null,
      passometro_recomendacao: null,
      passometro_peso: null,
      passometro_notificacao_srag: null,
      passometro_notificacao_dengue: null,
      passometro_checklist_teste_covid: null,
      passometro_checklist_teste_dengue: null,
      passometro_checklist_evolucao: null,
      passometro_checklist_prescricao: null,
      passometro_checklist_laboratorio: null,
      passometro_checklist_rx: null,
      passometro_setor: null,
      passometro_data: moment().format('DD/MM/YYYY - HH:mm')
    }
    axios.post(html + 'insert_paciente/', obj).then(() => {
      axios.get(html + 'list_pacientes').then((response) => {
        setpacientes(response.data.rows);
        setarraypacientes(response.data.rows);
        toast(settoast, 'REGISTRO INSERIDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      });
    });
  }

  // excluir registro de pacientes.
  const deletePaciente = (id) => {
    axios.get(html + 'delete_paciente/' + id).then(() => {
      loadPacientes();
      toast(settoast, 'REGISTRO EXCLUÍDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
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
      passometro_checklist_evolucao: document.getElementById("check - passometro_checklist_evolucao - " + id).innerHTML,
      passometro_checklist_prescricao: document.getElementById("check - passometro_checklist_prescricao - " + id).innerHTML,
      passometro_checklist_laboratorio: document.getElementById("check - passometro_checklist_laboratorio - " + id).innerHTML,
      passometro_checklist_rx: document.getElementById("check - passometro_checklist_rx - " + id).innerHTML,
      passometro_setor: document.getElementById("camposelecao - passometro_setor - " + id).innerHTML,
      passometro_data: item.passometro_data
    }
    console.log(obj);
    axios.post(html + 'update_paciente/' + id, obj).then(() => {
      console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
    });
  }

  var timeout = null;
  useEffect(() => {
    if (pagina == 'PASSOMETRO') {
      loadSetores();
      loadPacientes();
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
        <div className='button' onClick={() => setpagina('USUARIOS')} title="CADASTRO DE USUÁRIOS">
          <img
            alt=""
            src={people}
            style={{
              margin: 10,
              height: 30,
              width: 30,
            }}
          ></img>
        </div>
        <div className='text1'>{usuario.nome}</div>
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
          display: 'flex',
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
  const ListaDePacientes = useCallback(() => {
    return (
      <div
        style={{ position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}
      >
        <div
          // className='cor1'
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            position: 'absolute', top: 0, right: 0, left: 0,
          }}>
          <Usuario></Usuario>
          <FilterPaciente></FilterPaciente>
        </div>
        <div style={{ marginTop: 100 }}>
          <div className="text3">{'PASSÔMETRO - ' + unidade}</div>
          <PassometroAmarela></PassometroAmarela>
          <div className="text3" style={{ height: '70vh', display: arraypacientes.length > 0 ? 'none' : 'flex', color: 'rgb(82, 190, 128, 1)' }}>SEM PACIENTES INTERNADOS NA UNIDADE</div>
        </div>
      </div >
    )
    // eslint-disable-next-line
  }, [arraypacientes]);

  const arraystatus = [
    "REAVALIAÇÃO",
    "AIH",
    "ALTA",
    "TRANSFERÊNCIA",
    "EVASÃO",
    "ÓBITO",
  ]

  /*
  const arraytipoleito = [
    "CTI",
    "CTI - ISOLADO",
    "ENFERMARIA",
    "ENF - ISOLADO"
  ]
  */

  const [arraypassometrosetor, setarraypassometrosetor] = useState([]);
  const loadSetores = () => {
    if (unidade == 'UPA-VN') {
      setarraypassometrosetor([
        "SE",
        "SE PED",
        "UDC",
        "OBS 1",
        "OBS 2",
        "OBS 3",
        "OBS PED"
      ]);
    }
  }

  function Seletor(obj, array, variavel) {
    let x = [];
    x = array;
    return (
      <div className='fundo' id={"lista - " + variavel + " - " + obj.id} style={{ display: 'none', zIndex: 5 }}>
        <div className='janela'>
          {x.map(item => (
            <div className="button"
              key={'seletor ' + item}
              id={"opcao - " + item}
              style={{ width: 200 }}
              onClick={() => {
                document.getElementById("camposelecao - " + variavel + " - " + obj.id).innerHTML = item;
                var botoes = document.getElementById("lista - " + variavel + " - " + obj.id).getElementsByClassName("button-red");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "button";
                }
                document.getElementById("opcao - " + item).className = "button-red";
                document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'none';
                // alterando a cor do botão conforme o setor definido.
                if (item == 'SE' || item == 'SE PED') {
                  document.getElementById("camposelecao - " + variavel + " - " + obj.id).style.backgroundColor = '#ec7063';
                } else if (item == 'UDC') {
                  document.getElementById("camposelecao - " + variavel + " - " + obj.id).style.backgroundColor = '#f7dc6f';
                } else {
                  document.getElementById("camposelecao - " + variavel + " - " + obj.id).style.backgroundColor = '';
                }
                updatePaciente(obj, obj.id);
              }}
            >
              {item}
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
            backgroundColor: (item == 'SE' || item == 'SE PED') ? '#ec7063' : item == 'UDC' ? '#f7dc6f' : '',
            minWidth: largura, width: largura, maxWidth: largura,
            height: 50, minHeight: 0, maxHeight: 50, margin: 2.5
          }}
          onClick={() => {
            document.getElementById("lista - " + variavel + " - " + obj.id).style.display = 'flex';
            console.log(obj);
          }}
        >
          {item}
        </div>
        {Seletor(obj, array, variavel)}
      </div>
    )
  }
  // campo no passômetro para edição (texto).
  function CampoTexto(obj, item, placeholder, variavel, largura_minima, largura, grow) {
    if (grow == 0) {
      return (
        <input
          className="input"
          placeholder={placeholder}
          onFocus={(e) => (e.target.placeholder = '')}
          style={{
            display: 'flex', flexDirection: 'center',
            minWidth: largura_minima,
            width: largura, maxWidth: largura,
            height: 50, minHeight: 0, maxHeight: 100,
            padding: 5,
            margin: 2.5,
            borderStyle: 'none',
            borderWidth: 0,
          }}
          title={placeholder}
          defaultValue={item}
          id={"campotexto - " + variavel + " - " + obj.id}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              updatePaciente(obj, obj.id);
            }, 1000);
          }}
        ></input>
      )
    } else {
      return (
        <textarea
          className="textarea"
          placeholder={placeholder}
          onFocus={(e) => (e.target.placeholder = '')}
          style={{
            display: 'flex', flexDirection: 'center',
            minWidth: largura_minima,
            width: largura, maxWidth: largura,
            height: 50, minHeight: 0, maxHeight: 100,
            padding: 5,
            margin: 2.5,
            borderStyle: 'none',
            borderWidth: 0,
          }}
          title={placeholder}
          defaultValue={item}
          id={"campotexto - " + variavel + " - " + obj.id}
          onKeyUp={() => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
              updatePaciente(obj, obj.id);
            }, 1000);
          }}
        ></textarea>
      )
    }
  }
  // campo para checklist.
  function CampoChecklist(titulo, obj, item, variavel) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: 300 }}>
        <div
          id={'check - ' + variavel + ' - ' + obj.id}
          className='button'
          style={{
            minHeight: 20, height: 20, maxHeight: 20,
            minWidth: 20, width: 20, maxWidth: 20,
            color: 'transparent',
            backgroundColor: item == 1 ? '#f7dc6f' : item == 2 ? '#82e0aa' : '',
          }}
          onClick={() => {
            if (document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML == 0) {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 1;
              document.getElementById('check - ' + variavel + ' - ' + obj.id).style.backgroundColor = '#f7dc6f';
            } else if (document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML == 1) {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 2;
              document.getElementById('check - ' + variavel + ' - ' + obj.id).style.backgroundColor = '#82e0aa'
            } else {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 0
              document.getElementById('check - ' + variavel + ' - ' + obj.id).style.backgroundColor = ''
            }
            updatePaciente(obj, obj.id);
          }}
        >
          {item}
        </div>
        <div className='text1' style={{ alignSelf: 'center' }}>{titulo}</div>
      </div>
    )
  }

  function Header(titulo, largura_minima, largura, grow) {
    if (grow == 0) {
      return (
        <div className="button"
          style={{
            minWidth: largura,
            width: largura, maxWidth: largura,
            height: 30, minHeight: 0, maxHeight: 30, margin: 2.5,
            display: 'flex', flexDirection: 'column',
            backgroundColor: 'transparent',
            color: 'black',
            marginBottom: -10,
          }}>
          <div>
            {titulo}
          </div>
        </div>
      )
    } else {
      return (
        <input
          className="textarea"
          defaultValue={titulo}
          style={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            minWidth: largura_minima, width: largura, maxWidth: largura,
            height: 30, minHeight: 0, maxHeight: 30,
            backgroundColor: 'transparent',
            padding: 5, margin: 2.5,
            borderStyle: 'none',
            borderWidth: 0,
            pointerEvents: 'none',
            textAlign: 'center',
            alignItems: 'center',
            marginBottom: -10,
          }}>
        </input>
      )
    }
  }

  const expand = (item) => {
    document.getElementById("detalhes: " + item.id).classList.toggle("expand");
  }

  function PassometroAmarela() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div
          id="header - passômetro"
          className="row"
          style={{
            justifyContent: 'flex-start', flexWrap: 'nowrap'
          }}
        >
          {Header('ENTRADA', 100, 100, 0)}
          {Header('SETOR', 100, 100, 0)}
          {Header('LEITO', 80, 80, 0)}
          {Header('STATUS', 200, 200, 0)}
          {Header('NOME', 200, '100%', 1)}
          {Header('SITUAÇÃO', 200, '100%', 1)}
        </div>
        {arraypacientes.sort((a, b) => moment(a.passometro_data, 'DD/MM/YYYY - HH:mm') < moment(b.passometro_data, 'DD/MM/YYYY - HH:mm') ? 1 : -1).filter(item => item.unidade_origem == unidade).sort((a, b) => moment(a.passometro_data) < moment(b.passometro_data) ? 1 : -1).map(item => (
          <div key={'pacientes' + item.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
            <div
              className="row"
              style={{
                display: 'flex',
                position: 'relative',
                justifyContent: 'center', flexWrap: 'nowrap'
              }}
            >
              <div className="button" style={{
                minWidth: 100, width: 100, maxWidth: 100,
                height: 50, minHeight: 0, maxHeight: 50, margin: 2.5,
                display: 'flex', flexDirection: 'column',
              }}>
                <div>
                  {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('DD/MM/YYYY')}
                </div>
                <div>
                  {moment(item.passometro_data, 'DD/MM/YYYY - HH:mm').format('HH:mm')}
                </div>
              </div>
              {CampoSelecao(item, item.passometro_setor, arraypassometrosetor, "passometro_setor", 100)}
              {CampoTexto(item, item.passometro_leito, 'LEITO', "passometro_leito", 80, 80, 0)}
              {CampoSelecao(item, item.status, arraystatus, "status", 200)}
              {CampoTexto(item, item.nome_paciente, 'NOME DO PACIENTE', "nome_paciente", 200, '100%', 1)}
              {CampoTexto(item, item.passometro_situacao, 'SITUAÇÃO', "passometro_situacao", 200, '100%', 1)}
              <div style={{ position: 'absolute', bottom: -15, right: -5, display: 'flex', flexDirection: 'row' }}>
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
                marginTop: -5,
                alignSelf: 'center',
                width: 'calc(100vw - 60px)',
              }}
            >
              {CampoTexto(item, item.passometro_breve_historico, "BREVE HISTÓRICO", "passometro_breve_historico", 300, 'calc(100% - 20px)', 1)}
              {CampoTexto(item, item.passometro_avaliacao, "AVALIAÇÃO", "passometro_avaliacao", 300, 'calc(100% - 20px)', 1)}
              {CampoTexto(item, item.passometro_recomendacao, "RECOMENDAÇÃO", "passometro_recomendacao", 300, 'calc(100% - 20px)', 1)}
              <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
              }}>
                {CampoChecklist('NOTIFICAÇÃO SRAG', item, item.passometro_notificacao_srag, "passometro_notificacao_srag")}
                {CampoChecklist('NOTIFICAÇÃO DENGUE', item, item.passometro_notificacao_dengue, "passometro_notificacao_dengue")}
                {CampoChecklist('TESTE COVID', item, item.passometro_checklist_teste_covid, "passometro_checklist_teste_covid")}
                {CampoChecklist('TESTE DENGUE', item, item.passometro_checklist_teste_dengue, "passometro_checklist_teste_dengue")}
                {CampoChecklist('EVOLUÇÃO', item, item.passometro_checklist_evolucao, "passometro_checklist_evolucao")}
                {CampoChecklist('PRESCRIÇÃO', item, item.passometro_checklist_prescricao, "passometro_checklist_prescricao")}
                {CampoChecklist('LABORATÓRIO', item, item.passometro_checklist_laboratorio, "passometro_checklist_laboratorio")}
                {CampoChecklist('RX', item, item.passometro_checklist_rx, "passometro_checklist_rx")}
              </div>
            </div>
          </div>
        ))
        }
        <div id="botão para deletar paciente do passômetro"
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
      </div >
    )
  }

  return (
    <div
      className='scroll'
      style={{
        display: pagina == 'PASSOMETRO' ? 'flex' : 'none', backgroundColor: '#f2f2f2',
        height: '100vh', overflowY: 'scroll',
        borderStyle: 'none',
        borderWidth: 0,
        borderRadius: 0,
      }}>
      <ListaDePacientes></ListaDePacientes>
    </div>
  );
}

export default Passometro;