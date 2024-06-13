import { Test, TestingModule } from '@nestjs/testing';
import { CryptoManager } from './crypto-manager';

describe('CryptoManager', () => {
  let cryptoManager: CryptoManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoManager],
    }).compile();

    cryptoManager = module.get<CryptoManager>(CryptoManager);
  });

  describe('DB 데이터 암호화', () => {
    it('주어진 평문을 암호화 후, 복호화하면 동일한 결과가 보장된다.', async () => {
      const plainText: string = 'testData';
      const encryptedText: string = await cryptoManager.encrypt(plainText);
      const decryptedText: string = await cryptoManager.decrypt(encryptedText);
      expect(decryptedText).toBe(plainText);
    });
  });
});
