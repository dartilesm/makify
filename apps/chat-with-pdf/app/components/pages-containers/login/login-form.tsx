"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(6, { message: "Password is too short" }),
});

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const supabase = createClient();
    if (!isPending) {
      startTransition(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          router.push(redirectTo);
        }
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className=" test-sm  font-semibold">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  className="h-8"
                  placeholder="example@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold">Password</FormLabel>
              <FormControl>
                <div className=" relative">
                  <Input
                    className="h-8"
                    type={passwordReveal ? "text" : "password"}
                    {...field}
                  />
                  <div
                    className="group absolute right-2 top-[30%] cursor-pointer"
                    onClick={() => setPasswordReveal(!passwordReveal)}
                  >
                    {passwordReveal ? (
                      <FaRegEye className=" transition-all group-hover:scale-105" />
                    ) : (
                      <FaRegEyeSlash className=" transition-all group-hover:scale-105" />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="flex h-8 w-full items-center gap-2 bg-indigo-500 text-white transition-all hover:bg-indigo-600"
        >
          <AiOutlineLoading3Quarters
            className={cn(!isPending ? "hidden" : "block animate-spin")}
          />
          Continue
        </Button>
      </form>
      <div className="text-center text-sm">
        <h1>
          Doest not have account yet?{" "}
          <Link
            href={redirectTo ? `/register?next=` + redirectTo : "/register"}
            className="text-blue-400"
          >
            Register
          </Link>
        </h1>
      </div>
    </Form>
  );
}
