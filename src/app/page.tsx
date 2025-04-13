import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/restaurant-banner.jpg"
            alt="다양한 음식 이미지"
            fill
            sizes="100vw"
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">SWM Eats - 소마 맛집 공유 서비스</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl">소프트웨어 마에스트로 구성원들을 위한 맛집 공유 플랫폼</p>
          <Link href="/restaurants" className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-6 py-3 rounded-lg transition-colors">
            맛집 탐색하기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureCard 
              title="맛집 탐색" 
              description="지도 기반으로 소마 주변 맛집을 탐색해보세요."
              href="/restaurants"
              iconSrc="/images/food-category1.jpg"
            />
            <FeatureCard 
              title="리뷰 작성" 
              description="방문한 맛집에 대한 솔직한 리뷰를 남겨보세요."
              href="/reviews"
              iconSrc="/images/food-category2.jpg"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-indigo-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">이용 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                  <span className="text-indigo-600 text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-12">
            <Link href="/reviews" className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold px-6 py-3 rounded-lg transition-colors">
              모든 리뷰 보기
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">지금 바로 시작하세요</h2>
          <p className="text-xl mb-8 opacity-90">소마인들이 엄선한 맛집을 발견하고 공유하세요.</p>
          <Link href="/auth/signin" className="inline-block bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
            가입하기
          </Link>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ 
  title, 
  description, 
  href,
  iconSrc
}: { 
  title: string
  description: string
  href: string
  iconSrc: string
}) {
  return (
    <Link 
      href={href}
      className="group flex flex-col bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="h-48 relative">
        <Image 
          src={iconSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100%, (max-width: 1200px) 50%, 33%"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </Link>
  )
}

const steps = [
  {
    title: "가입하기",
    description: "소마 이메일로 간편하게 가입하세요."
  },
  {
    title: "맛집 탐색하기",
    description: "지도에서 소마 주변 맛집을 찾아보세요."
  },
  {
    title: "리뷰 확인하기",
    description: "다른 소마인들의 솔직한 리뷰를 확인하세요."
  }
] 