"use client"

import { cn } from "@/utils/shadUtils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { LoginDTO } from "@/models/dto"
import { useRouter, useSearchParams } from "next/navigation"
 
interface LoginFormProps {
    onLogin: (dto: LoginDTO) => Promise<void>;
}

export function LoginForm({
    onLogin,
}: LoginFormProps) {
    const router = useRouter();
    const params = useSearchParams();
    const form = useForm<LoginDTO>({
        resolver: zodResolver(LoginDTO),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    const onSubmit = async (data: LoginDTO) => {
        try {
            await onLogin(data);
            form.reset();
        } catch {
            console.log("LOGIN GAGAL")
        } finally{
            const replaceUrl = params.get('from') ?? '/'; 
            router.replace(replaceUrl);
            console.log("LOGIN BERHASIL")
        }
    }
    return (
        <div className={cn("flex flex-col gap-6")}>
        <Card>
            <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
                Silahkan masukkan email dan password Anda untuk login.
            </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <FormField 
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Masukkan Email Anda" {...field} />
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
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                <Link href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                                                    Lupa Password?
                                                </Link>      
                                            </div>
                                            <FormControl>
                                                <Input type="password" placeholder="Masukkan Password Anda" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Tidak Punya Akun?{" "}
                            <Link href="/auth/register" className="underline underline-offset-4">
                                Daftar Disini
                            </Link>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
        </div>
    )
}
