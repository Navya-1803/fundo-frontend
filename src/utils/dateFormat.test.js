import { formatReminder, isPastReminder, toLocalInputValue } from './dateFormat.js';

describe('dateFormat', () => {
  it('formats a reminder time', () => {
    expect(formatReminder('2030-01-01T09:00:00')).toContain('2030');
    expect(formatReminder(null)).toBe('');
    expect(formatReminder('not a date')).toBe('');
  });

  it('builds the datetime-local input value', () => {
    expect(toLocalInputValue(new Date(2030, 0, 5, 7, 3))).toBe('2030-01-05T07:03');
  });

  it('detects past reminders', () => {
    expect(isPastReminder('2000-01-01T00:00')).toBe(true);
    expect(isPastReminder('2999-01-01T00:00')).toBe(false);
  });
});
