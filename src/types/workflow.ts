export type WorkflowType =
  | "backpopulate"
  | "sync"
  | "cleanup"
  | "validation"
  | "migration"
  | "audit"
  | "reconciliation";

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowMetadata {
  id: string;
  type: WorkflowType;
  status: WorkflowStatus;
  startTime: string;
  endTime?: string;
  progress: number;
  error?: string;
}

export interface WorkflowHistoryEntry extends WorkflowMetadata {
  params: any;
  result?: any;
  duration?: number;
}

export interface WorkflowMetrics {
  totalRuns: number;
  successRate: number;
  averageDuration: number;
  lastRunTime?: string;
  errorRate: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
  };
}
