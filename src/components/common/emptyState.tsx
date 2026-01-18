"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/src/lib/util";
import Button from "./button";

type Props = {
  image: string;
  message: string;
  subMessage?: string;

  buttonText?: string;
  buttonAction?: () => void;

  className?: string;
  imageClassName?: string;
};

export default function EmptyState({
  image,
  message,
  buttonAction,
  className = "",
  imageClassName = "",
}: Props) {
  return (
    <div
      className={cn(
        "w-full  flex flex-col items-center justify-center gap-4 text-center",
        className,
      )}
    >
      <Image
        src={image}
        alt="Empty state"
        width={500}
        height={500}
        className={cn("object-contain mt-10 md:mt-16", imageClassName)}
      />

   
      {buttonAction ? (
        <Button onClick={buttonAction} className="button-gradient px-6 w-full max-w-[550px] text-lg">
          {message}
        </Button>
      ) :   
        <p className="text-lg mt-5 font-medium text-black/80">{message}</p>

}
    </div>
  );
}
