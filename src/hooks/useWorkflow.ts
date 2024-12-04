import { useState, useCallback } from "react";
import { workflowService, WorkflowResponse } from "../services/workflowService";

interface UseWorkflowOptions {
  onSuccess?: (response: WorkflowResponse) => void;
  onError?: (error: Error) => void;
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<WorkflowResponse | null>(null);

  const execute = useCallback(
    async (workflowFn: () => Promise<WorkflowResponse>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await workflowFn();
        setData(response);
        options.onSuccess?.(response);
        return response;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An error occurred");
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const backpopulate = useCallback(
    (params: Parameters<typeof workflowService.backpopulateData>[0]) => {
      return execute(() => workflowService.backpopulateData(params));
    },
    [execute]
  );

  const sync = useCallback(
    (params: Parameters<typeof workflowService.syncData>[0]) => {
      return execute(() => workflowService.syncData(params));
    },
    [execute]
  );

  const syncAll = useCallback(() => {
    return execute(() => workflowService.syncAllData());
  }, [execute]);

  const cleanup = useCallback(
    (params: Parameters<typeof workflowService.cleanupData>[0]) => {
      return execute(() => workflowService.cleanupData(params));
    },
    [execute]
  );

  const validate = useCallback(
    (params: Parameters<typeof workflowService.validateData>[0]) => {
      return execute(() => workflowService.validateData(params));
    },
    [execute]
  );

  const migrate = useCallback(
    (params: Parameters<typeof workflowService.migrateData>[0]) => {
      return execute(() => workflowService.migrateData(params));
    },
    [execute]
  );

  const audit = useCallback(
    (params: Parameters<typeof workflowService.auditData>[0]) => {
      return execute(() => workflowService.auditData(params));
    },
    [execute]
  );

  const reconcile = useCallback(
    (params: Parameters<typeof workflowService.reconcileData>[0]) => {
      return execute(() => workflowService.reconcileData(params));
    },
    [execute]
  );

  const getStatus = useCallback(
    (workflowId: string) => {
      return execute(() => workflowService.getWorkflowStatus(workflowId));
    },
    [execute]
  );

  const cancel = useCallback(
    (workflowId: string) => {
      return execute(() => workflowService.cancelWorkflow(workflowId));
    },
    [execute]
  );

  const getHistory = useCallback(
    (workflowType?: string, limit?: number, offset?: number) => {
      return execute(() =>
        workflowService.getWorkflowHistory(workflowType, limit, offset)
      );
    },
    [execute]
  );

  const getMetrics = useCallback(
    (workflowType: string) => {
      return execute(() => workflowService.getWorkflowMetrics(workflowType));
    },
    [execute]
  );

  return {
    isLoading,
    error,
    data,
    backpopulate,
    sync,
    syncAll,
    cleanup,
    validate,
    migrate,
    audit,
    reconcile,
    getStatus,
    cancel,
    getHistory,
    getMetrics,
  };
}
