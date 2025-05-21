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
    onLogin: (dto: LoginDTO) => Promise<boolean>;
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
            const isSuccess = await onLogin(data);
            if (isSuccess) {
                const replaceUrl = params.get('from') ?? '/'; 
                router.replace(replaceUrl);
            }
            form.setError("root", {message: "The email or password you entered is incorrect!"})
            form.reset();
        } catch {
        } finally {
        }
    }
    
    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Please enter your email and password to login.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <FormField 
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter Your Email" {...field} />
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
                                                        Forgot Password?
                                                    </Link>      
                                                </div>
                                                <FormControl>
                                                    <Input type="password" placeholder="Enter Your Password" {...field} />
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
                                Don&apos;t Have an Account?{" "}
                                <Link href="/auth/register" className="underline underline-offset-4">
                                    Register Here
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
