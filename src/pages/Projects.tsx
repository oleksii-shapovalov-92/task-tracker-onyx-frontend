import ProjectForm from "../features/projects/components/ProjectForm";
import ProjectsList from "../features/projects/components/ProjectsList";

export default function Projects() {
  return (
    <div className="space-y-8">
      <ProjectForm />
      <ProjectsList />
    </div>
  );
}
