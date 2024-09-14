"use client";

import {
  Button,
  Card,
  CardContent,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@makify/ui";
import { cn } from "@makify/ui/lib/utils";
import { EmblaCarouselType } from "embla-carousel";
import { motion } from "framer-motion";
import { LightbulbIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const newFeatures = [
  {
    title: "Download chat history",
    description:
      "You can now download your chat history as a PDF document for easy sharing.",
    image: "/download-example.gif",
  },
  {
    title: "Bookmark your favorite messages",
    description:
      "Bookmark your favorite messages to easily find them later. See all your bookmarks in one place in the chat header.",
    video: "/bookmark-message-example.mp4",
  },
  {
    title: "Quick actions on messages",
    description:
      "You can now quickly copy, regenerate (only the last message), bookmark messages from the toolbar below each message.",
    image: "/quick-actions-example.jpeg",
  },
  {
    title: "Page number references",
    description:
      "See where the message is based onas dasd sad as the PDF document page number*. ",
    image: "/page-references.example.jpeg",
  },
  {
    title: "Contextual queries",
    description:
      "Highlight a text in the PDF document and ask a question about it to the AI assistant.",
    video: "/contextual-queries-example.mp4",
  },
  {
    title: "Got an idea? Found an error? Share it with us!",
    description:
      "You can now provide feedback directly from the app. Click on the feedback button on the header.",
    image: "/feedback-example.jpeg",
  },
];

const carouselAnimationVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export function AppTour() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<
    EmblaCarouselType | undefined
  >();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(handleCarouselApi, [carouselApi]);

  function handleCarouselApi() {
    if (carouselApi) {
      carouselApi.on("init", handleOnSlideChange);
      carouselApi.on("reInit", handleOnSlideChange);
      carouselApi.on("select", handleOnSlideChange);
    }
  }

  function handleOnSlideChange() {
    if (carouselApi) {
      setCurrentSlideIndex(carouselApi.selectedScrollSnap());
    }
  }

  function handleToggleDialog() {
    window.localStorage.setItem("app-tour-opened", "true");
    setDialogOpen((prev) => !prev);
  }

  const appTourOpened = window.localStorage.getItem("app-tour-opened");

  return (
    <Dialog open={dialogOpen} onOpenChange={handleToggleDialog}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <div>
            <DialogTrigger asChild>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  {!appTourOpened && (
                    <span className="absolute right-0 top-0 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400"></span>
                    </span>
                  )}

                  <LightbulbIcon className="h-4 w-4" />
                  <span className="sr-only">See what's new!</span>
                </Button>
              </TooltipTrigger>
            </DialogTrigger>
            <Carousel setApi={setCarouselApi}>
              <DialogContent className="flex flex-col">
                <DialogHeader>
                  <DialogTitle>See what you can do</DialogTitle>
                </DialogHeader>
                <div className="m-auto flex max-w-full flex-col gap-2 [--slide-height:19rem] [--slide-size:90%] [--slide-spacing:1rem]">
                  <div className="w-full overflow-hidden">
                    <CarouselContent className="flex [touch-action:pan-y_pinch-zoom]">
                      {newFeatures.map((_, index) => (
                        <CarouselItem
                          key={index}
                          className="min-w-0 flex-[0_0_var(--slide-size)] pl-[var(--slide-spacing)] [transform:translate3d(0,0,0)]"
                        >
                          <div className="p-1">
                            <Card className="overflow-hidden">
                              <CardContent className="relative flex h-72 items-center justify-center p-6">
                                {newFeatures[index]!.image && (
                                  <img
                                    className="absolute h-72 w-full object-cover"
                                    src={newFeatures[index]!.image}
                                    alt={newFeatures[currentSlideIndex]!.title}
                                  />
                                )}
                                {newFeatures[index]!.video && (
                                  <video
                                    id="player_html5_api"
                                    className="absolute h-72 w-full object-cover"
                                    muted
                                    autoPlay
                                    tabIndex={-1}
                                    src={newFeatures[index]!.video}
                                  >
                                    Your browser does not support the video tag.
                                  </video>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </div>
                  <div className="overflow-hidden text-center">
                    <motion.h3
                      key={`title-${currentSlideIndex}`}
                      variants={carouselAnimationVariants}
                      className="mb-2 text-lg font-semibold"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {newFeatures[currentSlideIndex]!.title}
                    </motion.h3>
                    <motion.p
                      key={`description-${currentSlideIndex}`}
                      variants={carouselAnimationVariants}
                      className="text-muted-foreground text-sm"
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {newFeatures[currentSlideIndex]!.description}
                    </motion.p>
                  </div>
                  <motion.div className="mt-2 flex justify-center">
                    {newFeatures.map((_, index) => (
                      <motion.div
                        className={cn("mx-1 h-2 w-2 rounded-full", {
                          "bg-primary": index === currentSlideIndex,
                          "bg-muted": index !== currentSlideIndex,
                        })}
                        aria-hidden="true"
                      />
                    ))}
                  </motion.div>
                </div>
                <DialogFooter>
                  <CarouselPrevious asChild>
                    <Button variant="outline">Previous</Button>
                  </CarouselPrevious>
                  <CarouselNext asChild>
                    <Button
                      disabled={false}
                      type={
                        currentSlideIndex === newFeatures.length - 1
                          ? "submit"
                          : "button"
                      }
                      onClick={
                        currentSlideIndex === newFeatures.length - 1
                          ? handleToggleDialog
                          : undefined
                      }
                    >
                      {currentSlideIndex === newFeatures.length - 1
                        ? "Close"
                        : "Next"}
                    </Button>
                  </CarouselNext>
                </DialogFooter>
              </DialogContent>
            </Carousel>
            <TooltipContent>See what's new!</TooltipContent>
          </div>
        </Tooltip>
      </TooltipProvider>
    </Dialog>
  );
}
