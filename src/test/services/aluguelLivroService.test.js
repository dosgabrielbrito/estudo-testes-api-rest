import { describe } from '@jest/globals';
import AluguelLivroService from '../../services/aluguelLivroService.js';

const aluguelLivroService = new AluguelLivroService();

describe('Testando AluguelLivroService', () => {
  it('Retornar a data de devolução do livro validando a quantidade de dias alugados', async () => {
    const dataAlugado = new Date('2024-01-01');
    const numeroDiasAlugados = 5;
    const dataDevolucaoMock = new Date('2024-01-06');

    const dataDevolucao = await aluguelLivroService.calcularDataDevolucao(
      dataAlugado,
      numeroDiasAlugados
    );

    expect(dataDevolucao).toStrictEqual(dataDevolucaoMock);
  });
});
