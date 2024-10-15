import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Props {
  link: string;
  children: React.ReactNode;
  variant: string;
}

export const ButtonCustom: React.FC<Partial<Props>> = ({
  link,
  children,
  variant,
}) => {
  return (
    <Link href={`${link}`}>
      <div>
        <Button
          className={`${
            variant === "btn-success"
              ? "bg-emerald-600 hover:bg-emerald-500 text-white"
              : variant === "btn-primary"
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : ""
          }`}
        >
          {children}
        </Button>
      </div>
    </Link>
  );
};
