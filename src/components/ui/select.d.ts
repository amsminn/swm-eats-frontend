import * as React from "react"

declare module "@/components/ui/select" {
  export const Select: React.FC<React.ComponentProps<"div">>
  export const SelectGroup: React.FC<React.ComponentProps<"div">>
  export const SelectValue: React.FC<React.ComponentProps<"div">>
  export const SelectTrigger: React.ForwardRefExoticComponent<React.ComponentProps<"button"> & React.RefAttributes<HTMLButtonElement>>
  export const SelectContent: React.ForwardRefExoticComponent<React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>>
  export const SelectLabel: React.ForwardRefExoticComponent<React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>>
  export const SelectItem: React.ForwardRefExoticComponent<React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>>
  export const SelectSeparator: React.ForwardRefExoticComponent<React.ComponentProps<"div"> & React.RefAttributes<HTMLDivElement>>
} 