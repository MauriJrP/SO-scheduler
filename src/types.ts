export interface IProcess {
  process: string;
  time: number;
}

export interface IScheduler {
  algorithm: string;
  processes: IProcess[];
  quantum?: number;
}