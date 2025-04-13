"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Star } from "lucide-react"
import { Suspense } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { KakaoMap } from "@/components/kakao-map"
import { Restaurant, Review } from "@/types"

// Mock data - in a real app these would come from the API
const MOCK_RESTAURANTS: Record<string, Restaurant> = {
  "1": {
    id: "1",
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    category: "한식",
    priceLevel: 2,
    description: "소마센터 근처 맛있는 김치찌개 맛집입니다. 30년 전통의 비법 양념으로 만든 김치찌개와 다양한 반찬을 즐길 수 있습니다. 점심 특선 메뉴도 준비되어 있으니 소마 구성원들의 많은 방문 바랍니다.",
    imageUrl: "/images/kimchi-stew.jpg",
    rating: 4.5,
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
    description: "신선한 재료로 만든 정통 스시를 즐길 수 있는 곳입니다. 매일 아침 공수되는 신선한 해산물로 최고의 맛을 제공합니다.",
    imageUrl: "/images/sushi.jpg",
    rating: 4.7,
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
    description: "30년 전통의 중화요리 전문점입니다. 정통 중국 요리사가 만드는 고급 중식을 즐겨보세요. 특히 딤섬과 탕수육이 인기 메뉴입니다.",
    imageUrl: "/images/chinese-food.jpg",
    rating: 4.2,
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
    description: "수제 도우로 만든 정통 이탈리안 피자를 맛볼 수 있는 곳입니다. 화덕에서 구워낸 바삭한 도우와 신선한 토핑의 조화가 일품입니다.",
    imageUrl: "/images/pizza.jpg",
    rating: 4.6,
    latitude: 37.5087,
    longitude: 127.0476,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

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
  }
]

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = MOCK_RESTAURANTS[params.id]

  if (!restaurant) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">맛집을 찾을 수 없습니다</h1>
        <p className="mb-8">요청하신 맛집 정보를 찾을 수 없습니다. 다른 맛집을 탐색해보세요.</p>
        <Link href="/restaurants">
          <Button>맛집 목록으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/restaurants" className="flex items-center text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          맛집 목록으로 돌아가기
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 맛집 정보 */}
          <div className="mb-8">
            <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
              <Image
                src={restaurant.imageUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="font-medium">{restaurant.rating}</span>
              </div>
              <span className="text-gray-500">|</span>
              <span className="ml-4 text-gray-600">{restaurant.category}</span>
              <span className="text-gray-500 mx-2">•</span>
              <span className="text-gray-600">가격 {restaurant.priceLevel}</span>
            </div>
            
            <div className="flex items-start mb-4">
              <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span>{restaurant.address}</span>
            </div>
            
            <div className="flex items-start mb-6">
              <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
              <span>영업시간: 11:00 - 21:00 (매주 월요일 휴무)</span>
            </div>
            
            <p className="text-gray-700 mb-6">{restaurant.description}</p>
            
            <div>
              <Link href={`/reviews/write?restaurantId=${restaurant.id}`}>
                <Button>리뷰 작성하기</Button>
              </Link>
            </div>
          </div>
          
          {/* 리뷰 섹션 */}
          <div>
            <h2 className="text-2xl font-bold mb-6">리뷰</h2>
            <Suspense fallback={<p>리뷰 로딩 중...</p>}>
              <div className="space-y-6">
                {MOCK_REVIEWS.filter(review => review.restaurantId === restaurant.id).map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </Suspense>
          </div>
        </div>
        
        {/* 사이드바 - 지도 및 메뉴 정보 */}
        <div className="space-y-6">
          {/* 지도 영역 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-3">위치</h3>
              <KakaoMap 
                latitude={restaurant.latitude}
                longitude={restaurant.longitude}
                address={restaurant.address}
                name={restaurant.name}
                height="200px"
              />
              <p className="text-sm text-gray-600 mt-3">{restaurant.address}</p>
            </CardContent>
          </Card>
          
          {/* 메뉴 정보 */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">주요 메뉴</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>김치찌개</span>
                  <span className="font-medium">8,000원</span>
                </div>
                <div className="flex justify-between">
                  <span>된장찌개</span>
                  <span className="font-medium">8,000원</span>
                </div>
                <div className="flex justify-between">
                  <span>제육볶음</span>
                  <span className="font-medium">10,000원</span>
                </div>
                <div className="flex justify-between">
                  <span>비빔밥</span>
                  <span className="font-medium">9,000원</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border rounded-lg p-4">
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
        <div className="flex flex-wrap gap-2">
          {review.images.map((image, index) => (
            <div key={index} className="relative h-24 w-24 rounded-md overflow-hidden">
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
    </div>
  )
} 