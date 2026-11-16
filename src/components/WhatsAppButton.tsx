"use client";

import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat en WhatsApp"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
    >
      <MessageCircle size={28} />
    </a>
  );
}
