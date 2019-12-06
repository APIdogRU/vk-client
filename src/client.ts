import { IVKApiError, IVKApiResponse } from '@apidog/vk-typings';
import { request } from './request';
import { stringify } from 'querystring';

type IVKApiResult<T> = IVKApiResponse<T> | IVKApiError;
type TParamsAcceptableTypes = string | number | string[] | number[] | boolean;

export interface IVKAPIClientConfig {
    userAgent?: string;
    v?: string;
}

export class VKAPIClient {
    static getInstance = (token: string, config?: IVKAPIClientConfig) => {
        return new VKAPIClient(token, config);
    };

    private static defaultConfig = {
        userAgent: 'VKAndroidApp/5.38-816 (Android 8.0; SDK 26; x86; Google Nexus 5X; ru)',
        v: '5.108'
    };

    private constructor(private readonly token: string, private readonly config: IVKAPIClientConfig = VKAPIClient.defaultConfig) {
        config.userAgent = config.userAgent || VKAPIClient.defaultConfig.userAgent;
        config.v = config.v || VKAPIClient.defaultConfig.v;
    };

    private convertParams = (params: Record<string, TParamsAcceptableTypes>): Record<string, string> => {
        const result: Record<string, string> = {};

        Object.keys(params).forEach(key => {
            let value = params[key];

            key = key.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);

            if (Array.isArray(value)) {
                value = value.join(',');
            }

            result[key] = String(value);
        });

        return result;
    };

    public perform = async<T>(method: string, params: Record<string, TParamsAcceptableTypes> = {}): Promise<T> => {
        if (!params.v && this.config.v) {
            params.v = this.config.v;
        }

        params.access_token = this.token;

        const qs = stringify(params);
        const url = `https://api.vk.com/method/${method}?${qs}`;

        const result = await request<IVKApiResult<T>>({
            url,
            params: this.convertParams(params),
            headers: {
                'user-agent': this.config.userAgent
            }
        });

        if ('error' in result) {
            const { error } = result;
            throw new Error(`API error #${error.error_code}: ${error.error_msg}`);
        }

        return result.response;
    };
}
