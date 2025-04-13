"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ArrowLeft, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// Dynamically import map component with SSR disabled
const DynamicKakaoMap = dynamic(
  () => import('@/components/kakao-map').then(mod => mod.KakaoMap),
  { ssr: false }
)

// 리뷰 폼 스키마
const reviewSchema = z.object({
  restaurantId: z.string({
    required_error: "리뷰할 맛집을 선택해주세요",
  }),
  rating: z.number().min(1, "별점을 선택해주세요").max(5),
  priceLevel: z.number().min(1).max(4),
  comment: z.string().min(10, "리뷰는 최소 10자 이상 작성해주세요").max(500, "리뷰는 최대 500자까지 작성 가능합니다"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

export default function WriteReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [images, setImages] = useState<string[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  } | null>(null)

  // Mock restaurants data
  const MOCK_RESTAURANTS = [
    {
      id: "1",
      name: "맛있는 김치찌개",
      address: "서울시 강남구 테헤란로 123",
      latitude: 37.5665,
      longitude: 126.9780,
    },
    {
      id: "2",
      name: "정통 스시",
      address: "서울시 강남구 역삼로 45",
      latitude: 37.5015, 
      longitude: 127.0437,
    },
    {
      id: "3",
      name: "양자강",
      address: "서울시 서초구 사평대로 68",
      latitude: 37.5045,
      longitude: 127.0213,
    }
  ]

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      priceLevel: 2,
      comment: "",
    }
  })

  function handleRatingClick(value: number) {
    form.setValue("rating", value)
  }

  function handlePriceLevelChange(value: number[]) {
    form.setValue("priceLevel", value[0])
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast({
        title: "이미지는 최대 5개까지 업로드 가능합니다",
        variant: "destructive",
      })
      return
    }
    const newImages = files.map((file) => URL.createObjectURL(file))
    setImages([...images, ...newImages])
  }

  function handleRemoveImage(index: number) {
    setImages(images.filter((_, i) => i !== index))
  }

  async function onSubmit(data: ReviewFormValues) {
    toast({
      title: "리뷰가 작성되었습니다",
      description: "소중한 리뷰 감사합니다!",
    })
    console.log({ ...data, images })
    setTimeout(() => router.push("/reviews"), 1000)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/reviews" className="flex items-center text-indigo-600 hover:underline mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        리뷰 목록으로 돌아가기
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">리뷰 작성</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <FormField
                control={form.control}
                name="restaurantId"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>맛집 선택</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        const restaurant = MOCK_RESTAURANTS.find(r => r.id === value) || null
                        setSelectedRestaurant(restaurant)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="리뷰할 맛집을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_RESTAURANTS.map((restaurant) => (
                          <SelectItem key={restaurant.id} value={restaurant.id}>
                            {restaurant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedRestaurant && (
                <div className="mb-6">
                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h3 className="font-medium">{selectedRestaurant.name}</h3>
                    <p className="text-sm text-gray-500">{selectedRestaurant.address}</p>
                  </div>
                  <div className="h-[200px] mb-4 rounded-md overflow-hidden">
                    <DynamicKakaoMap
                      latitude={selectedRestaurant.latitude}
                      longitude={selectedRestaurant.longitude}
                      name={selectedRestaurant.name}
                      address={selectedRestaurant.address}
                      height="200px"
                    />
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>별점</FormLabel>
                    <FormControl>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleRatingClick(value)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                value <= field.value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceLevel"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>가격대</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Slider
                          value={[field.value]}
                          min={1}
                          max={4}
                          step={1}
                          onValueChange={handlePriceLevelChange}
                        />
                        <div className="flex justify-between">
                          <span>₩</span>
                          <span>₩₩</span>
                          <span>₩₩₩</span>
                          <span>₩₩₩₩</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel>리뷰 내용</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="이 맛집에 대한 솔직한 리뷰를 작성해주세요"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      {field.value.length}/500자
                    </p>
                  </FormItem>
                )}
              />

              <div className="mb-6">
                <FormLabel>사진 첨부</FormLabel>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      disabled={images.length >= 5}
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-3xl text-gray-400">+</span>
                      <span className="text-xs text-gray-500">{images.length}/5</span>
                    </div>
                  </label>
                  
                  {images.map((image, index) => (
                    <div key={index} className="relative w-full h-24">
                      <Image
                        src={image}
                        alt={`리뷰 이미지 ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 20vw, 96px"
                        className="object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1 -right-1 bg-gray-800 bg-opacity-70 rounded-full p-1"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG 파일만 업로드 가능합니다. (최대 5MB, 5장)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              리뷰 작성하기
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 