"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { RiArrowRightSFill, RiArrowDropLeftFill } from "react-icons/ri";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { SiMinutemailer } from "react-icons/si";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FormMessage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  useToast,
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { verifyOtp } from "@/app/actions/auth";

const FormSchema = z
  .object({
    email: z.string().email({ message: "Invalid Email Address" }),
    password: z.string().min(6, { message: "Password is too short" }),
    "confirm-pass": z.string().min(6, { message: "Password is too short" }),
  })
  .refine(
    (data) => {
      if (data["confirm-pass"] !== data.password) {
        console.log("running");
        return false;
      } else {
        return true;
      }
    },
    { message: "Password does't match", path: ["confirm-pass"] },
  );

export function SignUp({ redirectTo }: { redirectTo: string }) {
  const queryString =
    typeof window !== "undefined" ? window.location.search : "";
  const urlParams = new URLSearchParams(queryString);

  const verify = urlParams.get("verify");
  const existEmail = urlParams.get("email");

  const [passwordReveal, setPasswordReveal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(verify === "true");
  const [verifyStatus, setVerifyStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [isSendAgain, startSendAgain] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      "confirm-pass": "",
    },
  });

  const { toast } = useToast();

  async function postEmail({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    };
    // Send the POST request
    const res = await fetch("/api/auth/signup", requestOptions);
    return res.json();
  }

  async function sendVerifyEmail(data: z.infer<typeof FormSchema>) {
    const json = await postEmail({
      email: data.email,
      password: data.password,
    });
    if (!json.error) {
      router.replace(
        (pathname || "/") + "?verify=true&email=" + form.getValues("email"),
      );
      setIsConfirmed(true);
    } else {
      if (json.error?.code) {
        toast({
          title: json.error.code,
          variant: "destructive",
        });
      } else if (json.error?.message) {
        toast({
          title: json.error.message,
          variant: "destructive",
        });
      }
    }
  }

  const inputOptClass = cn({
    " border-green-500": verifyStatus === "success",
    " border-red-500": verifyStatus === "failed",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!isPending) {
      startTransition(async () => {
        await sendVerifyEmail(data);
      });
    }
  }

  return (
    <div
      className={` items-center space-x-5 overflow-hidden whitespace-nowrap  p-5 align-top   ${
        isPending ? "animate-pulse" : ""
      }`}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            `inline-block w-full transform space-y-3 transition-all`,
            {
              "-translate-x-[110%]": isConfirmed,
            },
          )}
        >
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
                <FormLabel className="text-sm font-semibold">
                  Password
                </FormLabel>
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
          <FormField
            control={form.control}
            name="confirm-pass"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Confirm Password
                </FormLabel>
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
            <RiArrowRightSFill className=" size-4" />
          </Button>
          <div className="text-center text-sm">
            <h1>
              Already have account?{" "}
              <Link
                href={redirectTo ? `/login?next=` + redirectTo : "/login"}
                className="text-blue-400"
              >
                Log in
              </Link>
            </h1>
          </div>
        </form>
      </Form>
      {/* verify email */}
      <div
        className={cn(
          `inline-block h-80 w-full transform space-y-3  text-wrap align-top transition-all`,
          isConfirmed ? "-translate-x-[105%]" : "translate-x-0",
        )}
      >
        <div className="flex h-full flex-col items-center justify-center space-y-5">
          <SiMinutemailer className=" size-8" />

          <h1 className="text-center text-2xl font-semibold">Verify email</h1>
          <p className="text-center text-sm">
            {" A verification code has been sent to "}
            <span className="font-bold">
              {verify === "true" ? existEmail : form.getValues("email")}
            </span>
          </p>

          <InputOTP
            pattern={REGEXP_ONLY_DIGITS}
            id="input-otp"
            maxLength={6}
            onChange={async (value) => {
              if (value.length === 6) {
                document.getElementById("input-otp")?.blur();
                const res = await verifyOtp({
                  email: form.getValues("email"),
                  otp: value,
                  type: "email",
                });
                const { error } = JSON.parse(res);
                if (error) {
                  setVerifyStatus("failed");
                } else {
                  setVerifyStatus("success");
                  router.push(redirectTo);
                }
              }
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className={inputOptClass} />
              <InputOTPSlot index={1} className={inputOptClass} />
              <InputOTPSlot index={2} className={inputOptClass} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className={inputOptClass} />
              <InputOTPSlot index={4} className={cn(inputOptClass)} />
              <InputOTPSlot index={5} className={cn(inputOptClass)} />
            </InputOTPGroup>
          </InputOTP>
          <div className="flex gap-2 text-sm">
            <p>{"Didn't work?"} </p>
            <span
              className="flex cursor-pointer items-center gap-2 text-blue-400 transition-all hover:underline "
              onClick={async () => {
                if (!isSendAgain) {
                  startSendAgain(async () => {
                    if (!form.getValues("password")) {
                      const json = await postEmail({
                        email: form.getValues("email"),
                        password: form.getValues("password"),
                      });

                      if (json.error) {
                        toast({
                          title: "Fail to resend email",
                          variant: "destructive",
                        });
                      } else {
                        toast({
                          title: "Please check your email.",
                        });
                      }
                    } else {
                      router.replace(pathname || "/register");
                      form.setValue("email", existEmail || "");
                      form.setValue("password", "");
                      setIsConfirmed(false);
                    }
                  });
                }
              }}
            >
              <AiOutlineLoading3Quarters
                className={`${!isSendAgain ? "hidden" : "block animate-spin"}`}
              />
              Send me another code.
            </span>
          </div>
          <Button
            type="submit"
            className="flex h-8 w-full items-center gap-2 bg-indigo-500 text-white transition-all hover:bg-indigo-600"
            onClick={async () => {
              setIsConfirmed(false);
            }}
          >
            <RiArrowDropLeftFill className=" size-5" />
            Change Email
          </Button>
        </div>
      </div>
    </div>
  );
}
