import { apiUrl } from "./constants";

export function getToken() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && typeof user === 'object') return user?.token || null;
  } catch {
    return null;
  }
  return null;
}

export const apiFetch = async (url: string, options: any = {}, isURL = false) => {
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.includes('admin');
  const { data, headers, ...rest } = options;

  // Determine if body is FormData
  const isFormData = data instanceof FormData;

  console.log(isURL, "ISHJN")
  let res;
  try {
    res = await fetch(`${!isURL ? apiUrl : ""}${url}`, {
      ...rest,
      headers: {
        Authorization: `Bearer ${getToken() || ""}`,
        ...(headers || {}),
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  } catch (networkErr: any) {
    const err = new Error("Network request failed: " + (networkErr?.message || String(networkErr)));
    (err as any).status = 0;
    (err as any).detail = networkErr?.message || String(networkErr);
    (err as any).url = `${apiUrl}${url}`;
    throw err;
  }

  if (!res.ok) {
    let errorBody: any = { status: res.status, message: "Request failed" };

    try {
      const json = await res.json();
      errorBody = json || errorBody;
    } catch {
      try {
        errorBody.message = await res.text();
      } catch (e) {
        /* ignore */
      }
    }

    const err = new Error(errorBody.message || `Request failed with status ${res.status}`);
    Object.assign(err, errorBody);
    throw err;
  }

  try {
    return await res.json();
  } catch (e) {
    return null;
  }
};
