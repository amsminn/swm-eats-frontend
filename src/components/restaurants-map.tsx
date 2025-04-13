"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Restaurant } from "@/types"
import { MapPin } from "lucide-react"

declare global {
  interface Window {
    kakao: any
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
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  // Calculate center of map from all restaurants
  const calculateCenter = () => {
    if (restaurants.length === 0) {
      // Default to Seoul if no restaurants
      return { lat: 37.5665, lng: 126.9780 }
    }
    
    const totalLat = restaurants.reduce((sum, r) => sum + r.latitude, 0)
    const totalLng = restaurants.reduce((sum, r) => sum + r.longitude, 0)
    
    return {
      lat: totalLat / restaurants.length,
      lng: totalLng / restaurants.length
    }
  }

  // Initialize map when script is loaded
  const initializeMap = () => {
    if (!mapRef.current || !window.kakao || !window.kakao.maps) {
      console.error("Map initialization failed: missing dependencies", {
        mapRef: !!mapRef.current,
        kakao: !!window.kakao,
        kakaoMaps: window.kakao ? !!window.kakao.maps : false,
        apiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY
      })
      setIsError(true)
      setIsLoading(false)
      return
    }
    
    try {
      const center = calculateCenter()
      console.log("Initializing map with center:", center)
      
      // Create map instance
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 5
      }
      
      const map = new window.kakao.maps.Map(mapRef.current, options)
      mapInstanceRef.current = map
      console.log("Map instance created successfully")
      
      // Add controls
      const zoomControl = new window.kakao.maps.ZoomControl()
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)
      
      const mapTypeControl = new window.kakao.maps.MapTypeControl()
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)
      
      // Add markers
      addMarkers()
      setIsLoading(false)
      console.log("Map initialization completed")
    } catch (error) {
      console.error("Kakao Map init error:", error)
      setIsError(true)
      setIsLoading(false)
    }
  }

  // Add markers for all restaurants
  const addMarkers = () => {
    if (!mapInstanceRef.current || !window.kakao) return
    
    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []
      
      // Add new markers
      console.log(`Adding ${restaurants.length} markers to map`)
      restaurants.forEach(restaurant => {
        const position = new window.kakao.maps.LatLng(restaurant.latitude, restaurant.longitude)
        
        // Create marker
        const marker = new window.kakao.maps.Marker({
          position,
          map: mapInstanceRef.current
        })
        markersRef.current.push(marker)
        
        // Create info window
        const iwContent = `
          <div style="padding:5px; width: 150px;">
            <b>${restaurant.name}</b><br>
            <span style="font-size: 12px; color: #888;">${restaurant.category} · 가격 ${restaurant.priceLevel}</span>
          </div>
        `
        const infowindow = new window.kakao.maps.InfoWindow({
          content: iwContent
        })
        
        // Add event listeners
        window.kakao.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.open(mapInstanceRef.current, marker)
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
      console.log(`Added ${markersRef.current.length} markers successfully`)
    } catch (error) {
      console.error("Kakao Map add markers error:", error)
      setIsError(true)
    }
  }

  // Handle script loaded event
  const handleScriptLoad = () => {
    try {
      console.log("Kakao Maps script loaded successfully", {
        kakao: !!window.kakao,
        mapsObject: window.kakao ? !!window.kakao.maps : false,
        apiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY?.substring(0, 5) + '...',
        timestamp: new Date().toISOString()
      })
      setIsScriptLoaded(true)
      window.kakao.maps.load(() => {
        console.log("Kakao Maps API loaded successfully")
        initializeMap()
      })
    } catch (error) {
      console.error("Kakao Maps load error:", error, {
        kakao: window.kakao ? JSON.stringify(Object.keys(window.kakao)) : null,
        apiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY?.substring(0, 5) + '...'
      })
      setIsError(true)
      setIsLoading(false)
    }
  }

  // Handle script error
  const handleScriptError = (e: Error) => {
    console.error("Failed to load Kakao Maps script", {
      error: e,
      message: e.message,
      stack: e.stack,
      apiKey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY?.substring(0, 5) + '...',
      timestamp: new Date().toISOString()
    })
    setIsError(true)
    setIsLoading(false)
  }

  // Initialize map after component mounts and script is loaded
  useEffect(() => {
    if (isScriptLoaded && mapRef.current && window.kakao && window.kakao.maps && !mapInstanceRef.current) {
      console.log("Dependencies ready, initializing map")
      initializeMap()
    }
  }, [isScriptLoaded])

  // Update markers when restaurants change
  useEffect(() => {
    if (isError) return
    
    if (mapInstanceRef.current && window.kakao) {
      try {
        addMarkers()
        
        // Update center
        const center = calculateCenter()
        const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng)
        mapInstanceRef.current.setCenter(newCenter)
        console.log("Map center updated successfully")
      } catch (error) {
        console.error("Kakao Map update error:", error)
        setIsError(true)
      }
    }
  }, [restaurants, isError])

  // Fallback UI for errors
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
      </div>
    )
  }

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={handleScriptLoad}
        onError={handleScriptError}
        strategy="beforeInteractive"
      />
      {isLoading ? (
        <div 
          className="w-full rounded-md bg-gray-100 flex items-center justify-center"
          style={{ height }}
        >
          <p className="text-gray-500 text-sm">지도 로딩 중...</p>
        </div>
      ) : (
        <div 
          ref={mapRef} 
          className="w-full rounded-md overflow-hidden"
          style={{ height }}
        />
      )}
    </>
  )
} 