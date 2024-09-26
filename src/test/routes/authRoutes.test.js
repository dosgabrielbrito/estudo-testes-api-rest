import request from 'supertest';
import { describe, expect } from '@jest/globals';
import app from '../../app.js';

import AuthService from '../../services/authService.js';
import Usuario from '../../models/usuario.js';

const authService = new AuthService();

let servidor;

beforeEach(() => {
  const porta = 3000;
  servidor = app.listen(porta);
});

afterEach(() => {
  servidor.close();
});

describe('Testando a porta login (POST)', () => {
  it('O login deve possuir um e-mail e senha para se autenticar', async () => {
    const loginMockEmail = {
      senha: 'teste123',
    };
    const loginMockSenha = {
      email: 'gabriel@email.com.br',
    };

    await request(servidor)
      .post('/login')
      .send(loginMockEmail)
      .expect(500)
      .expect('"O email do usuario é obrigatório."');

    await request(servidor)
      .post('/login')
      .send(loginMockSenha)
      .expect(500)
      .expect('"A senha de usuario é obrigatório."');
  });

  it('O login deve validar se o usuário está cadastrado', async () => {
    const loginMock = {
      email: 'gabriel@email.com.br',
      senha: 'teste123',
    };

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario não cadastrado."');
  });

  it('O login deve validar e-mail e senha incorreto', async () => {
    const cadastroMock = {
      nome: 'Gabriel Brito',
      email: 'gabriel@email.com.br',
      senha: 'teste123',
    };

    const loginMock = {
      email: 'gabriel@email.com.br',
      senha: 'teste321',
    };

    const usuarioCadastrado = await authService.cadastrarUsuario(cadastroMock);

    await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(500)
      .expect('"Usuario ou senha invalido."');

    await Usuario.excluir(usuarioCadastrado.content.id);
  });

  it('O login deve validar se esta sendo retornado um accessToken.', async () => {
    const cadastroMock = {
      nome: 'Gabriel Brito',
      email: 'gabriel@email.com.br',
      senha: 'teste123',
    };

    const loginMock = {
      email: 'gabriel@email.com.br',
      senha: 'teste123',
    };

    const usuarioCadastrado = await authService.cadastrarUsuario(cadastroMock);

    const loginResultado = await request(servidor)
      .post('/login')
      .set('Accept', 'application/json')
      .send(loginMock)
      .expect(201);

    expect(loginResultado.body.message).toBe('Usuario conectado');
    expect(loginResultado.body).toHaveProperty('accessToken');

    await Usuario.excluir(usuarioCadastrado.content.id);
  });
});
