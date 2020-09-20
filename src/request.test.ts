import { request } from './request';

describe('Make request', () => {
    it('should return info about Durov', async done => {
        const result = await request<{ result: object }>({
            url: 'https://radio.velu.ga/api/getStations',
            params: {
                count: '1',
            },
        });
        expect('result' in result).toBeTruthy();
        done();
    });
});
