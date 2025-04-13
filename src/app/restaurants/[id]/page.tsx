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
    description: "신선한 재료로 만든 정통 스시를 즐길 수 있는 곳입니다. 매일 아침 공수되는 신선한 해산물로 최고의 맛을 제공합니다.",
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
    description: "30년 전통의 중화요리 전문점입니다. 정통 중국 요리사가 만드는 고급 중식을 즐겨보세요. 특히 딤섬과 탕수육이 인기 메뉴입니다.",
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
    description: "수제 도우로 만든 정통 이탈리안 피자를 맛볼 수 있는 곳입니다. 화덕에서 구워낸 바삭한 도우와 신선한 토핑의 조화가 일품입니다.",
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
    description: "손으로 직접 반죽한 쫄깃한 면발의 칼국수 전문점입니다. 시원한 국물과 풍부한 해산물 토핑이 일품입니다. 칼국수 외에도 수제 만두와 김치전 등 다양한 사이드 메뉴도 준비되어 있습니다.",
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
    description: "본격 인도 스타일의 향신료 가득한 커리 전문점입니다. 쉐프가 직접 블렌딩한 스파이스로 만든 다양한 커리와 난, 탄두리 치킨 등 정통 인도 요리를 맛볼 수 있습니다. 채식주의자를 위한 메뉴도 준비되어 있습니다.",
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
    description: "수제 디저트와 커피가 맛있는 프리미엄 카페입니다. 파티쉐가 매일 아침 직접 구워내는 신선한 케이크와 페이스트리, 그리고 바리스타의 정성이 담긴 스페셜티 커피를 함께 즐길 수 있습니다. 아늑한 인테리어로 데이트 코스로도 인기가 많습니다.",
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
    description: "매콤 달콤한 국민 간식, 떡볶이 전문점입니다. 50년 전통의 비법 양념으로 만든 떡볶이는 쫄깃한 떡과 매콤한 소스의 완벽한 조화를 이룹니다. 튀김, 순대, 어묵 등 다양한 분식 메뉴도 함께 즐길 수 있습니다.",
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
    description: "최상급 한우와 와인을 즐길 수 있는 프리미엄 스테이크 하우스입니다. 셰프의 숙련된 기술로 정확한 온도와 식감을 살린 스테이크와 엄선된 와인 리스트로 완벽한 식사를 경험할 수 있습니다. 프라이빗한 공간에서 특별한 날을 기념하기에 최적의 장소입니다.",
    imageUrl: "/images/steak.jpg",
    rating: 4.9,
    reviewCount: 32,
    latitude: 37.5012,
    longitude: 127.0243,
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

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const restaurant = MOCK_RESTAURANTS[params.id]

  // 레스토랑별 메뉴 정보
  const menus: Record<string, { name: string, price: string }[]> = {
    "1": [ // 김치찌개
      { name: "김치찌개", price: "8,000원" },
      { name: "된장찌개", price: "8,000원" },
      { name: "제육볶음", price: "10,000원" },
      { name: "비빔밥", price: "9,000원" }
    ],
    "2": [ // 스시
      { name: "모듬 스시 10pcs", price: "25,000원" },
      { name: "연어 스시 5pcs", price: "12,000원" },
      { name: "참치 스시 5pcs", price: "15,000원" },
      { name: "모듬 사시미", price: "30,000원" }
    ],
    "3": [ // 중식
      { name: "탕수육", price: "18,000원" },
      { name: "짜장면", price: "8,000원" },
      { name: "짬뽕", price: "9,000원" },
      { name: "마파두부", price: "15,000원" }
    ],
    "4": [ // 피자
      { name: "마르게리타 피자", price: "15,000원" },
      { name: "페퍼로니 피자", price: "16,000원" },
      { name: "콰트로 치즈 피자", price: "18,000원" },
      { name: "하우스 샐러드", price: "8,000원" }
    ],
    "5": [ // 칼국수
      { name: "바지락 칼국수", price: "9,000원" },
      { name: "들깨 칼국수", price: "9,500원" },
      { name: "수제 만두", price: "7,000원" },
      { name: "김치전", price: "8,000원" }
    ],
    "6": [ // 커리
      { name: "치킨 커리", price: "12,000원" },
      { name: "버터 치킨", price: "14,000원" },
      { name: "탄두리 치킨", price: "16,000원" },
      { name: "난 브레드", price: "3,000원" }
    ],
    "7": [ // 카페
      { name: "티라미수", price: "7,500원" },
      { name: "당근 케이크", price: "6,500원" },
      { name: "아메리카노", price: "4,500원" },
      { name: "카페 라떼", price: "5,500원" }
    ],
    "8": [ // 떡볶이
      { name: "떡볶이", price: "5,000원" },
      { name: "튀김 세트", price: "5,000원" },
      { name: "순대", price: "4,000원" },
      { name: "김밥", price: "3,500원" }
    ],
    "9": [ // 스테이크
      { name: "안심 스테이크 150g", price: "45,000원" },
      { name: "등심 스테이크 220g", price: "52,000원" },
      { name: "티본 스테이크 350g", price: "75,000원" },
      { name: "트러플 감자 퓨레", price: "12,000원" }
    ]
  }

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

  // 이 레스토랑의 메뉴 가져오기
  const restaurantMenus = menus[restaurant.id] || menus["1"] // 기본값으로 김치찌개 메뉴 사용

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
                {restaurantMenus.map((menu, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{menu.name}</span>
                    <span className="font-medium">{menu.price}</span>
                  </div>
                ))}
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
            sizes="(max-width: 768px) 40px, 40px"
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
                sizes="(max-width: 768px) 96px, 96px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 