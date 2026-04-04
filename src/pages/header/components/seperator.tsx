import { cn } from "@/lib/utils";

const Separator = ({ isMini }: { isMini: boolean }) => (
  <li aria-hidden="true" className="mx-1 flex items-center">
    <div
      className={cn("w-px bg-primary/40", { "h-8": !isMini, "h-6": isMini })}
    />
  </li>
);
export default Separator;
