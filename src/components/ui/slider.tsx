"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, min = 0, max = 100, step = 1, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    min={min}
    max={max}
    step={step}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-purple-200">
      <SliderPrimitive.Range className="absolute h-full bg-purple-500" />
      {/* Display marks for each step */}
      {Array.from({ length: (max - min) / step + 1 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-full w-0.5 bg-purple-100"
          style={{
            left: `${(i * step) / (max - min) * 100}%`,
            transform: "translateX(-50%)"
          }}
        />
      ))}
    </SliderPrimitive.Track>
    {props.defaultValue?.map((_: number, i: number) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-6 w-6 rounded-full border-none bg-purple-600 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider } 