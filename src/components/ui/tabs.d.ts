declare module "@/components/ui/tabs" {
  import * as React from "react"
  
  export const Tabs: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string }>
  
  export const TabsList: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>
  
  export const TabsTrigger: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
  >
  
  export const TabsContent: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & { value: string }
  >
} 