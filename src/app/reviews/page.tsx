"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Star, MapPin, Plus, DollarSign, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Restaurant, Review, User } from "@/types"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Mock user data
const MOCK_USER: User = {
  id: "1",
  name: "김소마",
  email: "soma@example.com",
  image: "/images/user1.jpg",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

// Mock restaurants data
const MOCK_RESTAURANTS: Record<string, Restaurant> = {
  "1": {
    id: "1",
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    category: "한식",
    priceLevel: 2,
    description: "소마센터 근처 맛있는 김치찌개 맛집입니다.",
    imageUrl: "/images/kimchi-stew.jpg",
    rating: 4.5,
    reviewCount: 42,
    latitude: 37.5665,
    longitude: 126.9780,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "2": {
    id: "2",
    name: "정통 스시",
    address: "서울시 강남구 역삼로 45",
    category: "일식",
    priceLevel: 3,
    description: "신선한 재료로 만든 정통 스시를 즐길 수 있는 곳입니다.",
    imageUrl: "/images/sushi.jpg",
    rating: 4.7,
    reviewCount: 38,
    latitude: 37.5015,
    longitude: 127.0437,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "3": {
    id: "3",
    name: "양자강",
    address: "서울시 서초구 사평대로 68",
    category: "중식",
    priceLevel: 2,
    description: "30년 전통의 중화요리 전문점입니다.",
    imageUrl: "/images/chinese-food.jpg",
    rating: 4.2,
    reviewCount: 56,
    latitude: 37.5045,
    longitude: 127.0213,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "4": {
    id: "4",
    name: "노스텔지어 피자",
    address: "서울시 강남구 언주로 332",
    category: "양식",
    priceLevel: 2,
    description: "수제 도우로 만든 정통 이탈리안 피자를 맛볼 수 있는 곳입니다.",
    imageUrl: "/images/pizza.jpg",
    rating: 4.6,
    reviewCount: 32,
    latitude: 37.5087,
    longitude: 127.0476,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "5": {
    id: "5",
    name: "명동 칼국수",
    address: "서울시 마포구 와우산로 29",
    category: "한식",
    priceLevel: 1,
    description: "손으로 직접 반죽한 쫄깃한 면발의 칼국수 전문점입니다.",
    imageUrl: "/images/noodle.jpg",
    rating: 4.3,
    reviewCount: 27,
    latitude: 37.5546,
    longitude: 126.9239,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "6": {
    id: "6",
    name: "황금 커리",
    address: "서울시 용산구 이태원로 27",
    category: "기타",
    priceLevel: 2,
    description: "본격 인도 스타일의 향신료 가득한 커리 전문점입니다.",
    imageUrl: "/images/curry.jpg",
    rating: 4.4,
    reviewCount: 18,
    latitude: 37.5344,
    longitude: 126.9954,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "7": {
    id: "7",
    name: "빈센트 케이크",
    address: "서울시 성동구 서울숲길 17",
    category: "카페",
    priceLevel: 3,
    description: "수제 디저트와 커피가 맛있는 프리미엄 카페입니다.",
    imageUrl: "/images/cake.jpg",
    rating: 4.8,
    reviewCount: 56,
    latitude: 37.5476,
    longitude: 127.0443,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "8": {
    id: "8",
    name: "서울 떡볶이",
    address: "서울시 동작구 상도로 65",
    category: "분식",
    priceLevel: 1,
    description: "매콤 달콤한 국민 간식, 떡볶이 전문점입니다.",
    imageUrl: "/images/tteokbokki.jpg",
    rating: 4.1,
    reviewCount: 45,
    latitude: 37.5032,
    longitude: 126.9536,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  "9": {
    id: "9",
    name: "스테이크 하우스",
    address: "서울시 서초구 강남대로 435",
    category: "양식",
    priceLevel: 5,
    description: "최상급 한우와 와인을 즐길 수 있는 프리미엄 스테이크 하우스입니다.",
    imageUrl: "/images/steak.jpg",
    rating: 4.9,
    reviewCount: 32,
    latitude: 37.5012,
    longitude: 127.0243,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// Mock review data
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    restaurantId: "1",
    userId: "user1",
    rating: 5,
    comment: "정말 맛있는 김치찌개입니다. 소마 수업 후에 자주 방문하는데, 매번 만족합니다.",
    images: ["/images/food-review.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user1",
      name: "홍길동",
      email: "hong@example.com",
      image: "/images/user1.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "2",
    restaurantId: "1",
    userId: "user2",
    rating: 4,
    comment: "반찬이 정말 다양하고 맛있어요. 가격도 합리적입니다.",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user2",
      name: "김철수",
      email: "kim@example.com",
      image: "/images/user2.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "3",
    restaurantId: "3",
    userId: "user1",
    rating: 4,
    comment: "탕수육이 정말 맛있습니다. 다음에도 또 방문할 예정입니다.",
    images: ["/images/dimsum.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user1",
      name: "홍길동",
      email: "hong@example.com",
      image: "/images/user1.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "4",
    restaurantId: "5",
    userId: "user2",
    rating: 5,
    comment: "이 가격에 이런 맛을 내는 칼국수는 처음입니다. 면발이 정말 쫄깃하고 국물이 진해요!",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user2",
      name: "김철수",
      email: "kim@example.com",
      image: "/images/user2.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "5",
    restaurantId: "6",
    userId: "user1",
    rating: 4,
    comment: "정통 인도 커리를 한국에서도 즐길 수 있어서 좋았습니다. 매운맛 단계를 선택할 수 있는 점이 특히 마음에 들었어요.",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user1",
      name: "홍길동",
      email: "hong@example.com",
      image: "/images/user1.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "6",
    restaurantId: "7",
    userId: "user76",
    rating: 5,
    comment: "케이크가 정말 맛있어요! 달지 않고 부드러운 맛이 일품입니다. 카페 분위기도 아늑해서 오래 있기 좋아요.",
    images: ["/images/food-category1.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user76",
      name: "이지은",
      email: "lee@example.com",
      image: "/images/user76.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "7",
    restaurantId: "8",
    userId: "user2",
    rating: 4,
    comment: "오랜만에 먹어본 추억의 맛! 매콤달콤한 떡볶이가 정말 맛있었습니다. 튀김도 바삭바삭해요.",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user2",
      name: "김철수",
      email: "kim@example.com",
      image: "/images/user2.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    id: "8",
    restaurantId: "9",
    userId: "user76",
    rating: 5,
    comment: "최고의 스테이크! 가격은 비싸지만 그만한 가치가 있습니다. 특별한 날에 방문하기 좋은 곳입니다.",
    images: ["/images/food-category2.jpg"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      id: "user76",
      name: "이지은",
      email: "lee@example.com",
      image: "/images/user76.jpg",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
]

// Add more price levels
const priceLevels = [
  { value: "0", label: "전체" },
  { value: "1", label: "₩" },
  { value: "2", label: "₩₩" },
  { value: "3", label: "₩₩₩" },
  { value: "4", label: "₩₩₩₩" },
  { value: "5", label: "₩₩₩₩₩" }
]

// Add categories
const categories = ["전체", "한식", "일식", "중식", "양식", "분식", "카페", "기타"]

export default function ReviewsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 5])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["전체"])
  
  // Handle category selection
  const handleCategoryClick = (category: string) => {
    if (category === "전체") {
      // If "전체" is clicked, select only "전체"
      setSelectedCategories(["전체"])
    } else {
      // If another category is clicked
      const newSelectedCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category) // Remove if already selected
        : [...selectedCategories.filter(c => c !== "전체"), category] // Add category, remove "전체"
      
      // If no categories selected, default to "전체"
      setSelectedCategories(newSelectedCategories.length === 0 ? ["전체"] : newSelectedCategories)
    }
  }
  
  // Get restaurant information for each review
  const reviewsWithRestaurant = MOCK_REVIEWS.map(review => {
    const restaurant = MOCK_RESTAURANTS[review.restaurantId]
    return { review, restaurant }
  }).filter(({ restaurant }) => restaurant !== undefined)
  
  // Filter reviews based on search term, price level range, and categories
  const filteredReviews = reviewsWithRestaurant.filter(({ restaurant }) => {
    if (!restaurant) return false
    
    const matchesSearch = !searchTerm || 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPrice = 
      restaurant.priceLevel >= priceRange[0] && 
      restaurant.priceLevel <= priceRange[1]
    
    const matchesCategory = 
      selectedCategories.includes("전체") || 
      selectedCategories.includes(restaurant.category)
    
    return matchesSearch && matchesPrice && matchesCategory
  })

  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange([values[0], values[1]])
  }
  
  // 리뷰 데이터를 최신순으로 정렬
  const sortedReviews = [...MOCK_REVIEWS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-indigo-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          메인으로 돌아가기
        </Link>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">모든 맛집 리뷰</h1>
          <Link href="/reviews/new" className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-4 py-2 rounded-lg transition-colors">
            리뷰 작성하기
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {sortedReviews.map(review => {
            const restaurant = MOCK_RESTAURANTS[review.restaurantId];
            
            return (
              <Card key={review.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center mb-4">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                        <Image
                          src={review.user.image}
                          alt={review.user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="ml-auto flex items-center">
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
                          <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden">
                            <Image
                              src={image}
                              alt={`리뷰 이미지 ${index + 1}`}
                              fill
                              sizes="(max-width: 768px) 100px, 100px"
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {restaurant && (
                    <Link href={`/restaurants/${restaurant.id}`}>
                      <div className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="relative h-14 w-14 rounded overflow-hidden mr-3">
                          <Image
                            src={restaurant.imageUrl}
                            alt={restaurant.name}
                            fill
                            sizes="(max-width: 768px) 56px, 56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{restaurant.name}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span className="truncate">{restaurant.address}</span>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 mr-1" />
                          <span>{restaurant.rating} ({restaurant.reviewCount})</span>
                        </div>
                      </div>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
} 