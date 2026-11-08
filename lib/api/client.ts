type ApiOptions = RequestInit & { timeoutMs?: number }
export async function apiFetch(input: RequestInfo | URL, options: ApiOptions = {}): Promise<Response> {
  const { timeoutMs = 30000, ...init } = options
  const timeout = AbortSignal.timeout(timeoutMs)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout
  return fetch(input, { ...init, credentials: "same-origin", cache: "no-store", signal })
}
