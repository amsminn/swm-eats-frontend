"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { MapPin } from "lucide-react"

declare global {
  interface Window {
    kakao: any
  }
}

interface KakaoMapProps {
  latitude: number
  longitude: number
  address: string
  name: string
  height?: string
}

export function KakaoMap({ 
  latitude, 
  longitude, 
  address, 
  name,
  height = "300px" 
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize map when script is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      setIsError(true)
      setIsLoading(false)
      return
    }
    
    try {
      // Create map instance
      const options = {
        center: new window.kakao.maps.LatLng(latitude, longitude),
        level: 3
      }
      
      const map = new window.kakao.maps.Map(mapRef.current, options)
      mapInstanceRef.current = map
      
      // Create marker
      const markerPosition = new window.kakao.maps.LatLng(latitude, longitude)
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      })
      marker.setMap(map)
      markerRef.current = marker
      
      // Create info window
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
      
      // Add controls
      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
      
      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)
      
      setIsLoading(false)
    } catch (error) {
      console.error("Kakao Map init error:", error)
      setIsError(true)
      setIsLoading(false)
    }
  }

  // Handle script loaded event
  const handleScriptLoad = () => {
    try {
      window.kakao.maps.load(initializeMap)
    } catch (error) {
      console.error("Kakao Maps load error:", error)
      setIsError(true)
      setIsLoading(false)
    }
  }

  // Handle script error
  const handleScriptError = () => {
    console.error("Failed to load Kakao Maps script")
    setIsError(true)
    setIsLoading(false)
  }

  // Update map when props change
  useEffect(() => {
    if (isError) return
    
    if (!mapInstanceRef.current || !markerRef.current || !window.kakao) return
    
    try {
      // Update center
      const newCenter = new window.kakao.maps.LatLng(latitude, longitude)
      mapInstanceRef.current.setCenter(newCenter)
      
      // Update marker
      markerRef.current.setPosition(newCenter)
    } catch (error) {
      console.error("Kakao Map update error:", error)
      setIsError(true)
    }
  }, [latitude, longitude, isError])

  // Fallback UI for errors
  if (isError) {
    return (
      <div 
        className="w-full rounded-md bg-gray-100 flex flex-col items-center justify-center p-4"
        style={{ height }}
      >
        <MapPin className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-gray-500 text-sm text-center mb-1">지도를 불러올 수 없습니다</p>
        <p className="text-gray-500 text-xs text-center">{address}</p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="w-full rounded-md bg-gray-100 flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">지도 로딩 중...</p>
      </div>
    )
  }

  return (
    <>
      <Script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="lazyOnload"
      />
      <div 
        ref={mapRef} 
        className="w-full rounded-md overflow-hidden"
        style={{ height }}
      />
    </>
  )
} 