import {} from 'jest';
import { request } from '../src/request';

describe('Make request', () => {
    it('should return info about Durov', async done => {
        const result = await request<{ result: object }>({
            url: 'https://api.vlad805.ru/v2/radio.get',
            params: {
                count: '1'
            }
        });
        expect('result' in result).toBeTruthy();
        done();
    });
});
