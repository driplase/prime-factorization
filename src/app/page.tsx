import Tool from "@/components/tool";
import { Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full">
        <Tool />
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://j0.si"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={16} />
          Go to j0.si →
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://lase.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={16} />
          Go to lase.dev →
        </a>
      </footer>
    </div>
  );
}
