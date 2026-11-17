import type { FormEvent } from "react";
import { Card } from "../../components/Card";
import { TrashIcon } from "../../components/icons/TrashIcon";
import { ProgressBar } from "../../components/ProgressBar";
import { Sticker } from "../../components/stickers/Sticker";
import { addDays, formatShortDate, todayISO } from "../../lib/dates";
import { StatTile } from "../health/StatTile";
import { useAddPractice, useAddSkill, useDeletePractice, useDeleteSkill, usePracticeLogs, useSkills } from "./api";
import { formatMinutes, practiceStreak, weekOf } from "./studyTime";

export const FIELD = "w-full min-w-0 rounded-2xl border border-line bg-page px-3 py-1.5";
const ICON_BUTTON = "shrink-0 rounded-xl p-1.5 text-ink-soft hover:bg-card hover:text-ink";

export function PracticeTab() {
  const today = todayISO();
  const week = weekOf(today);
  const skills = useSkills();
  // 60 days back is plenty for the streak; this week's numbers come from the same list
  const logs = usePracticeLogs(addDays(today, -60), today);
  const addPractice = useAddPractice();
  const deletePractice = useDeletePractice();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();

  const skillList = skills.data ?? [];
  const allLogs = logs.data ?? [];
  const thisWeek = allLogs.filter((log) => log.log_date >= week.from && log.log_date <= week.to);
  const weekTotal = thisWeek.reduce((sum, log) => sum + log.minutes, 0);
  const streak = practiceStreak(new Set(allLogs.map((log) => log.log_date)), today);
  const skillName = (id: string) => skillList.find((skill) => skill.id === id)?.name ?? "Skill";

  function handleLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const minutes = Number(data.get("minutes"));
    const note = data.get("note")?.toString().trim() ?? "";
    addPractice.mutate(
      {
        skill_id: data.get("skill_id")?.toString() ?? "",
        log_date: data.get("log_date")?.toString() || today,
        minutes,
        note: note === "" ? null : note,
      },
      { onSuccess: () => form.reset() },
    );
  }

  function handleAddSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = data.get("name")?.toString().trim() ?? "";
    const goal = Number(data.get("goal")) || null; // empty box = no goal
    if (name === "") return;
    addSkill.mutate({ name, weekly_goal_minutes: goal }, { onSuccess: () => form.reset() });
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
        <Card title="Log practice" sticker="bat">
          {skillList.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-ink-soft">
              <Sticker name="bear" className="h-8 w-8" />
              Add a skill on the right first.
            </p>
          ) : (
            <form onSubmit={handleLog} className="grid grid-cols-2 gap-2">
              <select name="skill_id" aria-label="Skill" className={FIELD}>
                {skillList.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.name}
                  </option>
                ))}
              </select>
              <input name="minutes" type="number" min={1} max={1440} required placeholder="Minutes" aria-label="Minutes" className={FIELD} />
              <input name="log_date" type="date" defaultValue={today} required aria-label="Date" className={FIELD} />
              <input name="note" maxLength={200} placeholder="Note (optional)" aria-label="Note" className={FIELD} />
              <button
                type="submit"
                disabled={addPractice.isPending}
                className="col-span-2 rounded-2xl bg-pink px-3 py-1.5 font-bold text-on-pink disabled:opacity-60"
              >
                Add session
              </button>
            </form>
          )}
        </Card>

        <Card title="This week's sessions" sticker="sparkle">
          {thisWeek.length === 0 ? (
            <p className="text-sm text-ink-soft">No practice yet this week.</p>
          ) : (
            <ul className="-mr-2 flex max-h-40 flex-col gap-1 overflow-y-auto pr-2">
              {thisWeek.map((log) => (
                <li key={log.id} className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-card-soft">
                  <span className="w-14 shrink-0 text-sm text-ink-soft">{formatShortDate(log.log_date)}</span>
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-semibold">{skillName(log.skill_id)}</span>
                    {log.note && <span className="text-ink-soft"> · {log.note}</span>}
                  </span>
                  <span className="shrink-0 font-bold">{formatMinutes(log.minutes)}</span>
                  <button
                    type="button"
                    onClick={() => deletePractice.mutate(log.id)}
                    aria-label={`Delete ${skillName(log.skill_id)} session on ${formatShortDate(log.log_date)}`}
                    title="Delete"
                    className={ICON_BUTTON}
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="stagger flex flex-col gap-4 [&>*:last-child]:grow">
        <div className="grid grid-cols-2 gap-4">
          <StatTile sticker="star" label="This week" value={formatMinutes(weekTotal)} detail={`${thisWeek.length} sessions`} />
          <StatTile sticker="heart" label="Streak" value={`${streak} ${streak === 1 ? "day" : "days"}`} detail="days in a row" />
        </div>

        <Card title="My skills" sticker="cloud">
          <ul className="-mr-2 flex max-h-40 flex-col gap-2 overflow-y-auto pr-2">
            {skillList.map((skill) => {
              const minutes = thisWeek.filter((log) => log.skill_id === skill.id).reduce((sum, log) => sum + log.minutes, 0);
              return (
                <li key={skill.id} className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2 text-sm">
                      <span className="truncate font-semibold">{skill.name}</span>
                      <span className="shrink-0 text-ink-soft">
                        {formatMinutes(minutes)}
                        {skill.weekly_goal_minutes && ` / ${formatMinutes(skill.weekly_goal_minutes)} this week`}
                      </span>
                    </div>
                    {skill.weekly_goal_minutes && (
                      <ProgressBar value={minutes} goal={skill.weekly_goal_minutes} label={`${skill.name} weekly goal`} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${skill.name}" and all its practice sessions?`)) deleteSkill.mutate(skill.id);
                    }}
                    aria-label={`Delete skill ${skill.name}`}
                    title="Delete"
                    className={ICON_BUTTON}
                  >
                    <TrashIcon />
                  </button>
                </li>
              );
            })}
          </ul>

          {addSkill.isError && (
            <p role="alert" className="text-sm">
              {addSkill.error.message.includes("duplicate") ? "You already have that skill." : `Could not save: ${addSkill.error.message}`}
            </p>
          )}

          <form onSubmit={handleAddSkill} className="mt-auto flex gap-2">
            <input name="name" required maxLength={60} placeholder="New skill" aria-label="Skill name" className={`${FIELD} flex-1`} />
            <input
              name="goal"
              type="number"
              min={1}
              max={10080}
              placeholder="Min/week"
              aria-label="Weekly goal in minutes (optional)"
              className="w-28 shrink-0 rounded-2xl border border-line bg-page px-3 py-1.5"
            />
            <button type="submit" disabled={addSkill.isPending} className="rounded-2xl bg-card-soft px-3 py-1.5 font-bold disabled:opacity-60">
              Add
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
