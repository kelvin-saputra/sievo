"use client"

import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BreadcrumbApp() {
  const paths = usePathname()
  const formatPathName = (path: string) => {
    if (path.match(/^\d+$/)) return `#${path}`

    return path
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Memoize the breadcrumb items to prevent unnecessary recalculations
  const breadcrumbItems = useMemo(() => {
    const pathNames = paths.split("/").filter((path) => path)

    if (pathNames.length === 0) {
      return [
        <BreadcrumbItem key="home">
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
          <BreadcrumbPage className="text-sidebar-primary">Home</BreadcrumbPage>
        </BreadcrumbItem>,
      ]
    }

    return pathNames.map((path, index) => {
      const href = `/${pathNames.slice(0, index + 1).join("/")}`
      const isLast = index === pathNames.length - 1
      const formattedPath = formatPathName(path)

      return (
        <BreadcrumbItem key={path}>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            {isLast ? (
                <BreadcrumbPage className="text-sidebar-primary font-medium">{formattedPath}</BreadcrumbPage>
            ) : (
                <BreadcrumbLink href={href} className="text-muted-foreground hover:text-sidebar-primary transition-colors">
                {formattedPath}
                </BreadcrumbLink>
            )}
        </BreadcrumbItem>
      )
    })
  }, [paths])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="text-muted-foreground hover:text-sidebar-primary transition-colors">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

