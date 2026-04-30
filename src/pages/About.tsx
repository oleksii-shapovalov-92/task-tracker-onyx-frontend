export default function About() {
  const people: {
    name: string;
    role: string;
    blurb: string;
    photo?: string;
    photoPosition?: string;
    photoFit?: "cover" | "contain";
    photoScale?: number;
  }[] = [
    {
      name: "Alisher Khamidov",
      role: "Project Mentor",
      blurb: "Builds scalable web applications with TypeScript and Node.js.",
      photo: "/team/alisher.jpg",
      photoPosition: "top",
      photoScale: 1.2,
    },
    {
      name: "Serdar Kerimov",
      role: "Quality Assurance",
      blurb:
        "Ensures product quality by catching issues early and maintaining smooth user experiences.",
      photo: "/team/serdar.jpg",
      photoPosition: "top",
      photoScale: 1.2,
    },
    {
      name: "Olga Pidgorna",
      role: "Quality Assurance",
      blurb:
        "Transforms edge cases into reliable user flows through thorough testing and attention to detail.",
      photo: "/team/olga.jpg",
      photoPosition: "top",
      photoScale: 1.2,
    },
    {
      name: "Kyrylova Valentyna",
      role: "Quality Assurance",
      blurb:
        "Guarantees stable releases by validating functionality and preventing regressions.",
      photo: "/team/valentyna.jpg",
      photoPosition: "center 5%",
    },
    {
      name: "Natalia Voznesenskaia",
      role: "Frontend",
      blurb:
        "Crafts intuitive and responsive interfaces that make complex workflows feel simple.",
      photo: "/team/natalia.jpg",
      photoPosition: "center 5%",
    },
    {
      name: "Oleksii Shapovalov",
      role: "Backend",
      blurb:
        "Builds scalable and efficient backend systems that power seamless application performance.",
      photo: "/team/oleksii.jpg",
      photoPosition: "center 5%",
    },
    {
      name: "Edgars Viksna",
      role: "Backend",
      blurb:
        "Delivers high-performance solutions with a strong focus on reliability and system design.",
      photo: "/team/edgars.jpg",
    },
    {
      name: "Mihail Rusu",
      role: "Backend",
      blurb:
        "Develops secure and maintainable services that ensure long-term system stability.",
    },
    {
      name: "Morash Roman",
      role: "Backend",
      blurb:
        "Focuses on clean code and robust logic to deliver reliable and consistent backend functionality.",
    },
  ];

  const initials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:py-20">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          About ONYX
        </h1>
        <p className="max-w-2xl text-base leading-7 text-gray-600">
          A small team building a simple task tracker that stays out of your way
          and helps you ship work with confidence.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <div
            key={p.name}
            className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="relative h-64 w-full overflow-hidden">
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.name}
                  className={
                    "h-full w-full " +
                    (p.photoFit === "contain"
                      ? "object-contain bg-gray-50"
                      : "object-cover")
                  }
                  style={{
                    objectPosition: p.photoPosition ?? "center 30%",
                    ...(p.photoScale !== undefined && {
                      transform: `scale(${p.photoScale})`,
                      transformOrigin: "center center",
                    }),
                  }}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff4da6 0%, #7b3fe4 100%)",
                  }}
                  aria-hidden
                >
                  {initials(p.name)}
                </div>
              )}

              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 backdrop-blur-sm dark:bg-gray-950/90 dark:text-violet-300">
                {p.role}
              </span>
            </div>

            <div className="border-t border-gray-100 bg-[radial-gradient(ellipse_at_top_left,rgba(255,77,166,0.06)_0%,rgba(123,63,228,0.05)_50%,transparent_80%),#ffffff] px-5 pb-5 pt-4 transition-colors dark:border-gray-700 dark:bg-[radial-gradient(ellipse_at_top_left,rgba(255,77,166,0.08)_0%,rgba(123,63,228,0.10)_50%,transparent_80%),#111827]">
              <div
                className="mb-3 h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,77,166,0.5), rgba(123,63,228,0.4), transparent)",
                }}
                aria-hidden
              />
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {p.name}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">
                {p.blurb}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
