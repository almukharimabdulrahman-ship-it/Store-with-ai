import { brandScript } from "@/lib/fonts";

type StoreWordmarkProps = {
  name: string;
  className?: string;
};

export function StoreWordmark({ name, className = "" }: StoreWordmarkProps) {
  return (
    <span
      className={`${brandScript.className} inline-block font-normal tracking-normal ${className}`}
      dir="ltr"
      lang="fr"
    >
      {name}
    </span>
  );
}
