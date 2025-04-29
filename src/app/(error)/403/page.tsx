import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <ShieldAlert className="h-10 w-10 text-danger" />
          </div>
          <CardTitle className="text-3xl font-bold text-danger">403</CardTitle>
          <CardDescription className="text-xl font-semibold text-foreground">Akses Ditolak</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-600">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <p className="text-sm text-gray-500">
            Silakan hubungi administrator jika Anda yakin seharusnya memiliki akses.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="javascript:history.back()">Kembali</Link>
          </Button>
          <Button asChild>
            <Link href="/">Halaman Utama</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
