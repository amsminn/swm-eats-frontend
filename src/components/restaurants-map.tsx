"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { Restaurant } from "@/types"
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

interface RestaurantsMapProps {
  restaurants: Restaurant[]
  height?: string
  onSelectRestaurant?: (id: string) => void
}

export function RestaurantsMap({ 
  restaurants,
  height = "300px",
  onSelectRestaurant
}: RestaurantsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [renderCount, setRenderCount] = useState(0)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const { isKakaoLoaded, isInitialized } = useMap()

  // Calculate center of map from all restaurants
  const calculateCenter = () => {
    if (restaurants.length === 0) {
      // Default to 공덕역 if no restaurants
      return GONGDEOK_STATION
    }
    
    const totalLat = restaurants.reduce((sum, r) => sum + r.latitude, 0)
    const totalLng = restaurants.reduce((sum, r) => sum + r.longitude, 0)
    
    return {
      lat: totalLat / restaurants.length,
      lng: totalLng / restaurants.length
    }
  }

  // 1. 강제 리렌더링을 위한 useEffect
  useEffect(() => {
    // 컴포넌트 마운트 후 한번만 강제 리렌더링
    if (renderCount === 0) {
      setRenderCount(1)
    }
  }, [renderCount])

  // 2. 카카오맵 초기화
  useEffect(() => {
    console.log("RestaurantsMap effect running with:", {
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

        const center = calculateCenter()
        console.log("Initializing map with center:", center)

        // 지도 초기화
        const options = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
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
        
        // 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl()
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
        
        const mapTypeControl = new window.kakao.maps.MapTypeControl()
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)
        
        // 마커 추가
        if (restaurants.length > 0) {
          restaurants.forEach(restaurant => {
            const position = new window.kakao.maps.LatLng(restaurant.latitude, restaurant.longitude)
            
            const marker = new window.kakao.maps.Marker({
              position,
              map: map
            })
            
            const iwContent = `
              <div style="padding:5px; width: 150px;">
                <b>${restaurant.name}</b><br>
                <span style="font-size: 12px; color: #888;">${restaurant.category} · 가격 ${restaurant.priceLevel}</span>
              </div>
            `
            const infowindow = new window.kakao.maps.InfoWindow({
              content: iwContent
            })
            
            window.kakao.maps.event.addListener(marker, 'mouseover', function() {
              infowindow.open(map, marker)
            })
            
            window.kakao.maps.event.addListener(marker, 'mouseout', function() {
              infowindow.close()
            })
            
            if (onSelectRestaurant) {
              window.kakao.maps.event.addListener(marker, 'click', function() {
                onSelectRestaurant(restaurant.id)
              })
            }
          })
          console.log(`Added ${restaurants.length} markers successfully`)
        } else {
          // 맛집이 없는 경우 공덕역 마커 추가
          const gongdeokMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(GONGDEOK_STATION.lat, GONGDEOK_STATION.lng),
            map: map
          })
          
          const infoContent = `
            <div style="padding:5px; width: 150px;">
              <b>공덕역</b><br>
              <span style="font-size: 12px; color: #666;">맛집 찾기 시작 위치</span>
            </div>
          `
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoContent
          })
          
          window.kakao.maps.event.addListener(gongdeokMarker, "mouseover", () => {
            infoWindow.open(map, gongdeokMarker)
          })
          
          window.kakao.maps.event.addListener(gongdeokMarker, "mouseout", () => {
            infoWindow.close()
          })
        }

        // 지도 크기 업데이트 트리거
        setTimeout(() => {
          map.relayout()
          map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
        }, 100)
        
        setIsLoading(false)
        console.log("Map initialization completed")
      } catch (error) {
        console.error("Kakao Map init error:", error)
        setIsError(true)
        setIsLoading(false)
      }
    }, 500) // 지연 시간 500ms

    return () => clearTimeout(initMapTimer)
  }, [isKakaoLoaded, isInitialized, renderCount, mapInstance, restaurants, onSelectRestaurant])

  // 윈도우 리사이즈 시 지도 크기 조정
  useEffect(() => {
    if (!mapInstance) return

    const handleResize = () => {
      mapInstance.relayout()
      const center = calculateCenter()
      mapInstance.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mapInstance, restaurants])

  // 오류 화면
  if (isError) {
    return (
      <div 
        className="w-full rounded-md bg-gray-100 flex flex-col items-center justify-center p-4"
        style={{ height }}
      >
        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm text-center mb-1">지도를 불러올 수 없습니다</p>
        <p className="text-gray-500 text-xs text-center">
          {restaurants.length > 0 
            ? `${restaurants.length}개의 맛집 정보는 목록에서 확인할 수 있습니다` 
            : "맛집 정보를 찾을 수 없습니다"}
        </p>
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