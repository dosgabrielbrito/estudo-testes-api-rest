import { describe } from '@jest/globals';
import bcryptjs from 'bcryptjs';

import AuthService from '../../services/authService.js';
import Usuario from '../../models/usuario.js';

//Instância para teste:
const authService = new AuthService();

await Usuario.excluir(4);

//Testes da cadastrarUsuario:
describe('Testes da authService.cadastrarUsuario', () => {
  it('O usuário deve possuir um nome, email e senha', async () => {
    //Arrange:
    const usuarioMockNome = {
      email: 'gabriel@gabriel.com',
      senha: 'teste123',
    };
    const usuarioMockEmail = {
      nome: 'Gabriel',
      senha: 'teste123',
    };
    const usuarioMockSenha = {
      nome: 'Gabriel',
      email: 'gabriel@gabriel.com',
    };
    //Act:
    const usuarioSalvoNome = authService.cadastrarUsuario(usuarioMockNome);
    const usuarioSalvoEmail = authService.cadastrarUsuario(usuarioMockEmail);
    const usuarioSalvoSenha = authService.cadastrarUsuario(usuarioMockSenha);
    //Assert:
    await expect(usuarioSalvoNome).rejects.toThrowError(
      'O nome de usuario é obrigatório.'
    );
    await expect(usuarioSalvoEmail).rejects.toThrowError(
      'O email de usuario é obrigatório.'
    );
    await expect(usuarioSalvoSenha).rejects.toThrowError(
      'A senha de usuario é obrigatória.'
    );
  });

  it('A senha do usuário precisa ser criptografada quando for salva no banco de dados', async () => {
    const data = {
      nome: 'Gabriel',
      email: 'gabriel@gabriel.com',
      senha: 'teste123',
    };

    const usuarioSalvo = await authService.cadastrarUsuario(data);
    const senhaIguais = await bcryptjs.compare(
      'teste123',
      usuarioSalvo.content.senha
    );

    expect(senhaIguais).toStrictEqual(true);

    await Usuario.excluir(usuarioSalvo.content.id);
  });

  it('Não pode ser cadastrado um usuário com e-mail duplicado', async () => {
    const usuarioMock = {
      nome: 'Gabriel',
      email: 'gabriel@gabriel.com',
      senha: 'teste123',
    };

    const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock);
    const emailDuplicado = authService.cadastrarUsuario(usuarioMock);

    await expect(emailDuplicado).rejects.toThrowError('Email já cadastrado!');

    await Usuario.excluir(usuarioSalvo.content.id);
  });

  it('Ao cadastrar um usuário, deve ser retornado mensagem informando que o usuário foi cadastrado', async () => {
    const usuarioMock = {
      nome: 'Gabriel',
      email: 'gabriel@gabriel.com',
      senha: 'teste123',
    };

    const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock);

    expect(usuarioSalvo.message).toBe('usuario criado');

    await Usuario.excluir(usuarioSalvo.content.id);
  });

  it('Ao cadastrar um usuário, validar retorno do usuário', async () => {
    const usuarioMock = {
      nome: 'Gabriel',
      email: 'gabriel@gabriel.com',
      senha: 'teste123',
    };

    const usuarioSalvo = await authService.cadastrarUsuario(usuarioMock);

    expect(usuarioSalvo).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        content: expect.objectContaining({
          id: expect.any(Number),
          ...usuarioMock,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      })
    );

    await Usuario.excluir(usuarioSalvo.content.id);
  });
});
