import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const base =
  "w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring";

export default function Input({ className = "", error, ...props }: Props) {
  return (
    <div className="space-y-1">
      <input
        className={`${base} ${error ? "border-red-500 focus:ring-red-500" : "border-input"} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
