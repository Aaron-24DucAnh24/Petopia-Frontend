import { format } from 'date-fns';

export function formatDate(iso: string): string {
  return format(new Date(iso), 'dd/MM/yyyy');
}
