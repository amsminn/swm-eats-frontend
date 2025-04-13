"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { MapContextType, Address } from "@/types/map"

const MapContext = createContext<MapContextType | null>(null)

export function MapProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null)
  const [marker, setMarker] = useState<kakao.maps.Marker | null>(null)
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Early return if window is not available (SSR)
    if (typeof window === 'undefined') {
      return
    }
    
    console.log("MapProvider useEffect triggered")
    
    // Check if script is already loaded
    if (window.kakao && window.kakao.maps) {
      console.log('Kakao Maps API is already loaded')
      setIsKakaoLoaded(true)
      setIsInitialized(true)
      return
    }

    // Load the script if not already present
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_JAVASCRIPT_API_KEY}&libraries=services&autoload=false`
    script.async = true

    script.onload = () => {
      console.log('Kakao Maps API script loaded')
      if (!window.kakao?.maps?.load) {
        console.error('Kakao Maps API load function not found')
        return
      }
      
      window.kakao.maps.load(() => {
        console.log('Kakao Maps API initialized')
        // Verify that the API is properly loaded
        if (!window.kakao?.maps?.Map) {
          console.error('Kakao Maps API Map constructor not found')
          return
        }
        
        setIsKakaoLoaded(true)
        // Add a small delay to ensure everything is properly initialized
        setTimeout(() => {
          console.log('Setting isInitialized to true')
          setIsInitialized(true)
        }, 100)
      })
    }

    script.onerror = (e) => {
      console.error('Failed to load Kakao Maps API:', e)
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const searchAddress = useCallback(async (address: string): Promise<Address | null> => {
    // Early return if window is not available (SSR) or Kakao API not initialized
    if (typeof window === 'undefined' || !isKakaoLoaded || !isInitialized) {
      console.error('Kakao Maps API is not fully initialized yet')
      return null
    }

    console.log('Searching address:', address)

    return new Promise((resolve) => {
      try {
        if (!window.kakao?.maps?.services?.Geocoder) {
          console.error('Geocoder is not available')
          resolve(null)
          return
        }

        const geocoder = new window.kakao.maps.services.Geocoder()
        
        geocoder.addressSearch(address, (result: any[], status: string) => {
          console.log('Geocoder result:', { result, status })
          
          if (status === window.kakao.maps.services.Status.OK) {
            try {
              const { address_name, road_address_name, x, y } = result[0]
              const addressData = {
                address_name,
                region_1depth_name: result[0].address.region_1depth_name,
                region_2depth_name: result[0].address.region_2depth_name,
                region_3depth_name: result[0].address.region_3depth_name,
                road_address_name,
                x,
                y
              }
              console.log('Address data:', addressData)
              resolve(addressData)
            } catch (error) {
              console.error('Error processing address result:', error)
              resolve(null)
            }
          } else {
            console.error('Geocoder failed with status:', status)
            resolve(null)
          }
        })
      } catch (error) {
        console.error('Failed to search address:', error)
        resolve(null)
      }
    })
  }, [isKakaoLoaded, isInitialized])

  return (
    <MapContext.Provider value={{ 
      map, 
      setMap, 
      marker, 
      setMarker, 
      searchAddress,
      isKakaoLoaded,
      isInitialized
    }}>
      {children}
    </MapContext.Provider>
  )
}

export function useMap() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error("useMap must be used within a MapProvider")
  }
  return context
} 