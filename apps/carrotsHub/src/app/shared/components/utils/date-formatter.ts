import type { TuiDay } from "@taiga-ui/cdk";

export function formatDateForFirebase(date: TuiDay): string {
  const year = date.year;
  const month = (date.month + 1).toString().padStart(2, "0");
  const day = date.day.toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
