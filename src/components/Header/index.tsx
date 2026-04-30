import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ThemeToggle from "../ThemeToggle";
import {
  logout,
  selectIsAuthenticated,
  selectIsAuthChecked,
} from "../../features/auth/slice/authSlice";

function OnyxLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 160"
      width={size}
      height={size}
      aria-hidden
    >
      <defs>
        <linearGradient id="hdr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4da6" />
          <stop offset="100%" stopColor="#7b3fe4" />
        </linearGradient>
      </defs>
      <g transform="translate(80 80) scale(1.32) translate(-80 -80)">
        <circle
          cx="80"
          cy="80"
          r="40"
          fill="none"
          stroke="url(#hdr-grad)"
          strokeWidth="20"
          strokeDasharray="180 80"
          strokeLinecap="round"
        />
        <path
          d="M60 82 L75 95 L100 65"
          fill="none"
          stroke="url(#hdr-grad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);

  const handleSignOut = async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  };
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70"
      style={{
        background:
          "radial-gradient(ellipse at top left, rgba(255,77,166,0.07) 0%, rgba(123,63,228,0.05) 45%, transparent 75%), rgba(255,255,255,0.92)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <OnyxLogo size={28} />
            <span className="text-lg tracking-tight text-gray-900">ONYX</span>
          </Link>

          <nav className="flex items-center gap-5">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              to="/projects"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Projects
            </Link>
            <Link
              to="/profile"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Profile
            </Link>
          </nav>
        </div>

        <div className="flex min-w-[170px] items-center justify-end gap-3">
          <ThemeToggle />

          {!isAuthChecked ? null : isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
              }}
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 transition"
              >
                Sign up
              </Link>

              <Link
                to="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,77,166,0.5) 0%, rgba(123,63,228,0.4) 50%, transparent 100%)",
        }}
        aria-hidden
      />
    </header>
  );
}
