import {} from 'jest';
import { VKAPIClient } from '../src';
import { IVKUser } from '@apidog/vk-typings';

const token = process.env.VK_TOKEN;

describe('Make request to VK', () => {
    it('should return info about Durov at users.get with user_ids=1 ', async done => {
        const client = VKAPIClient.getInstance(token);

        const response = await client.perform<IVKUser[]>('users.get', {
            user_ids: '1',
            lang: 'ru'
        });

        expect(response instanceof Array).toBeTruthy();
        expect(response[0].first_name).toBe('Павел');
        done();
    });

    it('should throw error at call captcha.force ', async done => {
        const client = VKAPIClient.getInstance(token);

        let throwed = false;

        try {
            await client.perform('captcha.force');
        } catch (e) {
            throwed = true;
        }

        expect(throwed).toBeTruthy();
        done();
    });

    it('should be typeof city === number (city_id) at change version to 5.1 and call users.get with fields=city ', async done => {
        const client = VKAPIClient.getInstance(token, { v: '5.1' });

        const [user] = await client.perform('users.get', { user_ids: 1, fields: 'city' });

        expect(typeof user.city).toBe('number');
        done();
    });

    it('should replace userIds to user_ids and [1,23048942] to string \'1,23048942\'', async done => {
        const client = VKAPIClient.getInstance(token);

        const users = await client.perform<IVKUser[]>('users.get', {
            userIds: [1, 23048942],
            nameCase: 'dat',
            lang: 'ru'
        });

        expect(users.length).toBeGreaterThan(1);
        expect(users[0].first_name).toBe('Павлу');
        expect(users[1].first_name).toBe('Владиславу');
        done();
    });
});
