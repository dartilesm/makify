import WebVitals from "@/components/home/web-vitals";
import { Twitter } from "@/components/shared/icons";
import { DEPLOY_URL } from "@/lib/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button, Card, CardContent, CardFooter, CardTitle } from "@makify/ui";

export default function Home() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center border-b border-gray-100">
      <div className="z[5] absolute inset-0 -top-32 h-[calc(100%+8rem)] w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute -top-32 z-[6] h-[calc(100%+8rem)] w-screen bg-transparent bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]"></div>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 ">
        <a
          href="https://twitter.com/steventey/status/1613928948915920896"
          target="_blank"
          rel="noreferrer"
          className="animate-in fade-in slide-in-from-bottom-10 mx-auto mb-5 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full bg-blue-100 px-7 py-2 transition-colors duration-1000 hover:bg-blue-200"
        >
          <Twitter className="h-5 w-5 text-[#1d9bf0]" />
          <p className="text-sm font-semibold text-[#1d9bf0]">
            Introducing Makify
          </p>
        </a>
        <h1
          className="animate-in fade-in slide-in-from-bottom-10 font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm delay-150 duration-1000 [text-wrap:balance] md:text-7xl md:leading-[5rem]"
          style={{ animationFillMode: "forwards" }}
        >
          Tools that make your life easier
        </h1>
        <p
          className="animate-in fade-in slide-in-from-bottom-10 delay-250 mt-6 text-center text-gray-500 duration-1000 [text-wrap:balance] md:text-xl"
          style={{ animationFillMode: "forwards" }}
        >
          A collection of tools that make your life easier than ever.
        </p>
        <div className="animate-in fade-in slide-in-from-bottom-10 fill-mode-forwards mx-auto mt-6 flex items-center justify-center space-x-5 delay-300 duration-1000">
          <Button>
            <span>🚀</span>
            <p>Start for Free</p>
          </Button>
        </div>
      </div>
      <div className="animate-fade-up my-10 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            className={cn("z-10 col-span-1 flex h-96 flex-col", {
              "md:col-span-2": large,
            })}
          >
            <CardContent className="flex h-60 items-center justify-center p-6">
              {demo}
            </CardContent>
            <CardFooter className="mx-auto flex max-w-md flex-col gap-4 text-center">
              <CardTitle className="font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-xl font-bold text-transparent [text-wrap:balance] md:text-3xl md:font-normal">
                {title}
              </CardTitle>
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
