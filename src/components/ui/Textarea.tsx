import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

const base =
  "w-full px-3 py-2 text-sm border rounded-md shadow-sm transition placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none";

export default function Textarea({ className = "", error, ...props }: Props) {
  return (
    <div className="space-y-1">
      <textarea
        className={`${base} ${error ? "border-red-500 focus:ring-red-500" : "border-input"} ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
