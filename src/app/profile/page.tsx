"use client"

import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
// @ts-ignore - Suppress TypeScript error for tabs import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, MapPin, Star } from "lucide-react"
import { Restaurant, Review, User } from "@/types"

// Mock user data - in a real app this would come from the API
const MOCK_USER: User = {
  id: "1",
  name: "소마 사용자",
  email: "user@example.com",
  image: "/images/user76.jpg",
  bio: "소프트웨어 마에스트로 14기, 백엔드 개발자, 맛집 탐방을 좋아합니다.",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Mock favorites - in a real app these would come from the API
const MOCK_FAVORITES: Restaurant[] = [
  {
    id: "1",
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    category: "한식",
    priceLevel: 1,
    description: "소마센터 근처 맛있는 김치찌개 맛집",
    imageUrl: "/images/kimchi-stew.jpg",
    rating: 4.5,
    latitude: 37.5665,
    longitude: 126.9780,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "양자강",
    address: "서울시 서초구 사평대로 68",
    category: "중식",
    priceLevel: 2,
    description: "30년 전통의 중화요리 전문점",
    imageUrl: "/images/chinese-food.jpg",
    rating: 4.2,
    latitude: 37.5045,
    longitude: 127.0213,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Mock reviews - in a real app these would come from the API
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    restaurantId: "1",
    userId: "1",
    rating: 5,
    comment: "정말 맛있는 김치찌개입니다. 소마 수업 후에 자주 방문하는데, 매번 만족합니다.",
    images: ["/images/food-review.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: MOCK_USER
  },
  {
    id: "3",
    restaurantId: "3",
    userId: "1",
    rating: 4,
    comment: "탕수육이 정말 맛있습니다. 다음에도 또 방문할 예정입니다.",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: MOCK_USER
  }
]

// Mock favorite restaurants
const MOCK_RESTAURANT_DETAIL: Record<string, Restaurant> = {
  "1": MOCK_FAVORITES[0],
  "3": MOCK_FAVORITES[1]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  
  // If we're loading the session, show a loading state
  if (status === "loading") {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p>로딩 중...</p>
      </div>
    )
  }
  
  // If user is not authenticated, show login prompt
  if (!session) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
        <p className="mb-8 text-gray-600 max-w-md mx-auto">
          프로필 페이지를 보려면 로그인이 필요합니다. 소마 계정으로 로그인하고 맛집 탐색, 리뷰 작성, 다양한 기능을 이용해보세요.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/signin">
            <Button className="px-6">
              로그인
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="px-6">
              회원가입
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative h-32 w-32 rounded-full overflow-hidden">
            <Image
              src={MOCK_USER.image}
              alt={MOCK_USER.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{MOCK_USER.name}</h1>
            <p className="text-gray-600 mb-4">{MOCK_USER.bio}</p>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                프로필 수정
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="favorites">즐겨찾는 맛집</TabsTrigger>
          <TabsTrigger value="reviews">내 리뷰</TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites">
          <Suspense fallback={<p>로딩 중...</p>}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_FAVORITES.map(restaurant => (
                <FavoriteCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
            
            {MOCK_FAVORITES.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">아직 즐겨찾는 맛집이 없습니다.</p>
                <Link href="/restaurants">
                  <Button>맛집 탐색하기</Button>
                </Link>
              </div>
            )}
          </Suspense>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Suspense fallback={<p>로딩 중...</p>}>
            <div className="space-y-6">
              {MOCK_REVIEWS.map(review => (
                <ReviewCard 
                  key={review.id} 
                  review={review} 
                  restaurant={MOCK_RESTAURANT_DETAIL[review.restaurantId]} 
                />
              ))}
            </div>
            
            {MOCK_REVIEWS.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">아직 작성한 리뷰가 없습니다.</p>
                <Link href="/restaurants">
                  <Button>맛집 탐색하기</Button>
                </Link>
              </div>
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function FavoriteCard({ restaurant }: { restaurant: Restaurant }) {
  // Helper function to render price level as ₩ symbols
  const renderPriceLevel = (level: number) => {
    return '₩'.repeat(level);
  };

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-40">
          <Image
            src={restaurant.imageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-sm font-medium flex items-center">
            <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
            {restaurant.rating}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{restaurant.address}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded">{restaurant.category}</span>
            <span className="text-sm font-medium">{renderPriceLevel(restaurant.priceLevel)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ReviewCard({ review, restaurant }: { review: Review; restaurant: Restaurant }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Link href={`/restaurants/${restaurant.id}`} className="flex-1">
            <h3 className="font-semibold text-lg hover:text-indigo-600 transition-colors">
              {restaurant.name}
            </h3>
          </Link>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-gray-700 mb-4">{review.comment}</p>
        
        {review.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {review.images.map((image, index) => (
              <div key={index} className="relative h-20 w-20 rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={`리뷰 이미지 ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  )
} 