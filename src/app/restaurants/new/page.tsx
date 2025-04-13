"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Image as ImageIcon, Search } from "lucide-react"
import Script from "next/script"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useMap } from "@/contexts/MapContext"
import { Restaurant } from "@/types"

declare global {
  interface Window {
    kakao: any
  }
}

export default function NewRestaurantPage() {
  const router = useRouter()
  const { map, setMap, marker, setMarker, searchAddress } = useMap()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    category: "",
    priceLevel: 1,
    description: "",
    imageUrl: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapInstance, setMapInstance] = useState<any>(null)

  const initializeMap = () => {
    if (isMapLoaded && !map && mapContainerRef.current) {
      try {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3
        }
        
        console.log('Creating map with options:', options)
        const newMap = new window.kakao.maps.Map(mapContainerRef.current, options)
        console.log('Map created:', newMap)
        setMap(newMap)
      } catch (error) {
        console.error('Failed to initialize map:', error)
      }
    }
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_API_KEY}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => {
      console.log("Kakao Maps script loaded");
      window.kakao.maps.load(() => {
        console.log("Kakao Maps API initialized");
        setTimeout(initializeMap, 100);
      });
    }
    script.onerror = (e) => {
      console.error('Failed to load Kakao Maps API:', e)
      setIsMapLoaded(false)
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
      if (mapInstance) {
        mapInstance.setMap(null)
      }
    }
  }, [])

  useEffect(() => {
    if (isMapLoaded && !map && mapContainerRef.current) {
      try {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 3
        }
        
        console.log('Creating map with options:', options)
        const newMap = new window.kakao.maps.Map(mapContainerRef.current, options)
        console.log('Map created:', newMap)
        setMap(newMap)
      } catch (error) {
        console.error('Failed to initialize map:', error)
      }
    }
  }, [isMapLoaded, map, setMap])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "priceLevel" ? parseInt(value) : value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddressSearch = async () => {
    console.log('Starting address search:', formData.address)
    if (!formData.address) {
      console.log('No address provided')
      return
    }

    const result = await searchAddress(formData.address)
    console.log('Address search result:', result)

    if (result && map) {
      try {
        const position = new window.kakao.maps.LatLng(parseFloat(result.y), parseFloat(result.x))
        console.log('Setting marker position:', position)
        
        if (marker) {
          console.log('Removing existing marker')
          marker.setMap(null)
        }
        
        const newMarker = new window.kakao.maps.Marker({
          position: position
        })
        console.log('Created new marker:', newMarker)
        
        newMarker.setMap(map)
        setMarker(newMarker)
        map.setCenter(position)
        console.log('Map center updated to:', position)
      } catch (error) {
        console.error('Error setting marker:', error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: 맛집 등록 API 호출
    console.log(formData)
    router.push("/restaurants")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link href="/restaurants" className="flex items-center text-indigo-600 hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          맛집 목록으로 돌아가기
        </Link>
        
        <h1 className="text-3xl font-bold mb-6">맛집 등록</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              맛집 이름
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="맛집 이름을 입력해주세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              도로명 주소
            </label>
            <div className="flex space-x-2">
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="도로명 주소를 입력해주세요 (예: 서울시 강남구 테헤란로 123)"
                required
              />
              <Button
                type="button"
                onClick={handleAddressSearch}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Search className="h-4 w-4 mr-1" />
                검색
              </Button>
            </div>
          </div>

          <div ref={mapContainerRef} className="w-full h-64 rounded-lg bg-gray-100">
            {!isMapLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-500">지도를 불러오는 중...</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              카테고리
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">카테고리를 선택해주세요</option>
              <option value="한식">한식</option>
              <option value="일식">일식</option>
              <option value="중식">중식</option>
              <option value="양식">양식</option>
              <option value="분식">분식</option>
              <option value="카페">카페</option>
              <option value="아시안">아시안</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              가격대
            </label>
            <select
              name="priceLevel"
              value={formData.priceLevel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="1">저가 (10,000원 미만)</option>
              <option value="2">중가 (10,000원 ~ 30,000원)</option>
              <option value="3">고가 (30,000원 이상)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="맛집에 대한 설명을 입력해주세요"
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사진
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </label>
              {imagePreview && (
                <div className="relative w-32 h-32">
                  <Image
                    src={imagePreview}
                    alt="맛집 이미지"
                    fill
                    sizes="(max-width: 768px) 128px, 128px"
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              맛집 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 