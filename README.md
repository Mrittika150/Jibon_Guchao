<p align="center">
  <img src="app-icon.svg" width="96" alt="Jibon Guchao app icon: a smiling cloud with sparkles" />
</p>

<h1 align="center">Jibon Guchao</h1>

<p align="center">
  <em>"Jibon guchao" is Bangla for "put your life in order".</em><br />
  A cute, cosy desktop app for your whole day: health, food, money, study and a private journal, all in one place.
</p>

<p align="center">
  Tauri 2 · React 19 · TypeScript · Supabase · Tailwind CSS
</p>

---

## What it does

| Screen | What you can do |
|---|---|
| **Today** | Log steps and water with draggable sliders, plus walk, weight, exercises and to-dos. A little burst of hearts when you reach a goal. |
| **Calendar** | A month at a glance: steps, fast days, deadlines and days off. Click any day to see or edit it. |
| **Health** | Steps and weight charts for 7, 30 or 90 days, with averages and a "Show as table" view. |
| **Food** | Your meal plan for normal days and fast days, meals you can tick off, a "Next" meal marker, and a food list (love / avoid / ask my dietitian). |
| **Expenses** | Add expenses in taka, see the monthly total, daily average and a chart by category. |
| **Journal** | One page per day with a mood, rich text (bold, lists, checklists, a pink highlighter), writing prompts and autosave. |
| **Skills** | Practice time with weekly goals and a streak, courses with lesson checklists, and deadlines with "due in 3 days" labels. |

Plus:

- **Desktop widget**: a small always-on-top window with steps, water and today's to-dos.
- **Reminders**: gentle Windows notifications for meals, water and deadlines.
- **Data export**: a full JSON backup or a CSV of your daily log, saved wherever you choose.
- **Two themes**: Pookie Pink and Midnight, with soft animations that switch off when Windows "reduce motion" is on.
- **Stickers everywhere**: original, hand-drawn SVG stickers. You can swap any of them for your own pictures (see [Your own stickers](#your-own-stickers)).


---

## Tech stack

- **Desktop shell:** [Tauri 2](https://tauri.app/) (Rust), with the dialog, fs and notification plugins
- **Front end:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4 with CSS variables for the two themes
- **Data:** [Supabase](https://supabase.com/) (Postgres, Auth, row-level security)
- **Data fetching:** TanStack Query
- **Charts:** Recharts
- **Journal editor:** Tiptap
- **Tests:** Vitest

---

## Getting started

### 1. What you need

- Windows 10 or 11 (with WebView2, which Windows 11 already has)
- [Node.js](https://nodejs.org/) 22 or newer
- [Rust](https://www.rust-lang.org/tools/install) (installed with `rustup`)
- The [Tauri prerequisites for Windows](https://tauri.app/start/prerequisites/) (Microsoft C++ Build Tools)
- A free [Supabase](https://supabase.com/) project

### 2. Get the code

```bash
git clone https://github.com/<your-username>/Jibon_Guchao.git
cd Jibon_Guchao
npm install
```

### 3. Set up Supabase

1. In your Supabase project, open **SQL Editor** and run each file in `supabase/migrations/` **in order** (oldest first):
   - `202611111000_init.sql`
   - `202611121000_expenses.sql`
   - `202611161000_journal.sql`
   - `202611161100_journal_rich_text.sql`
   - `202611171000_food.sql`
   - `202611171100_skills.sql`
2. Under **Authentication**, turn **sign-ups off**. This app is for you, not for strangers.
3. Under **Authentication > Users**, add your user with **Auto Confirm** on.
4. Optional: after your first login, set your work hours, days off and goals in **Table Editor > user_settings**. They're settings, not code, so your real schedule never ends up in the repo.

### 4. Add your keys

Copy `.env.example` to `.env.local` and fill in your project's values from **Project Settings > API**:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
```

Use the **publishable** key only. Never put the `service_role` (secret) key in this app. `.env.local` is ignored by git.

### 5. Run it

```bash
npm run tauri dev
```

The first run compiles the Rust side, so it takes a few minutes. Later runs are quick.

---

## Useful commands

| Command | What it does |
|---|---|
| `npm run tauri dev` | Runs the desktop app with live reload |
| `npm test` | Runs the Vitest unit tests |
| `npm run build` | Type-checks and builds the front end |
| `npm run tauri build` | Builds the Windows installer (see below) |
| `npm run tauri icon app-icon.svg` | Regenerates all app icon sizes from `app-icon.svg` |

### Building the installer

```bash
npm run tauri build
```

The installer is created at:

```
src-tauri/target/release/bundle/nsis/Jibon Guchao_<version>_x64-setup.exe
```



---

## Project structure

```
src/
  app/            sidebar, screens list, reminders
  auth/           login screen and session
  components/     shared pieces: cards, progress bar, stickers, icons, celebration
  features/
    today/        daily log, exercises, to-dos
    calendar/     month view
    health/       charts, stat tiles, data export buttons
    food/         meal plan, fast days, food list
    expenses/     expenses, categories, chart
    journal/      rich-text editor, moods, prompts
    skills/       practice, courses, deadlines
  lib/            Supabase client, dates, money, CSV, backups, reminders
  themes/         colours, animations, editor styles
  widget/         the desktop widget window
src-tauri/        Rust side: windows, plugins, permissions, icons
supabase/
  migrations/     database tables and row-level security, in order
  tests/          a manual RLS check
```

---

## Privacy and security

This app holds personal data, so it's built to keep it private:

- **Row-level security on every table.** Each row belongs to one user, and Postgres itself refuses to show or change anyone else's rows. Signed-out visitors get nothing.
- **Only the publishable key** ships in the app. The `service_role` key is never used.
- **No real personal data in the repo.** Meal plans, food lists, schedules, expenses and journal entries live only in your Supabase database. Tests and screenshots use fake sample data.
- **Money is stored as whole paisa** (`bigint`), so totals are always exact.
- **Backups are yours.** Export files are git-ignored, and you choose where they're saved.



---



## Roadmap

- Screenshots and a short demo GIF (with sample data)
- A settings screen for goals, work hours and days off
- Start with Windows and a tray icon, so reminders work while the window is closed
- Optional encryption for journal entries
- CREDITS.md with full icon attributions

---

## Credits

- **Screen icons:** from [Flaticon](https://www.flaticon.com/). Full attributions will be listed in `CREDITS.md`.
- **Stickers and app icon:** original artwork drawn for this project.
- **Font:** [Quicksand](https://fonts.google.com/specimen/Quicksand), via Fontsource.
- Built with Tauri, React, Supabase, TanStack Query, Recharts, Tiptap and Tailwind CSS.

