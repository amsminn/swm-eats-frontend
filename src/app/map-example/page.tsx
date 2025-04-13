"use client"

import { useState } from "react"
import MapContainer from "@/components/MapContainer"
import AddressSearch from "@/components/AddressSearch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function MapExamplePage() {
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }) // 서울 시청
  const [markers, setMarkers] = useState([
    {
      position: { lat: 37.5665, lng: 126.9780 },
      content: "<div style='padding:5px;'>서울특별시청</div>"
    }
  ])
  const [newLat, setNewLat] = useState("")
  const [newLng, setNewLng] = useState("")
  const [markerName, setMarkerName] = useState("")
  const [searchedAddress, setSearchedAddress] = useState<string | null>(null)

  const handleAddMarker = () => {
    const lat = parseFloat(newLat)
    const lng = parseFloat(newLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert("유효한 좌표를 입력해주세요.")
      return
    }

    const newMarker = {
      position: { lat, lng },
      content: `<div style='padding:5px;'>${markerName || "새 마커"}</div>`
    }

    setMarkers([...markers, newMarker])
    setNewLat("")
    setNewLng("")
    setMarkerName("")
  }

  const handleMoveToLocation = () => {
    const lat = parseFloat(newLat)
    const lng = parseFloat(newLng)

    if (isNaN(lat) || isNaN(lng)) {
      alert("유효한 좌표를 입력해주세요.")
      return
    }

    setCenter({ lat, lng })
  }

  const handleSelectAddress = (result: { address: string; latitude: number; longitude: number }) => {
    setSearchedAddress(result.address)
    setCenter({ lat: result.latitude, lng: result.longitude })
    
    // 새 마커 추가
    const newMarker = {
      position: { lat: result.latitude, lng: result.longitude },
      content: `<div style='padding:5px;'>${result.address}</div>`
    }
    
    setMarkers([...markers, newMarker])
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">카카오맵 예제</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AddressSearch onSelectAddress={handleSelectAddress} />
          
          <MapContainer 
            center={center}
            markers={markers}
            height="500px"
          />
          
          {searchedAddress && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm">
                <span className="font-medium">검색된 주소:</span> {searchedAddress}
              </p>
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">지도 제어</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="lat">위도</Label>
              <Input
                id="lat"
                type="text"
                placeholder="위도 (예: 37.5665)"
                value={newLat}
                onChange={(e) => setNewLat(e.target.value)}
                className="mb-2"
              />
              
              <Label htmlFor="lng">경도</Label>
              <Input
                id="lng"
                type="text"
                placeholder="경도 (예: 126.9780)"
                value={newLng}
                onChange={(e) => setNewLng(e.target.value)}
                className="mb-2"
              />
              
              <Label htmlFor="name">마커 이름 (선택)</Label>
              <Input
                id="name"
                type="text"
                placeholder="마커 이름"
                value={markerName}
                onChange={(e) => setMarkerName(e.target.value)}
                className="mb-4"
              />
              
              <div className="flex space-x-2">
                <Button onClick={handleMoveToLocation}>
                  위치로 이동
                </Button>
                <Button onClick={handleAddMarker} variant="outline">
                  마커 추가
                </Button>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">현재 마커 ({markers.length}개)</h3>
              <div className="bg-gray-50 p-3 rounded max-h-60 overflow-y-auto">
                {markers.map((marker, index) => (
                  <div key={index} className="text-sm mb-2 pb-2 border-b border-gray-200 last:border-0">
                    <div className="font-medium">{index + 1}. {marker.content.split('>')[1].split('<')[0]}</div>
                    <div className="text-gray-600">
                      위도: {marker.position.lat.toFixed(4)}, 경도: {marker.position.lng.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">사용 방법</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>주소 검색 창에 주소를 입력하고 검색하면 해당 위치로 지도가 이동하고 마커가 추가됩니다.</li>
          <li>위도와 경도를 입력한 후 '위치로 이동' 버튼을 클릭하면 해당 위치로 지도가 이동합니다.</li>
          <li>위도, 경도, 마커 이름을 입력한 후 '마커 추가' 버튼을 클릭하면 새 마커가 추가됩니다.</li>
          <li>마커를 클릭하면 정보창이 표시됩니다.</li>
        </ul>
      </div>
    </div>
  )
} 