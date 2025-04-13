"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Star, Upload, X, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Restaurant } from "@/types"

// Mock restaurants data
const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "1",
    name: "맛있는 김치찌개",
    address: "서울시 강남구 테헤란로 123",
    category: "한식",
    priceLevel: 1,
    description: "소마센터 근처 맛있는 김치찌개 맛집",
    imageUrl: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9",
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
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    rating: 4.7,
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
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d",
    rating: 4.2,
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
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    rating: 4.6,
    latitude: 37.5087,
    longitude: 127.0476,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
]

const reviewSchema = z.object({
  restaurantId: z.string({
    required_error: "맛집을 선택해주세요."
  }),
  rating: z.number({
    required_error: "별점을 선택해주세요."
  }).min(1, "별점을 선택해주세요.").max(5),
  priceLevel: z.number({
    required_error: "가격대를 선택해주세요."
  }).min(1, "가격대를 선택해주세요.").max(5),
  comment: z.string({
    required_error: "리뷰 내용을 입력해주세요."
  }).min(10, "리뷰는 최소 10자 이상 작성해주세요."),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export default function WriteReviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get('restaurantId')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [priceLevel, setPriceLevel] = useState<number>(3)
  const [images, setImages] = useState<string[]>([])
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      restaurantId: restaurantId || "",
      rating: 0,
      priceLevel: 3,
      comment: ""
    }
  })

  // Set initial restaurant ID if provided in URL
  useEffect(() => {
    if (restaurantId) {
      setValue("restaurantId", restaurantId)
    }
  }, [restaurantId, setValue])

  // Update form value when rating changes
  useEffect(() => {
    setValue("rating", rating)
  }, [rating, setValue])
  
  // Update form value when price level changes
  useEffect(() => {
    setValue("priceLevel", priceLevel)
  }, [priceLevel, setValue])

  // Handle star rating selection
  function handleRatingClick(value: number) {
    setRating(value)
    setValue("rating", value, { shouldValidate: true })
  }

  // Handle price level change
  function handlePriceLevelChange(value: number[]) {
    const newPrice = value[0]
    setPriceLevel(newPrice)
    setValue("priceLevel", newPrice, { shouldValidate: true })
  }

  // Handle image upload
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    
    // In a real app, you would upload the image to a server/storage
    // Here we're just creating object URLs for preview
    const newImages = Array.from(files).map(file => URL.createObjectURL(file))
    setImages(prev => [...prev, ...newImages])
  }
  
  // Handle image removal
  function handleRemoveImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  async function onSubmit(data: ReviewFormValues) {
    setIsSubmitting(true)
    
    try {
      // In a real app, you would send the data to your API
      console.log("Submitting review:", { 
        ...data, 
        images,
        priceLevel: data.priceLevel 
      })
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate to restaurant detail page
      router.push(`/restaurants/${data.restaurantId}`)
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/restaurants" className="flex items-center text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          맛집 목록으로 돌아가기
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">리뷰 작성하기</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="restaurantId" className="text-base font-medium mb-2 block">
                맛집 선택
              </Label>
              <select
                id="restaurantId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                {...register("restaurantId")}
                disabled={isSubmitting}
              >
                <option value="">맛집을 선택해주세요</option>
                {MOCK_RESTAURANTS.map(restaurant => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name} ({restaurant.category})
                  </option>
                ))}
              </select>
              {errors.restaurantId && (
                <p className="text-sm text-red-500 mt-1">{errors.restaurantId.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-base font-medium mb-2 block">별점</Label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    className={`h-8 w-8 cursor-pointer ${
                      value <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRatingClick(value)}
                    onMouseEnter={() => setHoveredRating(value)}
                    onMouseLeave={() => setHoveredRating(0)}
                  />
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-base font-medium mb-2 block">가격대</Label>
              <div className="space-y-4">
                <Slider
                  defaultValue={[priceLevel]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={handlePriceLevelChange}
                  className="py-4"
                />
                <div className="flex justify-between items-center px-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex flex-col items-center">
                      <span className={`font-medium text-sm ${
                        value <= priceLevel ? "text-indigo-600" : "text-gray-300"
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-500 px-1">
                  <span>저렴함</span>
                  <span>보통</span>
                  <span>비쌈</span>
                </div>
              </div>
              {errors.priceLevel && (
                <p className="text-sm text-red-500 mt-1">{errors.priceLevel.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="comment" className="text-base font-medium mb-2 block">
                리뷰 내용
              </Label>
              <Textarea
                id="comment"
                placeholder="맛집에 대한 솔직한 리뷰를 남겨주세요"
                className="min-h-32"
                {...register("comment")}
                disabled={isSubmitting}
              />
              {errors.comment && (
                <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-base font-medium mb-2 block">
                사진 첨부 (선택)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative h-32 w-full rounded-md overflow-hidden border">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md group-hover:opacity-100 opacity-0 transition-opacity"
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-center h-32 w-full rounded-md border border-dashed">
                  <label className="cursor-pointer flex flex-col items-center p-4">
                    <Upload className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">사진 추가</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                최대 5장까지 업로드 가능합니다. (각 이미지 최대 5MB)
              </p>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                className="mr-2"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "제출 중..." : "리뷰 등록"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 