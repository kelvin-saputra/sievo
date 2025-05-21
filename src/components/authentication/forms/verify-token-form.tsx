"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const tokenSchema = z.object({
  token: z.string().min(1, { message: "Registration token is required" }),
});

type TokenFormValues = z.infer<typeof tokenSchema>;

interface TokenVerificationFormProps {
  onTokenVerified: (token: string) => void;
  onCheckToken: (token: string) => Promise<boolean>;
}

export default function TokenVerificationForm({
  onTokenVerified,
  onCheckToken,
}: TokenVerificationFormProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: "",
    },
  });

  async function onSubmit(values: TokenFormValues) {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const isValid = await onCheckToken(values.token);

      if (isValid) {
        onTokenVerified(values.token);
      } else {
        setVerificationError("Invalid or expired registration token");
      }
    } catch {
      setVerificationError("An error occurred while verifying the token");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Token Verification</CardTitle>
        <CardDescription>
          Enter your registration token to continue the registration process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Token</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your registration token"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {verificationError && (
              <div className="text-sm font-medium text-destructive">
                {verificationError}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? "Verifying..." : "Verify Token"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login Here
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
