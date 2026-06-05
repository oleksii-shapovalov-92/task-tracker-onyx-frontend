import axiosInstance from "../../../lib/axiosInstance";

import type {
  CreateProjectDto,
  CreateProjectTaskDto,
  Project,
  ProjectTask,
  ProjectTaskStatus,
  ProjectUpdateDto,
} from "../types";


// axiosInstance already has baseURL: "/api/v1"
const PROJECTS_BASE_PATH = "/projects";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await axiosInstance.get<Project[]>(PROJECTS_BASE_PATH);
  return response.data;
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const response = await axiosInstance.get<Project>(
    `${PROJECTS_BASE_PATH}/${projectId}`,
  );

  return response.data;
};

export const fetchCreateProject = async (
  projectDto: CreateProjectDto,
): Promise<Project> => {
  const response = await axiosInstance.post<Project>(
    PROJECTS_BASE_PATH,
    projectDto,
  );

  return response.data;
};
export const fetchUpdateProject = async (
  projectId: string,
  projectDto: ProjectUpdateDto,
): Promise<Project> => {
  const response = await axiosInstance.patch<Project>(
    `${PROJECTS_BASE_PATH}/${projectId}`,
    projectDto,
  );

  return response.data;
};


export const fetchProjectTasks = async (
  projectId: string,
): Promise<ProjectTask[]> => {
  const response = await axiosInstance.get<ProjectTask[]>(
    `/tasks/project/${projectId}`,
  );

  return response.data;
};

export const fetchCreateProjectTask = async (
  taskDto: CreateProjectTaskDto,
): Promise<ProjectTask> => {
  const response = await axiosInstance.post<ProjectTask>("/tasks", taskDto);

  return response.data;
};

export const fetchUpdateProjectTaskStatus = async (
  taskId: string,
  status: ProjectTaskStatus
): Promise<ProjectTask> => {
  const response = await axiosInstance.patch<ProjectTask>(
    `/tasks/${taskId}/status`,
    { status }
  );

  return response.data;
};
export const fetchDeleteProject = async (projectId: string): Promise<void> => {
  await axiosInstance.delete(`${PROJECTS_BASE_PATH}/${projectId}`);
};
