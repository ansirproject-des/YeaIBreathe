"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButtonComment() {
  const router = useRouter();

  return (
    <button 
    onClick={() => router.back()}
    className="inline-flex items-center hover:text-text/80 h-12 px-3 rounded-xl whitespace-nowrap cursor-pointer"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}