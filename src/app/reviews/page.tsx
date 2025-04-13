"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, Star, MapPin, Plus, DollarSign } from "lucide-react"

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
    latitude: 37.5015,
    longitude: 127.0437,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Mock review data
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
    id: "2",
    restaurantId: "2",
    userId: "1",
    rating: 4,
    comment: "신선한 재료로 만든 스시를 합리적인 가격에 즐길 수 있습니다. 점심 특선이 특히 좋아요.",
    images: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: MOCK_USER
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
    const restaurant = MOCK_RESTAURANTS.find(r => r.id === review.restaurantId)
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
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">리뷰 목록</h1>
        <Button onClick={() => router.push("/reviews/write")}>
          <Plus className="h-4 w-4 mr-2" />
          리뷰 작성하기
        </Button>
      </div>
      
      {/* Search and filter */}
      <div className="max-w-md mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="맛집 이름으로 검색" 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-gray-100 p-5 rounded-md">
          <h3 className="font-medium mb-4">카테고리</h3>
          <div className="flex flex-wrap gap-2 mb-6">
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
          
          <h3 className="font-medium mb-4">가격대 범위</h3>
          <div className="flex justify-between px-1 mb-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <div key={value} className="text-xs font-medium text-gray-500">
                {value}
              </div>
            ))}
          </div>
          <Slider
            defaultValue={[1, 5]}
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
      
      {/* Reviews list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredReviews.length > 0 ? (
          filteredReviews.map(({ review, restaurant }) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              restaurant={restaurant as Restaurant} 
            />
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <p className="text-gray-500 mb-4">검색 결과가 없습니다.</p>
            <Button onClick={() => router.push("/reviews/write")}>
              첫 리뷰 작성하기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ReviewCard({ review, restaurant }: { review: Review; restaurant: Restaurant }) {
  // Helper function to render price level as ₩ symbols
  const renderPriceLevel = (level: number) => {
    return '₩'.repeat(level);
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <Image
          src={restaurant.imageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-0 right-0 bg-white/80 backdrop-blur-sm px-3 py-1 m-2 rounded-full text-sm font-medium flex items-center">
          <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
          {review.rating}
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/restaurants/${restaurant.id}`} className="block">
            <h3 className="font-semibold text-lg hover:text-indigo-600 transition-colors">
              {restaurant.name}
            </h3>
          </Link>
          <span className="text-gray-500 text-sm">{renderPriceLevel(restaurant.priceLevel)}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          <span className="truncate">{restaurant.address}</span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>
        
        {review.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {review.images.map((image, index) => (
              <div key={index} className="relative h-16 w-16 rounded-md overflow-hidden">
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2 text-sm text-gray-500 border-t">
          <span>{new Date(review.createdAt).toLocaleDateString()}</span>
          <Link 
            href={`/reviews/write?restaurantId=${restaurant.id}`} 
            className="text-indigo-600 hover:underline"
          >
            이 맛집에 리뷰 작성하기
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 