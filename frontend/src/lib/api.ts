const API_URL =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_URL ??
    "http://localhost:3333";

export function getApiUrl() {
    return API_URL;
}

interface FetchOptions extends RequestInit {
    token?: string;
    next?: {
        revalidate?: number | false;
        tags?: string[];
    };
}

function getErrorMessage(data: unknown, status: number): string {
    if (!data || typeof data !== "object") {
        return `Erro HTTP: ${status}`;
    }

    const payload = data as { error?: unknown; details?: unknown };

    if (Array.isArray(payload.details) && payload.details.length > 0) {
        const messages = payload.details
            .map((item) =>
                item && typeof item === "object" && "message" in item
                    ? String(item.message)
                    : null,
            )
            .filter((item): item is string => Boolean(item));

        if (messages.length > 0) {
            return messages.join("; ");
        }
    }

    if (typeof payload.error === "string" && payload.error) {
        return payload.error;
    }

    return `Erro HTTP: ${status}`;
}

export async function apiClient<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T> {
    const { token, headers: customHeaders, ...fetchOptions } = options;

    const headers = new Headers(customHeaders);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const isFormData = fetchOptions.body instanceof FormData;

    if (isFormData) {
        headers.delete("Content-Type");
    } else if (fetchOptions.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(getErrorMessage(data, response.status));
    }

    return data as T;
}
