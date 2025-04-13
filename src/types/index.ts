export interface Restaurant {
  id: string;
  name: string;
  address: string;
  category: string;
  priceLevel: number;
  description: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 