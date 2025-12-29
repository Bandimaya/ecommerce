import { apiUrl } from "./constants";

export function getToken() {
    let user: any = localStorage.getItem('user') || null;
    try {
        if (user) {
            user = JSON.parse(user)
            console.log(user)
            if (typeof user === 'object') {
                return user?.token
            }
        }
    } catch {
        return null
    }
}

export const apiFetch = async (url: string, options: any = {}) => {
  const isAdmin = window.location.pathname.includes('admin');
  const { data, headers, ...rest } = options;

  // Determine if body is FormData
  const isFormData = data instanceof FormData;

  const res = await fetch(`${apiUrl}${url}`, {
    ...rest,
    headers: {
      ...(headers || {}),
      Authorization: `Bearer ${getToken()}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    body: isFormData ? data : data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
};
