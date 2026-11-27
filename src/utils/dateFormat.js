// "2030-01-01T09:00:00" -> "1 Jan 2030, 09:00" in the user's locale
export const formatReminder = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

// value for <input type="datetime-local">, the backend expects local time without zone
export const toLocalInputValue = (date) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const isPastReminder = (value) => new Date(value).getTime() < Date.now();
