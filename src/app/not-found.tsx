import React from "react"
import Link from "next/link"
import { FileQuestion } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <FileQuestion className="h-10 w-10 text-danger" />
          </div>
          <CardTitle className="text-3xl font-bold text-danger">404</CardTitle>
          <CardDescription className="text-xl font-semibold text-gray-700">Halaman Tidak Ditemukan</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4 text-gray-600">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
          <p className="text-sm text-gray-500">
            Halaman mungkin telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
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
