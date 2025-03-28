"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  textClassName?: string;
}

export function Logo({
  showText = true,
  size = "md",
  className,
  textClassName,
}: LogoProps) {
  const sizeMap = {
    sm: { logo: 24, text: "text-lg font-bold" },
    md: { logo: 32, text: "text-xl font-bold" },
    lg: { logo: 48, text: "text-2xl font-bold" },
    xl: { logo: 64, text: "text-3xl font-bold" },
  };

  const { logo, text } = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Image
          src="/logo.png"
          alt="ATENA Logo"
          width={logo}
          height={logo}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span className={cn(text, "tracking-wider text-foreground", textClassName)}>
          ATENA
        </span>
      )}
    </div>
  );
} 