import { TaskState } from './index';

export type Task = {
  customFields: Record<string, any>;
  targetParentId: string;
  number: number;
  changeDate: Date;
  creationDate: Date;
  creatorId: string;
  description: string;
  endDate: Date;
  id: string;
  mandantId: string;
  startDate: Date;
  companyId: string;
  title: string;
  companyContactId: string;
  officerId: string;
  parentPackageId: string;
  plannedEffort: number;
  projectId: string;
  realizedEffort: number;
  remainingEffort: number;
  executorId: string;
  isMilestone: boolean;
  pausedUntil: Date;
  taskPriority: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 99;
  taskState: TaskState;
};
