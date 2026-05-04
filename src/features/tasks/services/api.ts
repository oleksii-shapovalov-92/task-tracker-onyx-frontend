import axiosInstance from "../../../lib/axiosInstance";
import type { CreateTaskDto, TaskStatus, UpdateTaskDto } from "../types";

const TASKS_BASE_PATH = "/tasks";

export const fetchTasksByProjectId = async (projectId: string) => {
  const res = await axiosInstance.get(`${TASKS_BASE_PATH}/project/${projectId}`);
  return res.data;
};

export const createTask = async (dto: CreateTaskDto) => {
  const res = await axiosInstance.post(TASKS_BASE_PATH, dto);
  return res.data;
};

export const updateTask = async (taskId: string, dto: UpdateTaskDto) => {
  const res = await axiosInstance.put(`${TASKS_BASE_PATH}/${taskId}`, dto);
  return res.data;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {
  const res = await axiosInstance.patch(`${TASKS_BASE_PATH}/${taskId}/status`, {
    status,
  });
  return res.data;
};

export const deleteTask = async (taskId: string) => {
  await axiosInstance.delete(`${TASKS_BASE_PATH}/${taskId}`);
};