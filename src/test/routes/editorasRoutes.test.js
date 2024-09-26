import request from 'supertest';
import { describe, expect, it, jest } from '@jest/globals';
import app from '../../app.js';
import 'dotenv/config';

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

//Authorizarion Token:
const loginUsuario = {
  email: process.env.USER_EMAIL,
  senha: process.env.PASS_EMAIL,
};

const tokenUsuario = await request(app).post('/login').send(loginUsuario);

describe('GET em /editoras', () => {
  it('Deve retornar uma lista de editoras', async () => {
    const resposta = await request(app)
      .get('/editoras')
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .expect('content-type', /json/)
      .expect(200);

    expect(resposta.body[0].email).toEqual('e@e.com');
  });
});

let idResposta;
describe('POST em /editoras', () => {
  it('Deve adicionar uma nova editora', async () => {
    const resposta = await request(app)
      .post('/editoras')
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .send({
        nome: 'CDC',
        cidade: 'Sao Paulo',
        email: 's@s.com',
      })
      .expect(201);

    idResposta = resposta.body.content.id;
  });

  it('Deve nao adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/editoras')
      .send({})
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .expect(400);
  });
});

describe('GET em /editoras/id', () => {
  it('Deve retornar recurso selecionado', async () => {
    await request(app)
      .get(`/editoras/${idResposta}`)
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .expect(200);
  });
});

describe('PUT em /editoras/id', () => {
  test.each([
    ['nome', { nome: 'Casa do Codigo' }],
    ['cidade', { cidade: 'SP' }],
    ['email', { email: 'cdc@cdc.com' }],
  ])('Deve alterar o campo %s', async (chave, param) => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao
      .request(app)
      .put(`/editoras/${idResposta}`)
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .send(param)
      .expect(204);

    expect(spy).toHaveBeenCalled();
  });
});

describe('DELETE em /editoras/id', () => {
  it('Deletar o recurso adcionado', async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .set('Authorization', `Bearer ${tokenUsuario.body.accessToken}`)
      .expect(200);
  });
});
