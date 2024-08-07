/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import toast from '../functions/toast';
// imagens.
import pbh from '../images/pbh.svg';

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
    // eslint-disable-next-line
  }, [pagina])

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
          var objeto = x.rows.pop();
          setusuario(
            {
              id: objeto.id,
              nome: objeto.nome,
              contato: objeto.contato,
              tipo: objeto.tipo,
              usuario: objeto.usuario,
              upa_vn: objeto.upa_vn,
              upa_pampulha: objeto.upa_pampulha,
              upa_norte: objeto.upa_norte,
              upa_nordeste: objeto.upa_nordeste,
              upa_barreiro: objeto.upa_barreiro,
            }
          );
          // usuário já tem senha cadastrada.
          if (objeto.senha != '') {
            toast(settoast, 'BEM-VINDO, ' + objeto.nome, 'rgb(82, 190, 128, 1)', 3000);
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
      <div style={{ display: viewunidades == 1 && usuario.senha != '' ? 'flex' : 'none' }}>
        {Unidade('UPA-VN', usuario.upa_vn)}
        {Unidade('UPA-PAMPULHA', usuario.upa_pampulha)}
      </div>
    )
  }

  const registrarSenha = () => {
    let novasenha = document.getElementById("inputNovaSenha");
    let repetirsenha = document.getElementById("inputRepetirSenha");
    if (novasenha.value == repetirsenha.value) {
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
      axios.post(html + 'update_usuario/' + usuario.id, obj).then(() => {
        console.log('SENHA REGISTRADA COM SUCESSO.');
        setcadastrasenha(0);
        setpagina(0);
      });
    } else {
      toast(settoast, 'SENHA REPETIDA NÃO CONFERE', 'rgb(231, 76, 60, 1)', 3000);
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
          placeholder="SENHA"
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
          placeholder="SENHA"
          className="input"
          type="password"
          id="inputRepetirSenha"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'SENHA')}
          style={{
            marginTop: 10,
            marginBottom: 10,
            width: 200,
            height: 50,
          }}
        ></input>
        <div className='button'
          onClick={() => registrarSenha()}
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
      <div id="inputs_login_senha">
        <input
          autoComplete="off"
          placeholder="USUÁRIO"
          className="input"
          type="text"
          id="inputUsuario"
          onFocus={(e) => (e.target.placeholder = '')}
          onBlur={(e) => (e.target.placeholder = 'USUÁRIO')}
          onChange={(e) => (user = e.target.value)}
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
    </div>
  );
}

export default Login;