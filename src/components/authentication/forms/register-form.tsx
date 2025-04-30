"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { RegisterDTO } from "@/models/dto"
import { useRouter } from "next/navigation"

interface RegisterFormProps {
  onRegister: (data: RegisterDTO) => void
  token: string;
}

export default function RegisterForm({ onRegister, token}: RegisterFormProps) {
  const router = useRouter();
  const form = useForm<RegisterDTO>({
    resolver: zodResolver(RegisterDTO),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone_number: "",
      token: token
    }
  })

  function onSubmit(data: RegisterDTO) {
    try {
      onRegister(data)
      router.replace("/auth/login")
    } catch {
      
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Isi data diri untuk menyelesaikan pendaftaran.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>No. Handphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nomor handphone anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Masukkan email anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Masukkan password anda" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Daftar
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Sudah Memiliki Akun?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Masuk Disini
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}