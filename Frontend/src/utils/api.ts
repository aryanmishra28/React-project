const API_BASE_URL = 'http://localhost:5000/api';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  message: string;
  user?: AuthUser;
}

export const registerUser = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include', // Important for cookies
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Important for cookies
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Login failed');
  }
  return data;
};

// Google Sign-in API
export const googleSignIn = async (idToken: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken }),
    credentials: 'include',
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Google sign-in failed');
  }
  return data;
};

// Resume Analysis API
export const analyzeResume = async (resumeText: string) => {
  const response = await fetch(`${API_BASE_URL}/resume/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resumeText }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Resume analysis failed');
  }
  return data;
};

// Hackathon Ideas API
export const generateHackathonIdeas = async (interest: string, category: string, skillLevel: string) => {
  const response = await fetch(`${API_BASE_URL}/hackathon/generate-ideas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ interest, category, skillLevel }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to generate hackathon ideas');
  }
  return data;
};

// Fetch Hackathons API
export interface Hackathon {
  id: string;
  title: string;
  description?: string;
  date: string;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  participants: string;
  participantsCount?: number;
  prize: string;
  prizeAmount?: number;
  difficulty: string;
  tags: string[];
  registrationLink: string;
  deadline?: string;
  organizer?: string;
  image?: string;
  status: string;
}

export interface HackathonsResponse {
  success: boolean;
  hackathons: Hackathon[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  message?: string;
}

export const fetchHackathons = async (status?: string, limit?: number, page?: number): Promise<HackathonsResponse> => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (limit) params.append('limit', limit.toString());
  if (page) params.append('page', page.toString());

  const queryString = params.toString();
  const url = `${API_BASE_URL}/hackathon/list${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch hackathons');
  }
  return data;
};