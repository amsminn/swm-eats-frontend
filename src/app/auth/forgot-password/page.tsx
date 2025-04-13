"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." })
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      // In a real application, you would call your API to send a password reset email
      // Mock submission for demonstration
      console.log("Sending password reset email to:", data.email)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsSubmitted(true)
    } catch (error) {
      setError("비밀번호 재설정 요청 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <span className="text-2xl font-bold text-indigo-600">SWM Eats</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          비밀번호 찾기
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          가입 시 등록한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="space-y-6">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">이메일이 전송되었습니다</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Link href="/auth/signin">
                  <Button
                    className="w-full"
                  >
                    로그인 페이지로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading}
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "처리 중..." : "비밀번호 재설정 링크 보내기"}
                  </Button>
                </div>
                
                <div className="text-center">
                  <Link href="/auth/signin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    로그인 페이지로 돌아가기
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 