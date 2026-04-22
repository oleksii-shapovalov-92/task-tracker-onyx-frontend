import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const AVATARS = [
  "/avatars/user1.jpg",
  "/avatars/user2.jpg",
  "/avatars/user3.jpg",
  "/avatars/user4.jpg",
  "/avatars/user5.jpg",
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative space-y-6 rounded-2xl p-6 sm:p-8"
          style={{
            background:
              "radial-gradient(ellipse at top left, rgba(255,77,166,0.06) 0%, rgba(123,63,228,0.05) 50%, transparent 80%)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)" }}
              aria-hidden
            />
            ONYX Task Tracker
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Keep projects moving. Track tasks with clarity.
          </h1>
          <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            ONYX helps teams plan, prioritize, and deliver work without clutter.
            Create projects, manage tasks, and stay aligned with a simple workflow
            that scales with you.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/projects" className="inline-flex">
              <Button className="w-full sm:w-auto">Create project</Button>
            </Link>
            <Link to="/about" className="inline-flex">
              <Button variant="secondary" className="w-full sm:w-auto">
                About us
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {AVATARS.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-9 w-9 rounded-full border-2 border-white object-cover object-top ring-1 ring-white"
                  aria-hidden
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">300+</span> teams already use ONYX
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-4 pt-2 sm:grid-cols-3">
            {[
              { label: "Projects", text: "One place for planning" },
              { label: "Tasks", text: "Clear priorities and status" },
              { label: "Focus", text: "Less noise, more progress" },
            ].map((card) => (
              <div
                key={card.label}
                className="cursor-default rounded-xl border border-gray-200 bg-white/80 p-4 shadow-sm"
              >
                <div
                  className="mb-2 h-0.5 w-8 rounded-full"
                  style={{ background: "linear-gradient(90deg, #ff4da6, #7b3fe4)" }}
                  aria-hidden
                />
                <p className="text-sm font-medium text-gray-900">{card.label}</p>
                <p className="mt-1 text-sm text-gray-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-6 rounded-3xl opacity-30 blur-2xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,77,166,0.35), rgba(123,63,228,0.18), transparent 70%)",
            }}
            aria-hidden
          />
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div
              className="h-0.5 w-full"
              style={{ background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)" }}
              aria-hidden
            />
            <div className="border-b border-gray-100 p-5">
              <p className="text-sm font-medium text-gray-900">Today&apos;s highlights</p>
              <p className="mt-1 text-sm text-gray-600">
                A quick snapshot of what matters now
              </p>
            </div>
            <div className="space-y-4 p-5">
              {[
                { title: "Release checklist", status: "In progress" },
                { title: "Design review", status: "Ready" },
                { title: "API integration", status: "Blocked" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Task • Updated just now
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,77,166,0.12) 0%, rgba(123,63,228,0.12) 100%)",
                      color: "#4b5563",
                      border: "1px solid rgba(17,24,39,0.08)",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
              <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                Start with a project, then break work into simple tasks.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
