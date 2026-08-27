import { classLabel, findTeacherById, subjectName } from "@/lib/school-life";
import type { SchoolLifeData, TimetableSlot, WeekdayId } from "@/lib/school-life-types";
import { WEEKDAYS } from "@/lib/school-life-types";

function hoursFor(slots: TimetableSlot[]) {
  const unique = [...new Set(slots.map((slot) => `${slot.startTime}|${slot.endTime}`))];
  unique.sort();
  return unique.map((key) => {
    const [startTime, endTime] = key.split("|");
    return { startTime, endTime };
  });
}

function SlotCard({
  slot,
  data,
  onDeleteAction,
}: {
  slot: TimetableSlot;
  data: SchoolLifeData;
  onDeleteAction?: string;
}) {
  const teacher = findTeacherById(slot.teacherId, data);
  return (
    <div className="rounded-2xl bg-green-soft/70 px-3 py-2">
      <p className="font-semibold text-green-deep">{subjectName(slot.subjectId, data)}</p>
      <p className="text-xs text-muted">
        {teacher?.displayName ?? "Enseignant"}
        {slot.room ? ` · ${slot.room}` : ""}
      </p>
      <p className="text-xs text-muted">{classLabel(slot.classId, data)}</p>
      {onDeleteAction ? (
        <form action={onDeleteAction} method="post" className="mt-1">
          <input type="hidden" name="action" value="delete" />
          <input type="hidden" name="id" value={slot.id} />
          <input type="hidden" name="classId" value={slot.classId} />
          <button className="min-h-10 text-xs font-semibold text-terracotta hover:underline">Retirer</button>
        </form>
      ) : null}
    </div>
  );
}

export function TimetableGrid({
  slots,
  data,
  emptyText,
  onDeleteAction,
}: {
  slots: TimetableSlot[];
  data: SchoolLifeData;
  emptyText: string;
  onDeleteAction?: string;
}) {
  const days = WEEKDAYS.filter((day) => day.id !== 6 || slots.some((slot) => slot.dayOfWeek === 6));
  const hours = hoursFor(slots);

  if (slots.length === 0) {
    return <p className="text-sm text-muted">{emptyText}</p>;
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {days.map((day) => {
          const daySlots = slots
            .filter((slot) => slot.dayOfWeek === (day.id as WeekdayId))
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          return (
            <article key={day.id} className="rounded-2xl border border-line bg-white p-4">
              <h3 className="font-display text-lg text-green-deep">{day.label}</h3>
              {daySlots.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Aucun cours</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {daySlots.map((slot) => (
                    <li key={slot.id} className="flex gap-3">
                      <p className="w-24 shrink-0 text-xs font-semibold text-muted">
                        {slot.startTime} – {slot.endTime}
                      </p>
                      <div className="min-w-0 flex-1">
                        <SlotCard slot={slot} data={data} onDeleteAction={onDeleteAction} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto overscroll-x-contain md:block">
        <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-paper-2 text-muted">
              <th className="w-28 px-3 py-2 font-semibold">Horaire</th>
              {days.map((day) => (
                <th key={day.id} className="px-3 py-2 font-semibold">
                  <span className="lg:hidden">{day.short}</span>
                  <span className="hidden lg:inline">{day.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={`${hour.startTime}-${hour.endTime}`} className="border-t border-line align-top">
                <td className="whitespace-nowrap px-3 py-2 text-xs font-semibold text-muted">
                  {hour.startTime} – {hour.endTime}
                </td>
                {days.map((day) => {
                  const cell = slots.filter(
                    (slot) =>
                      slot.dayOfWeek === (day.id as WeekdayId) &&
                      slot.startTime === hour.startTime &&
                      slot.endTime === hour.endTime,
                  );
                  return (
                    <td key={day.id} className="px-2 py-2">
                      {cell.map((slot) => (
                        <div key={slot.id} className="mb-2 last:mb-0">
                          <SlotCard slot={slot} data={data} onDeleteAction={onDeleteAction} />
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
