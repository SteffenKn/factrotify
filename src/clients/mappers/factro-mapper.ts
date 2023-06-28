import { Task } from '../../types';

export function mapTask(task: any): Task {
  return {
    ...task,
    changeDate: new Date(task.changeDate),
    creationDate: new Date(task.creationDate),
    endDate: new Date(task.endDate),
    startDate: new Date(task.startDate),
    pausedUntil: new Date(task.pausedUntil),
  };
}
