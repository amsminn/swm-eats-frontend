"use client"

import { Suspense, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, Star, ArrowLeft } from "lucide-react"
import Script from "next/script"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { RestaurantsMap } from "@/components/restaurants-map"
import { Restaurant } from "@/types"

// Mock data - in a real app this would come from the API
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    category: "한식",
    priceLevel: 1,
    description: "소마센터 근처 맛있는 김치찌개 맛집",
    imageUrl: "/images/kimchi-stew.jpg",
    rating: 4.5,
    reviewCount: 42,
    latitude: 37.5665,
    longitude: 126.9780,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "정통 스시",
    address: "서울시 강남구 역삼로 45",
    category: "일식",
    priceLevel: 3,
    description: "신선한 재료로 만든 정통 스시",
    imageUrl: "/images/sushi.jpg",
    rating: 4.7,
    reviewCount: 38,
    latitude: 37.5015,
    longitude: 127.0437,
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
    reviewCount: 56,
    latitude: 37.5045,
    longitude: 127.0213,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "4",
    name: "노스텔지어 피자",
    address: "서울시 강남구 언주로 332",
    category: "양식",
    priceLevel: 2,
    description: "수제 도우로 만든 정통 이탈리안 피자",
    imageUrl: "/images/pizza.jpg",
    rating: 4.6,
    reviewCount: 32,
    latitude: 37.5087,
    longitude: 127.0476,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "5",
    name: "명동 칼국수",
    address: "서울시 마포구 와우산로 29",
    category: "한식",
    priceLevel: 1,
    description: "손으로 반죽한 쫄깃한 면발의 칼국수 전문점",
    imageUrl: "/images/noodle.jpg",
    rating: 4.3,
    reviewCount: 27,
    latitude: 37.5546,
    longitude: 126.9239,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "6",
    name: "황금 커리",
    address: "서울시 용산구 이태원로 27",
    category: "기타",
    priceLevel: 2,
    description: "본격 인도 스타일의 향신료 가득한 커리",
    imageUrl: "/images/curry.jpg",
    rating: 4.4,
    reviewCount: 18,
    latitude: 37.5344,
    longitude: 126.9954,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "7",
    name: "빈센트 케이크",
    address: "서울시 성동구 서울숲길 17",
    category: "카페",
    priceLevel: 3,
    description: "수제 디저트와 커피가 맛있는 프리미엄 카페",
    imageUrl: "/images/cake.jpg",
    rating: 4.8,
    reviewCount: 56,
    latitude: 37.5476,
    longitude: 127.0443,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "8",
    name: "서울 떡볶이",
    address: "서울시 동작구 상도로 65",
    category: "분식",
    priceLevel: 1,
    description: "매콤 달콤한 국민 간식, 떡볶이 전문점",
    imageUrl: "/images/tteokbokki.jpg",
    rating: 4.1,
    reviewCount: 45,
    latitude: 37.5032,
    longitude: 126.9536,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "9",
    name: "스테이크 하우스",
    address: "서울시 서초구 강남대로 435",
    category: "양식",
    priceLevel: 5,
    description: "최상급 한우와 와인을 즐길 수 있는 프리미엄 스테이크 하우스",
    imageUrl: "/images/steak.jpg",
    rating: 4.9,
    reviewCount: 32,
    latitude: 37.5012,
    longitude: 127.0243,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

const categories = ["전체", "한식", "일식", "중식", "양식", "분식", "카페", "기타"]

export default function RestaurantsPage() {
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["전체"])
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 5])
  
  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('🚀 레스토랑 페이지 마운트됨', {
      env: process.env.NODE_ENV,
      apiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY ? '설정됨' : '설정안됨',
      apiUrl: process.env.NEXT_PUBLIC_API_URL
    });
  }, []);
  
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
  
  // Handle price range change
  const handlePriceRangeChange = (values: number[]) => {
    console.log("가격 범위 변경:", values);
    setPriceRange([values[0], values[1]]);
  }
  
  // Filter restaurants based on selected categories and price range
  const filteredRestaurants = MOCK_RESTAURANTS.filter(restaurant => {
    const categoryMatch = 
      selectedCategories.includes("전체") || 
      selectedCategories.includes(restaurant.category);
    
    const priceMatch = 
      restaurant.priceLevel >= priceRange[0] && 
      restaurant.priceLevel <= priceRange[1];
    
    console.log(`레스토랑: ${restaurant.name}, 가격: ${restaurant.priceLevel}, 범위: ${priceRange[0]}-${priceRange[1]}, 일치여부: ${priceMatch}`);
    
    return categoryMatch && priceMatch;
  })
  // 리뷰 개수로 우선 정렬하고, 리뷰 개수가 같으면 별점 순으로 정렬
  .sort((a, b) => {
    // 리뷰 개수로 우선 비교
    if (a.reviewCount !== b.reviewCount) {
      return b.reviewCount - a.reviewCount; // 내림차순 (많은 리뷰 순)
    }
    // 리뷰 개수가 같으면 별점으로 비교
    return b.rating - a.rating; // 내림차순 (높은 별점 순)
  });
  
  // Handle restaurant selection from map
  const handleSelectRestaurant = (id: string) => {
    router.push(`/restaurants/${id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/" className="flex items-center text-indigo-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          메인으로 돌아가기
        </Link>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">맛집 탐색</h1>
          <Link href="/restaurants/new" className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-4 py-2 rounded-lg transition-colors">
            맛집 추가하기
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 필터 및 검색 영역 */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="맛집 검색" 
              className="pl-10"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">카테고리</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? "bg-indigo-600 text-white" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">가격대 범위</h3>
            <div className="bg-gray-100 p-5 rounded-md">
              <div className="flex justify-between px-1 mb-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div key={value} className="text-xs font-medium text-gray-500">
                    {value}
                  </div>
                ))}
              </div>
              <Slider
                defaultValue={[1, 5]}
                value={priceRange}
                min={1}
                max={5}
                step={1}
                minStepsBetweenThumbs={1}
                onValueChange={handlePriceRangeChange}
                className="py-4"
              />
              <div className="flex justify-between mt-2">
                <div className="bg-white px-3 py-2 rounded-md font-medium text-center w-16">
                  {priceRange[0]}
                </div>
                <div className="bg-white px-3 py-2 rounded-md font-medium text-center w-16">
                  {priceRange[1]}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 지도 및 맛집 목록 영역 */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Suspense fallback={<div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">지도 로딩 중...</div>}>
              <RestaurantsMap 
                restaurants={filteredRestaurants} 
                height="300px"
                onSelectRestaurant={handleSelectRestaurant}
              />
            </Suspense>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">
              맛집 목록
              <span className="text-gray-500 text-base font-normal ml-2">
                {filteredRestaurants.length}개
              </span>
            </h2>
            
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRestaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48">
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
            <div className="flex flex-col items-end text-xs">
              <span className="font-medium">가격 {restaurant.priceLevel}</span>
              <span className="text-gray-500">리뷰 {restaurant.reviewCount}개</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 