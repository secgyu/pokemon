const BACKEND_URL = "http://localhost:3000/graphql";

async function fetchBackendGQL<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(BACKEND_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`서버 요청 실패: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
}

interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const data = await fetchBackendGQL<{ login: AuthResponse }>(
    `mutation Login($input: LoginInput!) {
      login(input: $input) { accessToken user { id email nickname } }
    }`,
    { input: { email, password } },
  );
  return data.login;
}

export async function apiSignup(
  email: string,
  nickname: string,
  password: string,
): Promise<AuthResponse> {
  const data = await fetchBackendGQL<{ signup: AuthResponse }>(
    `mutation Signup($input: SignupInput!) {
      signup(input: $input) { accessToken user { id email nickname } }
    }`,
    { input: { email, nickname, password } },
  );
  return data.signup;
}

export async function apiFetchMe(token: string): Promise<AuthUser> {
  const data = await fetchBackendGQL<{ me: AuthUser }>(
    `query { me { id email nickname } }`,
    undefined,
    token,
  );
  return data.me;
}
