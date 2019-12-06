import URL from 'url';
import https from 'https';
import qs from 'querystring';

export interface IRequestParams {
    url: string;
    params?: Record<string, string>;
    headers?: Record<string, string>;
}

export const request = async<T>(args: IRequestParams) => new Promise<T>((resolve, reject) => {
    const { path, hostname, port } = URL.parse(args.url);

    args.params = args.params || {};
    args.headers = args.headers || {};

    const options = {
        hostname,
        path,
        port: port || 443,
        method: 'POST',
        headers: {
            ...args.headers,
            'content-type': 'application/x-www-form-urlencoded'
        }
    };

    const req = https.request(options, res => {
        const chunks: Uint8Array[] = [];

        res.on('data', chunk => chunks.push(chunk));

        res.on('end', () => {
            try {
                const data = String(Buffer.concat(chunks));

                resolve(JSON.parse(data));
            } catch (e) {
                reject(e);
            }
        });
    });

    req.on('error', e => {
        reject(e);
    });

    req.write(qs.stringify(args.params));

    req.end();
});
