import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
};

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  primary:
    "bg-gradient-to-br from-[#ff4da6] to-[#7b3fe4] text-white hover:opacity-90 focus:ring-purple-400",
  secondary:
    "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 focus:ring-purple-400",
  ghost: "text-gray-600 hover:bg-gray-100 focus:ring-purple-400",
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
