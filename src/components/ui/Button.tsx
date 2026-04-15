import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary: "bg-black text-white hover:bg-zinc-800 focus:ring-black",
  secondary:
    "border border-gray-300 text-gray-700 hover:border-gray-500 hover:text-black focus:ring-black",
  ghost: "text-gray-600 hover:bg-gray-100 focus:ring-black",
};

const sizes = {
  sm: "px-3 py-1.5",
  md: "px-4 py-2",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
