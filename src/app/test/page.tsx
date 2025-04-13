"use client"

import { MapTest } from "@/components/MapTest"
import MapContainer from "@/components/MapContainer"

export default function TestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Kakao Maps API 테스트</h1>
      
      <div className="space-y-8">
        {/* API 상태 테스트 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API 상태 확인</h2>
          <MapTest />
        </div>

        {/* 지도 렌더링 테스트 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">지도 렌더링 테스트</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 기본 지도 */}
              <div>
                <h3 className="font-medium mb-2">기본 지도</h3>
                <MapContainer 
                  center={{ lat: 37.5665, lng: 126.9780 }}
                  height="300px"
                />
              </div>

              {/* 마커가 있는 지도 */}
              <div>
                <h3 className="font-medium mb-2">마커 테스트</h3>
                <MapContainer 
                  center={{ lat: 37.5665, lng: 126.9780 }}
                  markers={[
                    {
                      position: { lat: 37.5665, lng: 126.9780 },
                      content: "<div style='padding:5px;'>서울 시청</div>"
                    },
                    {
                      position: { lat: 37.566826, lng: 126.978656 },
                      content: "<div style='padding:5px;'>덕수궁</div>"
                    }
                  ]}
                  height="300px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 