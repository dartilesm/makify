"use client";

import { login } from "@/app/actions/login";
import { signInWithOAuth } from "@/app/actions/sign-in-with-oauth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@makify/ui";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SiGithub } from "react-icons/si";
import { useSearchParams } from "next/navigation";

const LoginSchema = z.object({
  email: z
    .string({
      message: "This field is required",
    })
    .email({
      message: "Invalid email",
    }),
  password: z
    .string({
      message: "This field is required",
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

export function LoginContainer() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const searchParams = useSearchParams();

  const { toast } = useToast();

  async function handleLogin(values: z.infer<typeof LoginSchema>) {
    try {
      await login(values);
      toast({
        title: "Login successful",
        description: "You have been logged in",
        duration: 3000,
      });
    } catch (error: unknown) {
      toast({
        title: "Oops! Something went wrong",
        description: (error as Error)?.message || String(error),
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  async function handleGithubLogin() {
    signInWithOAuth("github", searchParams);
  }

  return (
    <Card className="mx-auto w-96 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(handleLogin)}
            >
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="m@example.com"
                        />
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
                        {/* <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline"
                        >
                          Forgot your password?
                        </Link> */}
                      </div>
                      <FormControl>
                        <Input {...field} id="password" type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="flex w-full gap-2"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </form>
          </Form>
          <Button
            variant="outline"
            className="flex w-full gap-2"
            onClick={handleGithubLogin}
          >
            <SiGithub className="h-4 w-4" />
            Login with Github
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
