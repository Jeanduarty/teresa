import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'

import { cn } from './utils'

const Tabs = TabsPrimitive.Root

const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex rounded-full border border-black/10 bg-white p-1 shadow-sm', className)}
      {...props}
    />
  )
})

const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex h-11 w-16 items-center justify-center rounded-full text-[#777] outline-none transition-colors hover:text-[#181818] focus-visible:ring-2 focus-visible:ring-[#181818]/20',
        'data-[state=active]:bg-[#181818] data-[state=active]:text-white',
        className,
      )}
      {...props}
    />
  )
})

const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('outline-none focus-visible:ring-2 focus-visible:ring-[#181818]/20', className)}
      {...props}
    />
  )
})

export { Tabs, TabsContent, TabsList, TabsTrigger }
