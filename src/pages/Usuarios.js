/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import Context from './Context';
// funções.
import toast from '../functions/toast';
import modal from '../functions/modal';
// imagens.
import power from '../images/power.svg';
import deletar from '../images/deletar.svg';
import editar from '../images/editar.svg';
import novo from '../images/novo.svg';

function Usuarios() {

  // context.
  const {
    html,
    usuario,
    pagina, setpagina,
    settoast,
    setdialogo,
  } = useContext(Context);

  // carregar lista de pacientes internados.
  const [usuarios, setusuarios] = useState();
  const [arrayusuarios, setarrayusuarios] = useState([]);
  const loadUsuarios = () => {
    axios.get(html + 'list_usuarios').then((response) => {
      setusuarios(response.data.rows);
      setarrayusuarios(response.data.rows);
    })
  }

  // inserir registro de usuario.
  const insertUsuario = () => {
    obj = {
      nome: null,
      contato: null,
      tipo: null,
      usuario: null,
      senha: '',
      upa_vn: 0,
      upa_pampulha: 0,
      upa_norte: 0,
      upa_nordeste: 0,
      upa_barreiro: 0,
    }
    axios.post(html + 'insert_usuario/', obj).then(() => {
      axios.get(html + 'list_usuarios').then((response) => {
        setusuarios(response.data.rows);
        setarrayusuarios(response.data.rows);
        toast(settoast, 'REGISTRO INSERIDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
      });
    });
  }

  // excluir registro de usuario.
  const deleteUsuario = (id) => {
    axios.get(html + 'delete_usuario/' + id).then(() => {
      loadUsuarios();
      toast(settoast, 'REGISTRO EXCLUÍDO COM SUCESSO', 'rgb(82, 190, 128, 1)', 3000);
    });
  }

  var obj = {}
  // atualizar registro de usuario.
  const updateUsuario = (id) => {
    obj = {
      nome: document.getElementById("campotexto - nome - " + id).value.toUpperCase(),
      contato: document.getElementById("campotexto - contato - " + id).value.toUpperCase(),
      tipo: document.getElementById("camposelecao - tipo - " + id).innerHTML,
      usuario: document.getElementById("campotexto - usuario - " + id).value.toUpperCase(),
      senha: usuario.senha,
      upa_vn: document.getElementById("check - upa_vn - " + id).innerHTML,
      upa_pampulha: document.getElementById("check - upa_pampulha - " + id).innerHTML,
      upa_norte: document.getElementById("check - upa_norte - " + id).innerHTML,
      upa_nordeste: document.getElementById("check - upa_nordeste - " + id).innerHTML,
      upa_barreiro: document.getElementById("check - upa_barreiro - " + id).innerHTML,
    }
    axios.post(html + 'update_usuario/' + id, obj).then(() => {
      console.log('ATUALIZAÇÃO DO REGISTRO REALIZADA COM SUCESSO.');
    });
  }

  var timeout = null;
  useEffect(() => {
    if (pagina == 'USUARIOS') {
      loadUsuarios();
    }
    // eslint-disable-next-line
  }, [pagina])

  // identificação do usuário.
  function Usuario() {
    return (
      <div style={{
        display: 'flex', flexDirection: 'row',
      }}>
        <div className='button-red' onClick={() => setpagina('PASSOMETRO')} title="SAIR">
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
        <div className='text1'>{usuario.nome}</div>
      </div>
    )
  }

  const [filterusuario, setfilterusuario] = useState('');
  var searchusuario = '';
  const filterUsuario = () => {
    clearTimeout(timeout);
    document.getElementById("searchUsuario").focus();
    searchusuario = document.getElementById("searchUsuario").value.toUpperCase();
    timeout = setTimeout(() => {
      if (searchusuario == '') {
        setfilterusuario('');
        setarrayusuarios(usuarios);
        document.getElementById("searchUsuario").value = '';
        setTimeout(() => {
          document.getElementById("searchUsuario").focus();
        }, 100);
      } else {
        setfilterusuario(document.getElementById("searchUsuario").value.toUpperCase());
        setarrayusuarios(usuarios.filter(item => item.nome != null && item.nome.includes(searchusuario) == true));
        document.getElementById("searchUsuario").value = searchusuario;
        setTimeout(() => {
          document.getElementById("searchUsuario").focus();
        }, 100);
      }
    }, 1000);
  }

  // filtro de paciente por nome.
  function FilterUsuario() {
    return (
      <input
        className="input"
        autoComplete="off"
        placeholder="BUSCAR USUÁRIO..."
        onFocus={(e) => (e.target.placeholder = '')}
        onBlur={(e) => (e.target.placeholder = 'BUSCAR USUÁRIO...')}
        onKeyUp={() => filterUsuario()}
        style={{
          display: 'flex',
          width: '15vw',
          margin: 5,
        }}
        type="text"
        id="searchUsuario"
        defaultValue={filterusuario}
        maxLength={100}
      ></input>
    )
  }

  // lista de pacientes internados.
  const ListaDeUsuarios = useCallback(() => {
    return (
      <div
        style={{ position: 'relative', flexDirection: 'column', justifyContent: 'flex-start', width: '100%' }}
      >
        <div
          style={{
            display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            position: 'absolute', top: 0, right: 0, left: 0,
          }}>
          <Usuario></Usuario>
          <FilterUsuario></FilterUsuario>
        </div>
        <div style={{ marginTop: 100 }}>
          <div className="text3">{'USUÁRIOS CADASTRADOS'}</div>
          <ListaUsuarios></ListaUsuarios>
          <div className="text3" style={{ height: '70vh', display: arrayusuarios.length > 0 ? 'none' : 'flex', color: 'rgb(82, 190, 128, 1)' }}>SEM USUÁRIOS CADASTRADOS</div>
        </div>
      </div >
    )
    // eslint-disable-next-line
  }, [arrayusuarios]);

  const arraytipouusario = [
    'GESTOR',
    'MÉDICO',
    'MÉDICO HORIZONTAL',
    'ENFERMEIRO NIR',
    'ENFERMEIRO ASSISTENCIAL'
  ]

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
                updateUsuario(obj.id);
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
              updateUsuario(obj.id);
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
              updateUsuario(obj.id);
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
            backgroundColor: item == 1 ? '#82e0aa' : '',
          }}
          onClick={() => {
            if (document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML == 0) {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 1;
              document.getElementById('check - ' + variavel + ' - ' + obj.id).style.backgroundColor = '#82e0aa'
            } else {
              document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML = 0
              document.getElementById('check - ' + variavel + ' - ' + obj.id).style.backgroundColor = ''
            }
            console.log(document.getElementById('check - ' + variavel + ' - ' + obj.id).innerHTML);
            updateUsuario(obj.id);
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
    document.getElementById("detalhes: usuarios " + item.id).classList.toggle("expand");
  }

  function ListaUsuarios() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <div
          id="header - usuários"
          className="row"
          style={{
            justifyContent: 'flex-start', flexWrap: 'nowrap'
          }}
        >
          {Header('NOME', 200, '100%', 1)}
          {Header('CONTATO', 200, 200, 0)}
          {Header('TIPO', 200, 200, 0)}
          {Header('USUARIO', 200, 200, 0)}
        </div>
        {arrayusuarios.sort((a, b) => a.nome < b.nome ? 1 : -1).map(item => (
          <div key={'usuarios' + item.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
            <div
              className="row"
              style={{
                display: 'flex',
                position: 'relative',
                justifyContent: 'center', flexWrap: 'nowrap'
              }}
            >

              {CampoTexto(item, item.nome, 'NOME', "nome", 200, '100%', 1)}
              {CampoTexto(item, item.contato, 'CONTATO', "contato", 200, 200, 0)}
              {CampoSelecao(item, item.tipo, arraytipouusario, "tipo", 200)}
              {CampoTexto(item, item.usuario, 'USUÁRIO', "usuario", 200, 200, 0)}

              <div style={{ position: 'absolute', bottom: -15, right: -5, display: 'flex', flexDirection: 'row' }}>
                <div id={"toggle_details usuarios" + item.id}
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
                <div id="botão para deletar usuário do passômetro"
                  className='button-red'
                  title={'EXCLUIR USUÁRIO DO SISTEMA'}
                  style={{
                    minWidth: 30, width: 30, maxWidth: 30,
                    minHeight: 30, height: 30, maxHeight: 30,
                    alignSelf: 'center',
                  }}
                  onClick={
                    (e) => {
                      modal(setdialogo, item.id, 'CONFIRMAR EXCLUSÃO DO USUÁRIO?', deleteUsuario, item.id); e.stopPropagation();
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
            <div id={"detalhes: usuarios " + item.id}
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
              <div style={{
                display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
              }}>
                {CampoChecklist('UPA-VN', item, item.upa_vn, "upa_vn")}
                {CampoChecklist('UPA-PAMPULHA', item, item.upa_norte, 'upa_pampulha')}
                {CampoChecklist('UPA-NORTE', item, item.upa_norte, 'upa_norte')}
                {CampoChecklist('UPA-NORDESTE', item, item.upa_norte, 'upa_nordeste')}
                {CampoChecklist('UPA-BARREIRO', item, item.upa_barreiro, 'upa_barreiro')}

              </div>
            </div>
          </div>
        ))
        }
        <div id="botão para deletar usuário do passômetro"
          className='button-green'
          title={'INSERIR USUÁRIO'}
          style={{
            minWidth: 40, width: 40, maxWidth: 40,
            minHeight: 40, height: 40, maxHeight: 40,
            alignSelf: 'center',
          }}
          onClick={
            () => { insertUsuario() }}
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
        display: pagina == 'USUARIOS' ? 'flex' : 'none', backgroundColor: '#f2f2f2',
        height: '100vh', overflowY: 'scroll',
        borderStyle: 'none',
        borderWidth: 0,
        borderRadius: 0,
      }}>
      <ListaDeUsuarios></ListaDeUsuarios>
    </div>
  );
}

export default Usuarios;