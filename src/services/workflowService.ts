import { apiService } from "./apiService";

export interface WorkflowResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface BackpopulateParams {
  assets: string[];
  sources: string[];
  timeframes: string[];
  startDate: string;
  endDate: string;
}

export interface DataSyncParams {
  sourceId: string;
}

export interface DataCleanupParams {
  rules: {
    id: string;
    enabled: boolean;
  }[];
}

export interface DataValidationParams {
  checkIds: string[];
}

export interface DataMigrationParams {
  sourceFormat: string;
  targetFormat: string;
}

export interface DataAuditParams {
  categories?: string[];
  depth?: "basic" | "detailed" | "comprehensive";
}

export interface DataReconciliationParams {
  source1: string;
  source2: string;
  fields?: string[];
}

export const workflowService = {
  // Backpopulate Data
  backpopulateData: async (
    params: BackpopulateParams
  ): Promise<WorkflowResponse> => {
    try {
      console.log(params);
      return await apiService.post("/workflows/backpopulate", params);
    } catch (error) {
      console.error("Error in backpopulate workflow:", error);
      throw error;
    }
  },

  // Data Sync
  syncData: async (params: DataSyncParams): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/sync", params);
    } catch (error) {
      console.error("Error in sync workflow:", error);
      throw error;
    }
  },

  syncAllData: async (): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/sync/all");
    } catch (error) {
      console.error("Error in sync all workflow:", error);
      throw error;
    }
  },

  // Data Cleanup
  cleanupData: async (params: DataCleanupParams): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/cleanup", params);
    } catch (error) {
      console.error("Error in cleanup workflow:", error);
      throw error;
    }
  },

  // Data Validation
  validateData: async (
    params: DataValidationParams
  ): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/validate", params);
    } catch (error) {
      console.error("Error in validation workflow:", error);
      throw error;
    }
  },

  // Data Migration
  migrateData: async (
    params: DataMigrationParams
  ): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/migrate", params);
    } catch (error) {
      console.error("Error in migration workflow:", error);
      throw error;
    }
  },

  // Data Audit
  auditData: async (params: DataAuditParams): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/audit", params);
    } catch (error) {
      console.error("Error in audit workflow:", error);
      throw error;
    }
  },

  // Data Reconciliation
  reconcileData: async (
    params: DataReconciliationParams
  ): Promise<WorkflowResponse> => {
    try {
      return await apiService.post("/workflows/reconcile", params);
    } catch (error) {
      console.error("Error in reconciliation workflow:", error);
      throw error;
    }
  },

  // Get Workflow Status
  getWorkflowStatus: async (workflowId: string): Promise<WorkflowResponse> => {
    try {
      return await apiService.get(`/workflows/status/${workflowId}`);
    } catch (error) {
      console.error("Error getting workflow status:", error);
      throw error;
    }
  },

  // Cancel Workflow
  cancelWorkflow: async (workflowId: string): Promise<WorkflowResponse> => {
    try {
      return await apiService.post(`/workflows/cancel/${workflowId}`);
    } catch (error) {
      console.error("Error canceling workflow:", error);
      throw error;
    }
  },

  // Get Workflow History
  getWorkflowHistory: async (
    workflowType?: string,
    limit?: number,
    offset?: number
  ): Promise<WorkflowResponse> => {
    try {
      const params = new URLSearchParams();
      if (workflowType) params.append("type", workflowType);
      if (limit) params.append("limit", limit.toString());
      if (offset) params.append("offset", offset.toString());

      return await apiService.get(`/workflows/history?${params.toString()}`);
    } catch (error) {
      console.error("Error getting workflow history:", error);
      throw error;
    }
  },

  // Get Workflow Metrics
  getWorkflowMetrics: async (
    workflowType: string
  ): Promise<WorkflowResponse> => {
    try {
      return await apiService.get(`/workflows/metrics/${workflowType}`);
    } catch (error) {
      console.error("Error getting workflow metrics:", error);
      throw error;
    }
  },
};
