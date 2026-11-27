import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReminderPage from './ReminderPage.jsx';
import { getReminders, removeReminder } from '../services/reminderService.js';

vi.mock('../services/reminderService.js', () => ({ getReminders: vi.fn(), removeReminder: vi.fn() }));

describe('ReminderPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('splits upcoming and past reminders', async () => {
    getReminders.mockResolvedValue({
      data: [
        { id: 1, title: 'Future call', reminderTime: '2999-01-01T09:00:00' },
        { id: 2, title: 'Old meeting', reminderTime: '2001-01-01T09:00:00' },
      ],
    });
    render(<ReminderPage />);
    expect(await screen.findByRole('heading', { name: 'Future call' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Past' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Old meeting' })).toBeInTheDocument();
  });

  it('removes a reminder', async () => {
    getReminders.mockResolvedValue({ data: [{ id: 1, title: 'Future call', reminderTime: '2999-01-01T09:00:00' }] });
    removeReminder.mockResolvedValue({});
    render(<ReminderPage />);
    fireEvent.click(await screen.findByRole('button', { name: 'Remove reminder' }));
    await waitFor(() => expect(removeReminder).toHaveBeenCalledWith(1));
  });

  it('shows the empty state', async () => {
    getReminders.mockResolvedValue({ data: [] });
    render(<ReminderPage />);
    expect(await screen.findByText('Notes with upcoming reminders appear here')).toBeInTheDocument();
  });
});
