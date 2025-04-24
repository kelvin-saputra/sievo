// "use client"

// import { cn } from "@/utils/shadUtils"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import Link from "next/link"
// import { RegisterDTO } from "@/models/dto"
// import { RoleEnum } from "@/models/enums"
 
// const formSchema = z.object({
//     email: z.string().email({ message: "Alamat email tidak valid" }),
//     password: z.string().min(8, { message: "Password minimal 8 karakter" }),
// })
// interface RegisterFormProps{
//     onRegister: (data: RegisterDTO) => void;
//     selectedRole: RoleEnum
// }


// export default function RegisterForm({
//   onRegister,
//   selectedRole
// }: RegisterFormProps) {
//     const form = useForm<RegisterDTO>({
//         resolver: zodResolver(RegisterDTO),
//         defaultValues: {
//             name: "",
//             email: "",
//             password: "",
//             phone_number: "",
//             role: selectedRole
//         },
//     })

//     function onSubmit(values: z.infer<typeof formSchema>) {
//         console.log(values)
//     }
//     return (
//         <div className={cn("flex flex-col gap-6", className)} {...props}>
//         <Card>
//             <CardHeader>
//             <CardTitle className="text-2xl">Register</CardTitle>
//             <CardDescription>
//                 Isi data diri untuk menyelesaikan pendaftaran.
//             </CardDescription>
//             </CardHeader>
//             <CardContent>
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} >
//                         <div className="flex flex-col gap-6">
//                             <div className="grid gap-2">
//                                 <FormField 
//                                     control={form.control}
//                                     name="email"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Nama Lengkap</FormLabel>
//                                             <FormControl>
//                                                 <Input type="email" placeholder="Masukkan nama lengkap anda" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             <div className="grid gap-2">
//                                 <FormField 
//                                     control={form.control}
//                                     name="email"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>No. Handphone</FormLabel>
//                                             <FormControl>
//                                                 <Input type="email" placeholder="Masukkan nomor handphone anda" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             <div className="grid gap-2">
//                                 <FormField 
//                                     control={form.control}
//                                     name="email"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Email</FormLabel>
//                                             <FormControl>
//                                                 <Input type="email" placeholder="Masukkan email anda" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             <div className="grid gap-2">
//                                 <FormField 
//                                     control={form.control}
//                                     name="email"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormLabel>Password</FormLabel>
//                                             <FormControl>
//                                                 <Input type="email" placeholder="Masukkan password anda" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>
//                             <Button type="submit" className="w-full">
//                                 Daftar
//                             </Button>
//                         </div>
//                         <div className="mt-4 text-center text-sm">
//                             Sudah Memiliki Akun?{" "}
//                             <Link href="#" className="underline underline-offset-4">
//                                 Masuk Disini
//                             </Link>
//                         </div>
//                     </form>
//                 </Form>
//             </CardContent>
//         </Card>
//         </div>
//     )
// }
