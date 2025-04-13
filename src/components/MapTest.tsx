"use client"

import { useEffect } from "react"
import { useMap } from "@/contexts/MapContext"

export function MapTest() {
  const { isKakaoLoaded, isInitialized } = useMap()

  useEffect(() => {
    // Guard against server-side rendering
    if (typeof window === 'undefined') return;
    
    console.log("=== Kakao Maps API 상태 확인 ===")
    console.log("window.kakao:", window.kakao)
    console.log("window.kakao.maps:", window.kakao?.maps)
    console.log("isKakaoLoaded:", isKakaoLoaded)
    console.log("isInitialized:", isInitialized)
    
    if (window.kakao?.maps) {
      console.log("=== Kakao Maps API 메서드 테스트 ===")
      try {
        const latlng = new window.kakao.maps.LatLng(37.5665, 126.9780)
        console.log("LatLng 생성 테스트:", latlng)
        
        const mapTypeId = window.kakao.maps.MapTypeId.ROADMAP
        console.log("MapTypeId 테스트:", mapTypeId)
        
        console.log("=== Kakao Maps API 초기화 성공 ===")
      } catch (error) {
        console.error("Kakao Maps API 테스트 실패:", error)
      }
    }
  }, [isKakaoLoaded, isInitialized])

  // Safely render the component with checks for window object
  const kakaoExists = typeof window !== 'undefined' && !!window.kakao;
  const kakaoMapsExists = kakaoExists && !!window.kakao.maps;

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-bold mb-2">Kakao Maps API 상태</h3>
      <div className="space-y-2">
        <p>API 로드 상태: {isKakaoLoaded ? "✅ 로드됨" : "❌ 로드되지 않음"}</p>
        <p>초기화 상태: {isInitialized ? "✅ 초기화됨" : "❌ 초기화되지 않음"}</p>
        <p>window.kakao: {kakaoExists ? "✅ 존재" : "❌ 없음"}</p>
        <p>window.kakao.maps: {kakaoMapsExists ? "✅ 존재" : "❌ 없음"}</p>
      </div>
    </div>
  )
} 