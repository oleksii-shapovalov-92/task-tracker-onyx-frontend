import { Link } from "react-router-dom";
import type { Project } from "../types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-purple-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
      aria-label={`Open project ${project.title}`}
    >
      <div
        className="h-1 w-full"
        style={{
          background: "linear-gradient(90deg, #ff4da6 0%, #7b3fe4 100%)",
        }}
        aria-hidden
      />

      <div className="flex flex-1 flex-col p-5 text-left">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900 transition group-hover:text-purple-700">
            {project.title}
          </h3>

          <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
            Project
          </span>
        </div>

        <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
          {project.description}
        </p>

        {project.owner?.email && (
          <p className="mt-4 text-xs text-gray-500">
            Owner: {project.owner.email}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-medium text-purple-700">
            View details
          </span>

          <span
            className="text-lg text-purple-700 transition-transform group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
