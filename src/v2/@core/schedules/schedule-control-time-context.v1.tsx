import { useEffect, useRef } from "react";

type SchedulerDate = Date | string | null | undefined;

interface UsePersistentSchedulerProps {
  enabled?: boolean;
  nextDate: SchedulerDate;
  onRun: () => void | Promise<void>;
  onExpired?: () => void;
}

const toDate = (value: SchedulerDate): Date | null => {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
};

export const usePersistentScheduler = ({
  enabled = true,
  nextDate,
  onRun,
  onExpired,
}: UsePersistentSchedulerProps) => {
  const timerRef = useRef<number | null>(null);

  const onRunRef = useRef(onRun);
  const onExpiredRef = useRef(onExpired);

  // mantém sempre a versão mais recente
  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  useEffect(() => {
    onExpiredRef.current = onExpired;
  }, [onExpired]);

  useEffect(() => {
    if (!enabled) return;

    const targetDate = toDate(nextDate);

    if (!targetDate) return;

    const clear = () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    clear();

    const now = Date.now();
    const ms = targetDate.getTime() - now;

    const execute = async () => {
      clear();

      try {
        await onRunRef.current();
      } catch (error) {
        console.error(error);
      }
    };

    // já venceu (F5 depois do horário)
    if (ms <= 0) {
      onExpiredRef.current?.();
      execute();
      return;
    }

    timerRef.current = window.setTimeout(execute, ms);

    return clear;
  }, [enabled, nextDate]);
};
