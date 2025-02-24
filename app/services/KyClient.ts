import ky, { KyInstance, Options } from "ky";

let kyInstance: KyInstance | null = null;

interface Headers {
    [key: string]: string;
}

let headers: Headers = {
    "Content-Type": "application/json;charset=UTF-8",
};

function setHeaders(inputHeaders: Headers): void {
    headers = { ...headers, ...inputHeaders };
    kyInstance = createInstance(); // Cập nhật instance khi headers thay đổi
}

function getHeaders(): Headers {
    return headers;
}

function createInstance(): KyInstance {
    return ky.create({
        prefixUrl: process.env.NEXT_PUBLIC_POKEMON_API || "",
        headers: getHeaders(),
        hooks: {
            beforeRequest: [
                (request) => {
                    if (typeof window !== "undefined") {
                        const token = localStorage.getItem("token");
                        if (token) {
                            request.headers.set("Authorization", `Bearer ${token}`);
                            request.headers.set("ngrok-skip-browser-warning", "true");
                        }
                    }
                },
            ],
            afterResponse: [
                async (_request, _options, response) => {
                    if (response.status === 401 || response.status === 403) {
                        if (typeof window !== "undefined") {
                            localStorage.removeItem("token");
                            // window.location.href = "/login";
                        }
                    }
                },
            ],
        },
    });
}

function getInstance(): KyInstance {
    if (!kyInstance) {
        kyInstance = createInstance();
    }
    return kyInstance;
}

async function get<T>(endpointApiUrl: string, payload: Record<string, unknown> = {}, config: Options = {}): Promise<T> {
    return getInstance().get(endpointApiUrl, { searchParams: payload, ...config }).json<T>();
}

async function post<T>(endpointApiUrl: string, payload: unknown = {}, config: Options = {}): Promise<T> {
    return getInstance().post(endpointApiUrl, { json: payload, ...config }).json<T>();
}

async function put<T>(endpointApiUrl: string, payload: unknown = {}, config: Options = {}): Promise<T> {
    return getInstance().put(endpointApiUrl, { json: payload, ...config }).json<T>();
}

async function del<T>(endpointApiUrl: string, payload: unknown = {}, config: Options = {}): Promise<T> {
    return getInstance().delete(endpointApiUrl, { json: payload, ...config }).json<T>();
}

async function patch<T>(endpointApiUrl: string, payload: unknown = {}, config: Options = {}): Promise<T> {
    return getInstance().patch(endpointApiUrl, { json: payload, ...config }).json<T>();
}

export const KyClient = {
    get,
    post,
    put,
    del,
    patch,
    setHeaders,
};
