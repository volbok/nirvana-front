/* eslint eqeqeq: "off" */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Context from './Context';
import toast from '../functions/toast';
// imagens.
import pbh from '../images/pbh.svg';
import refresh from '../images/refresh.svg';
import dharma from '../images/dharma.png';
import power from '../images/power.svg';

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
  }, [pagina]);

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
            if (objeto.tipo == 'MASTER') {
              setpagina(2);
            } else if (objeto.tipo == 'MOTORISTA-TS') {
              setpagina(3);
            } else if (objeto.tipo == 'GESTOR') {
              // abrir componente para acesso ao passômetro, cadastro de usuários e indicadores.
              setpagina(4);
            } else if (objeto.tipo.includes('ASSISTENCIAL') || objeto.tipo.includes('NIR') || objeto.tipo.includes('HORIZONTAL')) {
              setviewunidades(1);
            }
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
          if (usuario.tipo.includes('ASSISTENCIAL') || usuario.tipo.includes('NIR') || usuario.tipo.includes('HORIZONTAL')) {
            setpagina('PASSOMETRO');
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

  const registrarUsuario = () => {
    let nome = document.getElementById("inputUsuarioNome").value.toUpperCase();
    let contato = document.getElementById("inputUsuarioContato").value.toUpperCase();
    let matricula = document.getElementById("inputUsuarioMatricula").value.toUpperCase();
    let senha = document.getElementById("inputUsuarioSenha");
    let repetirsenha = document.getElementById("inputRepetirSenha");
    console.log(nome);
    if (
      nome != null && nome != '' &&
      contato != null && contato != '' &&
      matricula != null && matricula != '' &&
      senha.value != null && senha.value != '' && senha.value == repetirsenha.value
    ) {
      let obj = {
        nome: nome,
        contato: contato,
        tipo: localStorage.getItem('tipo_usuario'),
        usuario: matricula,
        senha: senha.value,
        upa_vn: usuario.upa_vn,
        upa_pampulha: usuario.upa_pampulha,
        upa_norte: usuario.upa_norte,
        upa_nordeste: usuario.upa_nordeste,
        upa_barreiro: usuario.upa_barreiro,
      }
      axios.post(html + 'insert_usuario', obj).then(() => {
        console.log('USUARIO REGISTRADO COM SUCESSO.');
        setcadastrasenha(0);
        document.getElementById("inputs_login_senha").style.visibility = 'visible';
        document.getElementById("inputs_login_senha").style.display = 'flex';
        setpagina(0);
      });
    } else {
      toast(settoast, 'CAMPO EM BRANCO OU SENHA NÃO CONFERE.', 'rgb(231, 76, 60, 1)', 3000);
      senha.value = '';
      senha.value = '';
      senha.focus();
    }
  }

  let categoria_profissional = [
    'GESTOR',
    'MÉDICO',
    'MÉDICO HORIZONTAL',
    'ENFERMEIRO NIR',
    'ENFERMEIRO ASSISTENCIAL'
  ]

  const [cadastrasenha, setcadastrasenha] = useState(0);
  function CadastroDeSenha() {
    return (
      <div
        className='scroll'
        style={{
          display: cadastrasenha == 1 ? 'flex' : 'none',
          backgroundColor: '#b2babb',
          borderColor: '#b2babb',
          borderRadius: 5,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignContent: 'center',
          alignItems: 'center',
          padding: 20,
          height: '60vh',
          zIndex: 10,
        }}
      >
        <div className='text2' style={{ fontSize: 18 }}>{'BEM-VINDO(A)! POR FAVOR, CADASTRE SEUS DADOS, INCLUÍNDO MATRÍCULA E SUA SENHA.'}</div>
        <div className='text2' style={{ fontSize: 14, opacity: 0.8, margin: 2.5, marginTop: -5 }}>{'CADASTRE SUA MATRÍCULA USANDO APENAS LETRAS MAIÚSCULAS E NÚMEROS'}</div>
        <div className='text2' style={{ fontSize: 14, opacity: 1, margin: 0, marginTop: -5, color: '#52be80' }}>{'EX.: PR085967'}</div>
        <div id="campos para nome e contato" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text2'>NOME COMPLETO</div>
            <input
              autoComplete="off"
              placeholder="NOME COMPLETO"
              className="input"
              type="text"
              id="inputUsuarioNome"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'NOME COMPLETO')}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: 400,
                height: 50,
              }}
            ></input>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className='text2'>{'CONTATO (CELULAR)'}</div>
            <input
              autoComplete="off"
              placeholder="CONTATO"
              className="input"
              type="text"
              id="inputUsuarioContato"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'CONTATO')}
              style={{
                marginTop: 10,
                marginBottom: 10,
                width: 200,
                height: 50,
              }}
            ></input>
          </div>
        </div>
        <div className='text2'>{'SELECIONE ABAIXO SUA CATEGORIA PROFISSIONAL'}</div>
        <div id="seletor de categoria profissional" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {categoria_profissional.map(item => (
            <div
              id={'tipo_profissional: ' + item}
              className='button'
              style={{ width: 200 }}
              onClick={() => {
                var botoes = document.getElementById("seletor de categoria profissional").getElementsByClassName("button-red");
                for (var i = 0; i < botoes.length; i++) {
                  botoes.item(i).className = "button";
                }
                document.getElementById('tipo_profissional: ' + item).className = 'button-red';
                localStorage.setItem('tipo_usuario', item);
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text2'>MATRÍCULA</div>
          <input
            autoComplete="off"
            placeholder="MATRÍCULA"
            className="input"
            type="password"
            id="inputUsuarioMatricula"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'MATRÍCULA')}
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 200,
              height: 50,
            }}
          ></input>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text2'>SENHA</div>
          <input
            autoComplete="off"
            placeholder="NOVA SENHA"
            className="input"
            type="password"
            id="inputUsuarioSenha"
            onFocus={(e) => (e.target.placeholder = '')}
            onBlur={(e) => (e.target.placeholder = 'SENHA')}
            style={{
              marginTop: 10,
              marginBottom: 10,
              width: 200,
              height: 50,
            }}
          ></input>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className='text2'>REPETIR SENHA</div>
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
        </div>
        <TermoDeResponsabilidade></TermoDeResponsabilidade>
        <div className='button'
          onClick={() => registrarUsuario()}
          style={{ width: 150, alignSelf: 'center' }}
        >
          ACEITO O TERMO, CONCLUIR CADASTRO
        </div>
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
      </div>
    )
  }

  function BtnCadastrarSenha() {
    return (
      <div id="fazer_cadastro_btn"
        className='text1'
        style={{
          display: 'flex',
          textDecoration: 'underline'
        }}
        onClick={() => {
          document.getElementById("inputs_login_senha").style.display = 'none';
          document.getElementById("inputs_login_senha").style.visibility = 'hidden';
          setcadastrasenha(1);
        }}
      >
        {'FAZER O MEU CADASTRO'}
      </div>
    )
  }

  function TermoDeResponsabilidade() {
    return (
      <div className='scroll' style={{
        padding: 10, margin: 20, width: '60vw', height: '40vh', minHeight: '40vh',
        lineBreak: 'auto'
      }}>
        <div style={{ alignSelf: 'center', fontWeight: 'bold' }}>TERMO DE RESPONSABILIDADE</div>
        <div style={{ margin: 5 }}>DECLARO QUE USAREI A APLICAÇÃO GARANTINDO A CONFIDENCIALIDADE DAS INFORMAÇÕES PERTINENTES AOS PACIENTES NELA CADASTRADOS, NÃO COMPARTILHANDO INFORMAÇÕES SENSÍVEIS COMO IDENTIFICAÇÃO COMPLETA, DIAGNÓSTICOS OU OUTROS DADOS SENSÍVEIS</div>
        <div style={{ margin: 5 }}>ENTENDO QUE ESTA APLICAÇÃO TEM APENAS A FUNÇÃO DE PASSÔMETRO, PARA ORGANIZAÇÃO DO TRABALHO NA UNIADADE EM QUE ESTOU LOTADO, SENDO SEU USO RESERVADO AO AMBIENTE DE TRABALHO.</div>
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
      <img
        className='rotacao'
        alt=""
        src={dharma}
        style={{
          margin: 10,
          height: 75,
          width: 75,
        }}
      ></img>
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
            timeout = setTimeout(() => {
              let checkusuario = usuarios.filter(valor => valor.usuario == document.getElementById('inputUsuario').value);
              if (checkusuario.length == 0) {
                toast(settoast, 'USUÁRIO NÃO ENCONTRADO. FAÇA SEU CADASTRO.', 'rgb(231, 76, 60, 1)', 3000);
              } else {
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
        <BtnCadastrarSenha></BtnCadastrarSenha>
      </div>
      <SeletorUnidade></SeletorUnidade>
      <CadastroDeSenha></CadastroDeSenha>
      <div
        style={{ display: 'none', marginTop: 10 }}
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