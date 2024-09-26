import { describe } from '@jest/globals';
import imagemTeste from '../utils/imagemTeste.js';
import LivrosImagensService from '../../services/livrosImagensService.js';

const livrosImagensService = new LivrosImagensService();

describe('Testando livrosImagemService.cadastrarImagem', () => {
  it('O sistema deve salvar uma imagem vinculada ao livro caso todos os dados estejam corretos', async () => {
    const imagemMock = {
      file: {
        originalname: 'curso node.png',
        mimetype: 'image/png',
        size: 2857,
        buffer: {
          type: 'Buffer',
          data: imagemTeste,
        },
      },
      body: {
        livroId: 1,
      },
    };
    const imagemSalva = await livrosImagensService.cadastrarImagem(imagemMock);

    expect(imagemSalva.content.livro_id).toBe(imagemMock.body.livroId);
    expect(imagemSalva.content.size).toBeLessThan(5000);

    await livrosImagensService.excluirImagemLivro(imagemSalva.content.id);
  });
});
