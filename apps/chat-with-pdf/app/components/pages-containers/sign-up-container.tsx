"use client";

import { signInWithOAuth } from "@/app/actions/sign-in-with-oauth";
import { signup } from "@/app/actions/signup";
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
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});

export function SignUpContainer() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  const searchParams = useSearchParams();

  const { toast } = useToast();

  async function handleSignUp(values: z.infer<typeof LoginSchema>) {
    try {
      await signup(values);
    } catch (error: unknown) {
      toast({
        title: "Oops! Something went wrong",
        description: (error as Error)?.message || String(error),
        variant: "destructive",
        duration: 3000,
      });
    }
  }

  async function handleGithubSignIn() {
    signInWithOAuth("github", searchParams);
  }

  return (
    <Card className="mx-auto w-96 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Create an account to start</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(handleSignUp)}
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
                Sign up
              </Button>
            </form>
          </Form>
          <Button
            variant="outline"
            className="flex w-full gap-2"
            onClick={handleGithubSignIn}
          >
            <SiGithub className="h-4 w-4" />
            Sign up with Github
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
