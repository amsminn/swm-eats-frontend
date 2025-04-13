const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  token?: string;
}

/**
 * Utility function for API requests
 */
async function fetchApi<T>(
  endpoint: string,
  { params, token, ...customConfig }: FetchOptions = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(customConfig.headers || {}),
  };

  const config: RequestInit = {
    method: customConfig.method || 'GET',
    ...customConfig,
    headers,
  };

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });
    endpoint = `${endpoint}?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Promise.reject(new Error(errorData.message || response.statusText));
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    return Promise.reject(error);
  }
}

export { fetchApi };

// API endpoints
export const api = {
  restaurants: {
    getAll: (params?: Record<string, any>) => 
      fetchApi<any[]>('/restaurants', { params }),
    getById: (id: string) => 
      fetchApi<any>(`/restaurants/${id}`),
    search: (query: string) => 
      fetchApi<any[]>(`/restaurants/search`, { params: { query } }),
  },
  reviews: {
    getByRestaurantId: (restaurantId: string) => 
      fetchApi<any[]>(`/reviews/restaurant/${restaurantId}`),
    create: (data: any) => 
      fetchApi<any>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  },
  meetups: {
    getAll: () => 
      fetchApi<any[]>('/meetups'),
    create: (data: any) => 
      fetchApi<any>('/meetups', { method: 'POST', body: JSON.stringify(data) }),
    join: (meetupId: string, userId: string) => 
      fetchApi<any>(`/meetups/${meetupId}/join`, { 
        method: 'POST', 
        body: JSON.stringify({ userId }) 
      }),
  },
  users: {
    getProfile: () => 
      fetchApi<any>('/users/profile'),
    updateProfile: (data: any) => 
      fetchApi<any>('/users/profile', { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
  },
}; 