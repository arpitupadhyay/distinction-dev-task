import { ApiError } from "./api";

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function handleError(err: unknown): string {
  if (err instanceof ApiError) {
    return err.message;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return 'An unexpected error occurred';
  }
}
