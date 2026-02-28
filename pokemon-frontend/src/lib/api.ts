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

// ── Quiz ──

export interface QuizScoreResult {
  id: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
}

export interface RankingEntry {
  rank: number;
  nickname: string;
  bestScore: number;
  totalGames: number;
}

export async function apiSaveQuizScore(token: string, score: number, totalQuestions: number): Promise<QuizScoreResult> {
  const data = await fetchBackendGQL<{ saveQuizScore: QuizScoreResult }>(
    `mutation($input: SaveScoreInput!) { saveQuizScore(input: $input) { id score totalQuestions createdAt } }`,
    { input: { score, totalQuestions } }, token,
  );
  return data.saveQuizScore;
}

export async function apiQuizRankings(limit = 10): Promise<RankingEntry[]> {
  const data = await fetchBackendGQL<{ quizRankings: RankingEntry[] }>(
    `query($limit: Int) { quizRankings(limit: $limit) { rank nickname bestScore totalGames } }`, { limit },
  );
  return data.quizRankings;
}

export async function apiMyQuizScores(token: string): Promise<QuizScoreResult[]> {
  const data = await fetchBackendGQL<{ myQuizScores: QuizScoreResult[] }>(
    `query { myQuizScores { id score totalQuestions createdAt } }`, undefined, token,
  );
  return data.myQuizScores;
}

// ── Teams ──

export interface TeamResult {
  id: string;
  name: string;
  pokemonIds: number[];
  createdAt: string;
  updatedAt: string;
}

const TEAM_FIELDS = "id name pokemonIds createdAt updatedAt";

export async function apiMyTeams(token: string): Promise<TeamResult[]> {
  const data = await fetchBackendGQL<{ myTeams: TeamResult[] }>(
    `query { myTeams { ${TEAM_FIELDS} } }`, undefined, token,
  );
  return data.myTeams;
}

export async function apiCreateTeam(token: string, name: string, pokemonIds: number[]): Promise<TeamResult> {
  const data = await fetchBackendGQL<{ createTeam: TeamResult }>(
    `mutation($input: CreateTeamInput!) { createTeam(input: $input) { ${TEAM_FIELDS} } }`,
    { input: { name, pokemonIds } }, token,
  );
  return data.createTeam;
}

export async function apiUpdateTeam(token: string, id: string, input: { name?: string; pokemonIds?: number[] }): Promise<TeamResult> {
  const data = await fetchBackendGQL<{ updateTeam: TeamResult }>(
    `mutation($id: ID!, $input: UpdateTeamInput!) { updateTeam(id: $id, input: $input) { ${TEAM_FIELDS} } }`,
    { id, input }, token,
  );
  return data.updateTeam;
}

export async function apiDeleteTeam(token: string, id: string): Promise<boolean> {
  const data = await fetchBackendGQL<{ deleteTeam: boolean }>(
    `mutation($id: ID!) { deleteTeam(id: $id) }`, { id }, token,
  );
  return data.deleteTeam;
}

// ── Favorites ──

export interface FavoriteResult {
  id: string;
  pokemonId: number;
  createdAt: string;
}

export async function apiMyFavorites(token: string): Promise<FavoriteResult[]> {
  const data = await fetchBackendGQL<{ myFavorites: FavoriteResult[] }>(
    `query { myFavorites { id pokemonId createdAt } }`, undefined, token,
  );
  return data.myFavorites;
}

export async function apiAddFavorite(token: string, pokemonId: number): Promise<FavoriteResult> {
  const data = await fetchBackendGQL<{ addFavorite: FavoriteResult }>(
    `mutation($pokemonId: Int!) { addFavorite(pokemonId: $pokemonId) { id pokemonId createdAt } }`,
    { pokemonId }, token,
  );
  return data.addFavorite;
}

export async function apiRemoveFavorite(token: string, pokemonId: number): Promise<boolean> {
  const data = await fetchBackendGQL<{ removeFavorite: boolean }>(
    `mutation($pokemonId: Int!) { removeFavorite(pokemonId: $pokemonId) }`, { pokemonId }, token,
  );
  return data.removeFavorite;
}
