/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import toast from '../functions/toast';
// imagens.
import pbh from '../images/pbh.svg';
import refresh from '../images/refresh.svg';

function Login() {

  // context.
  const {
    html,
    pagina, setpagina,
    settoast,
    usuario,
    setusuario,
    setunidade,
  } = useContext(Context);

  let user = null;
  let password = null;
  useEffect(() => {
    listUsuarios();
  }, [pagina])

  // lista de usuários.
  const [usuarios, setusuarios] = useState([]);
  const listUsuarios = () => {
    axios.get(html + 'list_usuarios/').then((response) => {
      setusuarios(response.data.rows);
    });
  }


  // checando se o usuário inserido está registrado no sistema.
  var timeout = null;
  const checkLogin = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      user = document.getElementById('inputUsuario').value
      password = document.getElementById('inputSenha').value
      var obj = {
        usuario: user,
        senha: password,
      }
      axios.post(html + 'checkusuario', obj).then((response) => {
        var x = [0, 1];
        x = response.data;
        if (x.rows.length == 1) {
          document.getElementById("inputs_login_senha").style.display = 'none';
          document.getElementById("inputs_login_senha").style.visibility = 'hidden';
          var objeto = x.rows.pop();
          setusuario(
            {
              id: objeto.id,
              nome: objeto.nome,
              contato: objeto.contato,
              tipo: objeto.tipo,
              usuario: objeto.usuario,
              senha: objeto.senha,
              upa_vn: objeto.upa_vn,
              upa_pampulha: objeto.upa_pampulha,
              upa_norte: objeto.upa_norte,
              upa_nordeste: objeto.upa_nordeste,
              upa_barreiro: objeto.upa_barreiro,
            }
          );
          // usuário já tem senha cadastrada.
          if (objeto.senha != '') {
            // toast(settoast, 'BEM-VINDO, ' + objeto.nome, 'rgb(82, 190, 128, 1)', 3000);
            if (objeto.tipo == 'GESTOR-TS') {
              setpagina(2);
            } else if (objeto.tipo == 'MOTORISTA-TS') {
              setpagina(3);
            } else if (objeto.tipo == 'GERENTE') {
              // abrir componente para acesso ao passômetro, cadastro de usuários e indicadores.
              setpagina(4);
            } else if (objeto.tipo == 'ASSISTENCIAL' || objeto.tipo == 'NIR') {
              setviewunidades(1);
            }
          } else {
            document.getElementById("inputs_login_senha").style.visibility = 'hidden';
            document.getElementById("inputs_login_senha").style.display = 'none';
            setcadastrasenha(1);
          }
        } else {
          toast(settoast, 'USUÁRIO OU SENHA INCORRETOS', 'rgb(231, 76, 60, 1)', 3000);
        }
      });
    }, 1000);
  }

  function Unidade(titulo, acesso) {
    return (
      <div className='button'
        style={{
          display: acesso == 1 ? 'flex' : 'none',
          width: 200,
        }}
        onClick={() => {
          setunidade(titulo);
          if (usuario.tipo == 'ASSISTENCIAL') {
            setpagina('PASSOMETRO');
          } else if (usuario.tipo == 'NIR') {
            setpagina(1);
          }
        }}
      >
        {titulo}
      </div >
    )
  }

  const [viewunidades, setviewunidades] = useState(0);
  function SeletorUnidade() {
    return (
      <div style={{
        display: viewunidades == 1 && usuario.senha != '' ? 'flex' : 'none', flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {Unidade('UPA-VN', usuario.upa_vn)}
        {Unidade('UPA-PAMPULHA', usuario.upa_pampulha)}
      </div>
    )
  }

  const registrarSenha = () => {
    let novasenha = document.getElementById("inputNovaSenha");
    let repetirsenha = document.getElementById("inputRepetirSenha");
    if (novasenha.value == repetirsenha.value && novasenha.value != '') {
      let obj = {
        nome: usuario.nome,
        contato: usuario.contato,
        tipo: usuario.tipo,
        usuario: usuario.usuario,
        senha: novasenha.value,
        upa_vn: usuario.upa_vn,
        upa_pampulha: usuario.upa_pampulha,
        upa_norte: usuario.upa_norte,
        upa_nordeste: usuario.upa_nordeste,
        upa_barreiro: usuario.upa_barreiro,
      }
      console.log(obj);
      axios.post(html + 'update_usuario/' + usuario.id, obj).then(() => {
        console.log('SENHA REGISTRADA COM SUCESSO.');
        setcadastrasenha(0);
        document.getElementById("inputs_login_senha").style.visibility = 'visible';
        document.getElementById("inputs_login_senha").style.display = 'flex';
        setpagina(0);
      });
    } else {
      toast(settoast, 'SENHA EM BRANCO OU NÃO CONFERE.', 'rgb(231, 76, 60, 1)', 3000);
      novasenha.value = '';
      repetirsenha.value = '';
      novasenha.focus();
    }
  }

  const [cadastrasenha, setcadastrasenha] = useState(0);
  function CadastroDeSenha() {
    return (
      <div
        style={{
          display: cadastrasenha == 1 ? 'flex' : 'none',
          backgroundColor: '#b2babb',
          borderRadius: 5,
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}
      >
        <div className='text2'>{'BEM-VINDO(A), ' + usuario.nome + '. POR FAVOR, CADASTRE SUA SENHA.'}</div>
        <input
          autoComplete="off"
          placeholder="NOVA SENHA"
          className="input"
          type="password"
          id="inputNovaSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SENHA')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="REPETIR SENHA"
          className="input"
          type="password"
          id="inputRepetirSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'REPETIR SENHA')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <div className='button'
          onClick={() => registrarSenha()}
          style={{ width: 100 }}
        >
          OK
        </div>
      </div>
    )
  }

  return (
    <div className="main cor3 fadein" style={{ display: pagina == 0 ? 'flex' : 'none' }}>
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          right: 20,
          left: 20,
          opacity: 0.4,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
        <img
          alt=""
          src={pbh}
          style={{
            margin: 10,
            height: 50,
          }}
        ></img>
      </div>
      <div className="text3" style={{ margin: 20, fontSize: 20 }}>NIRVANA</div>
      <div id="inputs_login_senha" style={{ display: 'flex', flexDirection: 'column' }}>
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'USUÁRIO')}
          onChange={(e) => (user = e.target.value)}
          onKeyUp={(e) => {
            clearTimeout(timeout);
            console.log(document.getElementById("inputUsuario").value);
            timeout = setTimeout(() => {
              let checkusuario = usuarios.filter(valor => valor.usuario == document.getElementById('inputUsuario').value);
              if (checkusuario.length == 1 && checkusuario.map(valor => valor.senha).pop() == '') {
                document.getElementById("inputs_login_senha").style.visibility = 'hidden';
                document.getElementById("inputs_login_senha").style.display = 'none';
                // setcatchusuario(checkusuario.map(valor => valor.nome).pop());

                setusuario(
                  {
                    id: checkusuario.map(valor => valor.id).pop(),
                    nome: checkusuario.map(valor => valor.nome).pop(),
                    contato: checkusuario.map(valor => valor.contato).pop(),
                    tipo: checkusuario.map(valor => valor.tipo).pop(),
                    usuario: checkusuario.map(valor => valor.usuario).pop(),
                    upa_vn: checkusuario.map(valor => valor.upa_vn).pop(),
                    upa_pampulha: checkusuario.map(valor => valor.upa_pampulha).pop(),
                    upa_norte: checkusuario.map(valor => valor.upa_norte).pop(),
                    upa_nordeste: checkusuario.map(valor => valor.upa_nordeste).pop(),
                    upa_barreiro: checkusuario.map(valor => valor.upa_barreiro).pop(),
                  }
                );

                setcadastrasenha(1);
              }
            }, 1000);
          }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <input
          autoComplete="off"
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SENHA')}
          onChange={(e) => { password = e.target.value; checkLogin() }}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
      </div>
      <SeletorUnidade></SeletorUnidade>
      <CadastroDeSenha></CadastroDeSenha>
      <div
        style={{ marginTop: 10 }}
        className='button-red'
        onClick={() => {
          window.location.reload();
        }} title="ATUALIZAR">
        <img
          alt=""
          src={refresh}
          style={{
            margin: 10,
            height: 30,
            width: 30,
          }}
        ></img>
      </div>
    </div>
  );
}

export default Login;