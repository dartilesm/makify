import Card from "@/components/home/card";
import WebVitals from "@/components/home/web-vitals";
import { Twitter } from "@/components/shared/icons";
import { DEPLOY_URL } from "@/lib/constants";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0">
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
          <a
            className="group flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>🚀</span>
            <p>Start for Free</p>
          </a>
        </div>
      </div>
      <div className="my-10 grid w-full max-w-screen-xl animate-fade-up grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        {features.map(({ title, description, demo, large }) => (
          <Card
            key={title}
            title={title}
            description={description}
            demo={demo}
            large={large}
          />
        ))}
      </div>
    </>
  );
}

const features = [
  {
    title: "Chat with your PDFs",
    description:
      "Experience the power of AI by chatting with your PDF documents. Don't waste time scrolling through pages, just ask Makify.",
    large: true,
  },
  {
    title: "Share your media files easily",
    description:
      "Want to share a media file with someone? Just upload it and share the link. No account needed.",
    demo: <WebVitals />,
  },
  {
    title: "Turn it into a QR code",
    description:
      "Create and personalize your own QR code for your links, texts or files. Share it with anyone, anywhere.",
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
