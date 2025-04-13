"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"
import { useMap } from "@/contexts/MapContext"

// 카카오맵 타입 선언 - any로 대체하여 타입 충돌 방지
declare global {
  interface Window {
    kakao: any
  }
  
  // HTMLDivElement에 __kakao_map 프로퍼티 추가
  interface HTMLDivElement {
    __kakao_map?: any;
  }
}

// 공덕역 위치 좌표
const GONGDEOK_STATION = {
  lat: 37.5447,
  lng: 126.9515
}

interface MapContainerProps {
  center?: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    content?: string;
  }>;
  width?: string;
  height?: string;
  level?: number;
  onMapLoad?: (map: any) => void;
}

export default function MapContainer({
  center = GONGDEOK_STATION, // 공덕역 기본값
  markers = [],
  width = "100%",
  height = "400px",
  level = 5, // 더 넓은 영역 표시 (약 2km 범위)
  onMapLoad
}: MapContainerProps) {
  // 상태 관리
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
    console.log("InitMap effect running with:", {
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

        console.log("Attempting to create map with:", {
          mapRef: !!mapRef.current,
          dimensions: {
            width: mapRef.current.clientWidth,
            height: mapRef.current.clientHeight
          }
        })

        // 지도 초기화
        const options = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level
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
        setIsLoading(false)

        // 마커 추가
        if (markers.length > 0) {
          markers.forEach((markerData) => {
            const position = new window.kakao.maps.LatLng(
              markerData.position.lat, 
              markerData.position.lng
            )
            const marker = new window.kakao.maps.Marker({ position })
            marker.setMap(map)

            if (markerData.content) {
              const infoWindow = new window.kakao.maps.InfoWindow({
                content: markerData.content
              })
              window.kakao.maps.event.addListener(marker, "click", () => {
                infoWindow.open(map, marker)
              })
            }
          })
        } else {
          // 마커가 없는 경우 기본 공덕역 마커 추가
          const gongdeokMarker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(GONGDEOK_STATION.lat, GONGDEOK_STATION.lng),
            map: map
          })
          
          const infoContent = `
            <div style="padding:5px; width: 150px;">
              <b>공덕역</b><br>
              <span style="font-size: 12px; color: #666;">서울특별시 마포구</span>
            </div>
          `
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoContent
          })
          
          window.kakao.maps.event.addListener(gongdeokMarker, "click", () => {
            infoWindow.open(map, gongdeokMarker)
          })
        }

        // 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl()
        map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

        const mapTypeControl = new window.kakao.maps.MapTypeControl()
        map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

        // 지도 크기 업데이트 트리거
        setTimeout(() => {
          map.relayout()
          map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
        }, 100)

        // 콜백 호출
        if (onMapLoad) {
          onMapLoad(map)
        }
      } catch (error) {
        console.error("Map initialization error:", error)
        setIsError(true)
        setIsLoading(false)
      }
    }, 500) // 지연 시간 500ms

    return () => clearTimeout(initMapTimer)
  }, [isKakaoLoaded, isInitialized, renderCount, mapInstance, center, level, markers, onMapLoad])

  // 3. center 변경 시 지도 중심점 업데이트
  useEffect(() => {
    if (!mapInstance) return

    try {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
      mapInstance.setCenter(newCenter)
    } catch (error) {
      console.error("Error updating map center:", error)
    }
  }, [mapInstance, center])

  // 4. 컴포넌트 언마운트 시 지도 정리
  useEffect(() => {
    return () => {
      if (mapInstance) {
        // 지도 인스턴스 정리 로직
        setMapInstance(null)
      }
    }
  }, [mapInstance])

  // 5. 윈도우 리사이즈 시 지도 크기 조정
  useEffect(() => {
    if (!mapInstance) return

    const handleResize = () => {
      mapInstance.relayout()
      mapInstance.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mapInstance, center])

  // 오류 화면
  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gray-100 rounded-md"
        style={{ width, height }}
      >
        <MapPin className="w-8 h-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm">지도를 불러올 수 없습니다</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      style={{ width, height }}
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