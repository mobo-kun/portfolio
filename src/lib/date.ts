export function formatMonthYear(value: string): string {
  if (!value) return "";
  if (value.toLowerCase() === "present") return "Present";

  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return value;

  const [, year, monthStr] = match;
  const monthIndex = parseInt(monthStr, 10) - 1;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  if (monthIndex < 0 || monthIndex > 11) return value;
  return `${months[monthIndex]} ${year}`;
}

export function formatDateRange(start: string, end: string): string {
  return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
}
