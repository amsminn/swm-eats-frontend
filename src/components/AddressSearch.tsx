"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddressSearchProps {
  onSelectAddress: (result: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function AddressSearch({ onSelectAddress }: AddressSearchProps) {
  const [keyword, setKeyword] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_REST_API_KEY

    if (!apiKey) {
      setError("카카오맵 API 키가 없습니다.")
      return
    }

    // 서비스 라이브러리 로드 함수
    const loadServices = () => {
      const servicesScript = document.createElement("script")
      servicesScript.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services`
      servicesScript.async = true
      servicesScript.onload = () => {
        setIsLoaded(true)
      }
      servicesScript.onerror = () => {
        setError("카카오맵 서비스 라이브러리 로드 실패")
      }
      document.head.appendChild(servicesScript)
    }

    // 카카오맵 API가 이미 로드되었는지 확인
    if (window.kakao && window.kakao.maps) {
      if (!window.kakao.maps.services) {
        loadServices()
      } else {
        setIsLoaded(true)
      }
      return
    }

    // 카카오맵 API 로드
    const script = document.createElement("script")
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`
    script.async = true
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("카카오맵 API 로드 완료 (services 포함)")
        setIsLoaded(true)
      })
    }
    script.onerror = () => {
      setError("카카오맵 API 로드 실패")
    }

    document.head.appendChild(script)
  }, [])

  const handleSearch = () => {
    if (!keyword.trim()) {
      setError("검색어를 입력해주세요.")
      return
    }

    if (!isLoaded) {
      setError("카카오맵 API가 아직 로드되지 않았습니다.")
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const geocoder = new window.kakao.maps.services.Geocoder()

      geocoder.addressSearch(keyword, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const { address_name, y, x } = result[0]
          
          onSelectAddress({
            address: address_name,
            latitude: parseFloat(y),
            longitude: parseFloat(x)
          })
        } else {
          setError("주소를 찾을 수 없습니다. 다른 검색어로 시도해주세요.")
        }
        setIsSearching(false)
      })
    } catch (error) {
      setError("주소 검색 중 오류가 발생했습니다.")
      setIsSearching(false)
    }
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">주소 검색</h3>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="주소 입력 (예: 강남구 테헤란로)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            disabled={!isLoaded || isSearching}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={!isLoaded || isSearching}
        >
          {isSearching ? "검색 중..." : <Search className="h-4 w-4" />}
        </Button>
      </div>
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
      
      <p className="text-gray-500 text-xs mt-2">
        도로명 주소, 지번 주소, 건물명 등으로 검색할 수 있습니다.
      </p>
    </div>
  )
} 