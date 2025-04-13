"use client"

import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

type State = {
  toasts: ToasterToast[]
}

const toastState = {
  toasts: [] as ToasterToast[],
  listeners: new Set<(state: State) => void>(),
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

function addToast(toast: ToasterToast) {
  toastState.toasts = [toast, ...toastState.toasts].slice(0, TOAST_LIMIT)
  emitChange()
}

function dismissToast(toastId?: string) {
  toastState.toasts = toastState.toasts.map((t) =>
    t.id === toastId || toastId === undefined
      ? {
          ...t,
          open: false,
        }
      : t
  )
  emitChange()

  setTimeout(() => {
    toastState.toasts = toastState.toasts.filter((t) => t.id !== toastId)
    emitChange()
  }, TOAST_REMOVE_DELAY)
}

function updateToast(toastId: string, data: Partial<ToasterToast>) {
  toastState.toasts = toastState.toasts.map((t) =>
    t.id === toastId ? { ...t, ...data } : t
  )
  emitChange()
}

function emitChange() {
  toastState.listeners.forEach((listener) => {
    listener({ toasts: toastState.toasts })
  })
}

export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()
  const newToast: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismissToast(id)
    },
  }

  addToast(newToast)

  return {
    id,
    dismiss: () => dismissToast(id),
    update: (data: Partial<ToasterToast>) => updateToast(id, data),
  }
}

export function useToast() {
  const [state, setState] = React.useState<State>({ toasts: toastState.toasts })

  React.useEffect(() => {
    toastState.listeners.add(setState)
    return () => {
      toastState.listeners.delete(setState)
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: dismissToast,
  }
} 