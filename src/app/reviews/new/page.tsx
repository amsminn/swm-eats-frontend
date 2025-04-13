"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowLeft, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Restaurant } from "@/types"

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
  }
}

export default function NewReviewPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 리뷰 작성 API 호출
    console.log({ rating, comment, images, restaurantId: selectedRestaurant })
    router.push("/reviews")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/reviews" className="flex items-center text-indigo-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          리뷰 목록으로 돌아가기
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">리뷰 작성</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              맛집 선택
            </label>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">맛집을 선택해주세요</option>
              {Object.values(MOCK_RESTAURANTS).map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              별점
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      value <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리뷰 내용
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="맛집에 대한 리뷰를 작성해주세요"
              className="min-h-[200px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진 첨부
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    const newImages = files.map((file) => URL.createObjectURL(file))
                    setImages([...images, ...newImages])
                  }}
                />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </label>
              {images.map((image, index) => (
                <div key={index} className="relative w-24 h-24">
                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 96px, 96px"
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              리뷰 작성하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 