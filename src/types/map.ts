export interface Address {
  address_name: string
  region_1depth_name: string
  region_2depth_name: string
  region_3depth_name: string
  road_address_name: string
  x: string
  y: string
}

export interface MapContextType {
  map: kakao.maps.Map | null
  setMap: (map: kakao.maps.Map) => void
  marker: kakao.maps.Marker | null
  setMarker: (marker: kakao.maps.Marker) => void
  searchAddress: (address: string) => Promise<Address | null>
  isKakaoLoaded: boolean
  isInitialized: boolean
} 