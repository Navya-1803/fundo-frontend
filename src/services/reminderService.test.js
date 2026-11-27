import apiClient from '../utils/apiClient.js';
import { getReminders, removeReminder, setReminder } from './reminderService.js';

vi.mock('../utils/apiClient.js', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('reminderService', () => {
  it('sets a reminder', async () => {
    await setReminder(2, '2030-01-01T09:00:00', 'Call');
    expect(apiClient.post).toHaveBeenCalledWith('/api/reminders', { noteId: 2, reminderTime: '2030-01-01T09:00:00', message: 'Call' });
  });

  it('lists and removes reminders', async () => {
    await getReminders();
    await removeReminder(2);
    expect(apiClient.get).toHaveBeenCalledWith('/api/reminders');
    expect(apiClient.delete).toHaveBeenCalledWith('/api/reminders/2');
  });
});
