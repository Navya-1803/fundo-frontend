# Fundoo Notes Frontend

React frontend for **Fundoo Notes**, a Google Keep style notes application.
It talks to the Spring Boot backend in
[fundo-backend](https://github.com/Navya-1803/fundo-backend).

> The code is on the **`develop`** branch. `main` only holds this README.

## Features

* Register, sign in, sign out, forgot password and reset password with an OTP sent by email
* Protected pages: only signed in users can open the notes
* Dashboard with "Take a note..." editor, pinned and other notes
* Edit a note by clicking it, pin / unpin, archive, move to trash
* Archive and Trash pages, restore and delete forever
* Search bar that filters the notes of the current page
* Reminders with a date-time picker and a Reminders page; the reminder is emailed at the
  chosen time and the note shows "Email sent" afterwards
* Labels: create, rename and delete labels, label notes, one page per label
* Loading, empty and error messages everywhere

## Tech Stack

| Technology | Used for |
|---|---|
| React 19 + Vite | User interface and dev server |
| React Router | Pages and protected routes |
| Axios | API calls, the JWT is attached automatically |
| Plain CSS | Styling |
| Vitest + React Testing Library | Tests |

## Project Structure

```
src/
├── assets/       logo
├── components/   reusable UI: Navbar, Sidebar, NoteCard, NoteList, NoteEditor,
│                 EditNoteModal, ReminderPicker, LabelModal, NoteLabelPicker,
│                 SearchBar, ProtectedRoute, GuestRoute, AppLayout ...
├── pages/        LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage,
│                 DashboardPage, ArchivePage, TrashPage, ReminderPage, LabelPage
├── services/     authService, noteService, labelService, reminderService
├── hooks/        useAuth, useNotes, useLabels, useLayoutContext, useSearchQuery
├── utils/        apiClient, token, validators, errorMessage, noteFilters, dateFormat
├── router/       AppRoutes
├── App.jsx
└── main.jsx
```

Every component, page, hook, service and utility has a matching `*.test.js(x)` file.

## Feature Branches

| Branch | Feature |
|---|---|
| `feature/UC1-ProjectSetup` | API client, token storage, validators |
| `feature/UC2-ProtectedRouting` | Routing, protected and guest routes, auth context |
| `feature/UC3-Register` | Register page |
| `feature/UC4-Login` | Login page |
| `feature/UC5-Dashboard` | Layout, note editor and note list |
| `feature/UC6-NoteActions` | Pin, archive and trash |
| `feature/UC7-EditNote` | Edit dialog |
| `feature/UC8-ArchiveAndTrash` | Archive and Trash pages |
| `feature/UC9-Search` | Search bar |
| `feature/UC10-Reminder` | Reminders |
| `feature/UC11-Label` | Labels |
| `feature/UC12-ForgotResetPassword` | Forgot and reset password |
| `feature/UC13-IntegrationFixes` | Fixes found while testing with the backend |
| `feature/UC14-EmailOtp` | OTP is emailed instead of shown on screen |
| `feature/UC15-ReminderEmail` | Reminder email hint and sent state |

## How to Run

### 1. Requirements

* **Node.js 20 or newer** (comes with npm) - check with `node -v`
* The **backend running** on http://localhost:8080 (see the backend README)

### 2. Get the code and install

```bash
git clone https://github.com/Navya-1803/fundo-frontend.git
cd fundo-frontend
git checkout develop
npm install
```

### 3. Start

```bash
npm run dev
```

Open http://localhost:5173, create an account and sign in.

If the backend runs on another address, copy `.env.example` to `.env` and change
`VITE_API_BASE_URL`, then restart `npm run dev`.

### 4. Other commands

```bash
npm test          # run all tests once
npm run build     # production build into dist/
npm run preview   # serve the production build
```

## Author

Navya Raj
