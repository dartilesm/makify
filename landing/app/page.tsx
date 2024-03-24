import WebVitals from "@/components/home/web-vitals";
import { Twitter } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DEPLOY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-center justify-center relative border-b border-gray-100">
      <div className="absolute inset-0 z[5] h-[calc(100%+8rem)] w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] -top-32"></div>
      <div className="absolute -top-32 z-[6] w-screen bg-transparent bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)] h-[calc(100%+8rem)]"></div>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 ">
        <a
          href="https://twitter.com/steventey/status/1613928948915920896"
          target="_blank"
          rel="noreferrer"
          className="mx-auto mb-5 flex max-w-fit animate-in fade-in slide-in-from-bottom-10 duration-1000 items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing Makify
          </p>
        </a>
        <h1
          className="animate-in fade-in slide-in-from-bottom-10 delay-150 duration-1000 bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationFillMode: "forwards" }}
        >
          Tools that make your life easier
        </h1>
        <p
          className="mt-6 animate-in fade-in slide-in-from-bottom-10 delay-250 duration-1000 text-center text-gray-500 [text-wrap:balance] md:text-xl"
          style={{ animationFillMode: "forwards" }}
        >
          A collection of tools that make your life easier than ever.
        </p>
        <div
          className="mx-auto mt-6 flex animate-in fade-in slide-in-from-bottom-10 delay-300 duration-1000 fill-mode-forwards items-center justify-center space-x-5"
        >
          <Button>
            <span>🚀</span>
            <p>Start for Free</p>
          </Button>
        </div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            className={cn('z-10 h-96 col-span-1 flex flex-col', { 'md:col-span-2': large })}
          >
            <CardContent className="flex justify-center items-center p-6 h-60">
              {demo}
            </CardContent>
            <CardFooter className="flex flex-col gap-4 mx-auto max-w-md text-center">
              <CardTitle className="bg-gradient-to-br from-black to-stone-500 bg-clip-text font-display text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">{title}</CardTitle>
              <CardContent>{description}</CardContent>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    title: "Chat with your PDFs",
    description:
      "Experience the power of AI by chatting with your PDF documents.",
    large: true,
  },
  {
    title: "Share your media files easily",
    description:
      "Want to share a media file with someone? Just upload it and share the link.",
    demo: <WebVitals />,
  },
  {
    title: "Turn it into a QR code",
    description:
      "Create and personalize your own QR code for your links, texts or files.",
    demo: (
      <a href={DEPLOY_URL}>
        <Image
          src="https://vercel.com/button"
          alt="Deploy with Vercel"
          width={120}
          height={30}
          unoptimized
        />
      </a>
    ),
  },
];
