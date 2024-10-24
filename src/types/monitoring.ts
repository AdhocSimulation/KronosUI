export type MetricValue = number | string | boolean;

export interface Metric {
  name: string;
  value: MetricValue;
  unit?: string;
}

export type StatusType = "valid" | "warning" | "error";

export interface Status {
  title: string;
  description: string;
  type: StatusType;
}

export interface HealthResponse {
  serviceName: string;
  metrics: Metric[];
  statuses: Status[];
}

export interface ServiceHealth {
  id: string;
  name: string;
  endpoint: string;
  health?: HealthResponse;
  loading: boolean;
  error?: string;
}
