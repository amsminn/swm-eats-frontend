"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { useMap } from "@/contexts/MapContext"

// 공덕역 위치 좌표
const GONGDEOK_STATION = {
  lat: 37.5447,
  lng: 126.9515
}

declare global {
  interface Window {
    kakao: any
  }
  
  // HTMLDivElement에 __kakao_map 프로퍼티 추가
  interface HTMLDivElement {
    __kakao_map?: any;
  }
}

interface KakaoMapProps {
  latitude?: number
  longitude?: number
  address?: string
  name?: string
  height?: string
}

export function KakaoMap({ 
  latitude = GONGDEOK_STATION.lat, 
  longitude = GONGDEOK_STATION.lng, 
  address = "서울특별시 마포구 공덕동", 
  name = "공덕역",
  height = "300px" 
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [renderCount, setRenderCount] = useState(0)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const { isKakaoLoaded, isInitialized } = useMap()

  // 1. 강제 리렌더링을 위한 useEffect
  useEffect(() => {
    // 컴포넌트 마운트 후 한번만 강제 리렌더링
    if (renderCount === 0) {
      setRenderCount(1)
    }
  }, [renderCount])

  // 2. 카카오맵 초기화
  useEffect(() => {
    console.log("KakaoMap effect running with:", {
      isKakaoLoaded,
      isInitialized,
      renderCount,
      hasMapRef: !!mapRef.current,
      mapRefDimensions: mapRef.current ? {
        width: mapRef.current.clientWidth,
        height: mapRef.current.clientHeight,
        offsetWidth: mapRef.current.offsetWidth,
        offsetHeight: mapRef.current.offsetHeight
      } : null
    })

    // 초기화 조건 확인
    if (!isKakaoLoaded || !isInitialized || !mapRef.current || mapInstance) {
      return
    }

    // 적절한 지연 후 초기화 시도
    const initMapTimer = setTimeout(() => {
      try {
        if (!mapRef.current) {
          console.error("Map container ref is still null after delay")
          return
        }

        console.log("Initializing map for:", { name, address, lat: latitude, lng: longitude })

        // 지도 초기화
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 5 // 더 넓은 영역 표시 (약 2km 범위)
        }

        // 맵이 존재하면 파괴
        if (window.kakao.maps.Map && mapRef.current.__kakao_map) {
          delete mapRef.current.__kakao_map
        }

        // 새 지도 생성 - mapRef의 직계 자식으로 지도 컨테이너 생성
        mapRef.current.innerHTML = ''
        const mapContainer = document.createElement('div')
        mapContainer.style.width = '100%'
        mapContainer.style.height = '100%'
        mapRef.current.appendChild(mapContainer)

        const map = new window.kakao.maps.Map(mapContainer, options)
        console.log("Map created successfully in container")
        mapRef.current.__kakao_map = map
        setMapInstance(map)
        
        // 마커 생성
        const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)
        const marker = new window.kakao.maps.Marker({
          position: markerPosition
        })
        marker.setMap(map)
        
        // 인포윈도우 생성
        const iwContent = `
          <div style="padding:5px; width: 200px; word-break: keep-all;">
            <b>${name}</b><br>
            ${address}
          </div>
        `
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent
        })
        infowindow.open(map, marker)
        
        // 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl()
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
        
        const mapTypeControl = new window.kakao.maps.MapTypeControl()
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

        // 지도 크기 업데이트 트리거
        setTimeout(() => {
          map.relayout()
          map.setCenter(new window.kakao.maps.LatLng(latitude, longitude))
        }, 100)
        
        setIsLoading(false)
        console.log("Map initialization completed successfully")
      } catch (error) {
        console.error("Kakao Map init error:", error)
        setIsError(true)
        setIsLoading(false)
      }
    }, 1000) // 지연 시간 1000ms

    return () => clearTimeout(initMapTimer)
  }, [isKakaoLoaded, isInitialized, renderCount, mapInstance, latitude, longitude, name, address])

  // 윈도우 리사이즈 시 지도 크기 조정
  useEffect(() => {
    if (!mapInstance) return

    const handleResize = () => {
      mapInstance.relayout()
      mapInstance.setCenter(new window.kakao.maps.LatLng(latitude, longitude))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mapInstance, latitude, longitude])

  // 좌표가 변경되었을 때 지도 중심점 변경
  useEffect(() => {
    if (!mapInstance) return
    
    mapInstance.setCenter(new window.kakao.maps.LatLng(latitude, longitude))
  }, [mapInstance, latitude, longitude])

  // 오류 화면
  if (isError) {
    return (
      <div 
        className="w-full rounded-md bg-gray-100 flex flex-col items-center justify-center p-4"
        style={{ height }}
      >
        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm text-center mb-1">지도를 불러올 수 없습니다</p>
        <p className="text-gray-500 text-xs text-center">{address}</p>
        <button 
          className="mt-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600"
          onClick={() => window.location.reload()}
        >
          다시 시도
        </button>
      </div>
    )
  }

  // 고정된 컨테이너 항상 렌더링 (로딩 및 로드 완료 상태 모두)
  return (
    <div 
      className="relative rounded-md overflow-hidden border border-gray-200"
      style={{ height }}
    >
      <div
        ref={mapRef}
        className="absolute inset-0 w-full h-full"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10">
          <p className="text-gray-700 font-medium">지도를 불러오는 중...</p>
        </div>
      )}
    </div>
  )
} 