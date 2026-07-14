"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { listing } from "@/data/loadListing";
import Icon from "@/components/Icon";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// Unavailable days from the reference November calendar (greyed-out).
const UNAVAILABLE = new Set([
  "2026-11-18",
  "2026-11-19",
  "2026-11-20",
  "2026-11-21",
  "2026-11-22",
  "2026-11-23",
  "2026-11-24",
  "2026-11-29",
  "2026-11-30",
]);

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

function parseKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return { year: y, month: m, day: d };
}

function formatRangeLabel(checkIn: string | null, checkOut: string | null) {
  if (!checkIn || !checkOut) return null;
  const a = parseKey(checkIn);
  const b = parseKey(checkOut);
  const fmt = (p: { year: number; month: number; day: number }) =>
    `${p.day} ${MONTH_NAMES[p.month - 1].slice(0, 3)} ${p.year}`;
  return `${fmt(a)} - ${fmt(b)}`;
}

function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseKey(checkIn);
  const b = parseKey(checkOut);
  const start = Date.UTC(a.year, a.month - 1, a.day);
  const end = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((end - start) / 86_400_000);
}

function buildDays(year: number, month: number): (number | null)[] {
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = Array.from(
    { length: firstWeekday },
    () => null,
  );
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  return cells;
}

function addMonths(year: number, month: number, delta: number) {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function KeyboardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className="shrink-0"
      fill="currentColor"
    >
      <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13ZM2 5h1.25v1.25H2V5Zm2.25 0H5.5v1.25H4.25V5ZM6.5 5h1.25v1.25H6.5V5Zm2.25 0H10v1.25H8.75V5ZM11 5h1.25v1.25H11V5Zm2.25 0H14.5v1.25h-1.25V5ZM2 7.25h1.25V8.5H2V7.25Zm2.25 0H5.5V8.5H4.25V7.25ZM6.5 7.25h1.25V8.5H6.5V7.25Zm2.25 0H10V8.5H8.75V7.25ZM11 7.25h1.25V8.5H11V7.25Zm2.25 0H14.5V8.5h-1.25V7.25ZM3.5 9.5h9V10.75h-9V9.5Z" />
    </svg>
  );
}

const dayFocusClass =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--fg)] focus-visible:ring-offset-2";

type MonthGridProps = {
  year: number;
  month: number;
  checkIn: string | null;
  checkOut: string | null;
  focusKey: string | null;
  onSelect: (key: string) => void;
  onFocusDay: (key: string) => void;
  dayRefs: React.MutableRefObject<Map<string, HTMLButtonElement>>;
};

function MonthGrid({
  year,
  month,
  checkIn,
  checkOut,
  focusKey,
  onSelect,
  onFocusDay,
  dayRefs,
}: MonthGridProps) {
  const cells = buildDays(year, month);
  const label = `${MONTH_NAMES[month - 1]} ${year}`;

  const start = checkIn ? new Date(checkIn + "T00:00:00").getTime() : null;
  const end = checkOut ? new Date(checkOut + "T00:00:00").getTime() : null;

  return (
    <div className="min-w-0 flex-1">
      <h3 className="mb-4 text-center text-[16px] font-medium text-[var(--fg)]">
        {label}
      </h3>
      <div
        role="grid"
        aria-label={label}
        className="grid grid-cols-7"
      >
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={`${weekday}-${index}`}
            role="columnheader"
            className="flex h-10 items-center justify-center text-[12px] font-semibold text-[var(--fg)]"
          >
            <abbr title={WEEKDAY_LABELS[index]} className="no-underline">
              {weekday}
            </abbr>
          </div>
        ))}
        {cells.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`blank-${index}`}
                role="gridcell"
                className="h-12"
                aria-hidden
              />
            );
          }

          const key = toKey(year, month, day);
          const time = new Date(year, month - 1, day).getTime();
          const unavailable = UNAVAILABLE.has(key);
          const isStart = checkIn === key;
          const isEnd = checkOut === key;
          const inMiddle =
            start !== null &&
            end !== null &&
            time > start &&
            time < end;
          const selected = isStart || isEnd || inMiddle;
          const isFocused = focusKey === key;

          return (
            <div
              key={key}
              role="gridcell"
              className="relative flex h-12 items-center justify-center"
            >
              {inMiddle ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 inset-x-0 bg-[var(--bg-subtle)]"
                />
              ) : null}
              {isStart && end !== null ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 right-0 w-1/2 bg-[var(--bg-subtle)]"
                />
              ) : null}
              {isEnd && start !== null ? (
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1/2 bg-[var(--bg-subtle)]"
                />
              ) : null}
              <button
                ref={(el) => {
                  if (el) dayRefs.current.set(key, el);
                  else dayRefs.current.delete(key);
                }}
                type="button"
                tabIndex={isFocused ? 0 : -1}
                disabled={unavailable}
                aria-label={`${WEEKDAY_LABELS[new Date(year, month - 1, day).getDay()]}, ${MONTH_NAMES[month - 1]} ${day}, ${year}${
                  unavailable ? ", unavailable" : ""
                }${isStart ? ", check-in" : ""}${isEnd ? ", checkout" : ""}`}
                aria-selected={selected || undefined}
                aria-disabled={unavailable || undefined}
                onClick={() => onSelect(key)}
                onFocus={() => onFocusDay(key)}
                className={[
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-[14px] transition-colors",
                  dayFocusClass,
                  unavailable
                    ? "cursor-default text-[var(--border-strong)]"
                    : "text-[var(--fg)] hover:border hover:border-[var(--fg)]",
                  isStart || isEnd
                    ? "bg-[var(--fg)] font-semibold text-white hover:border-transparent"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { stay } = listing;
  const [monthOffset, setMonthOffset] = useState(0);
  const [checkIn, setCheckIn] = useState<string | null>(stay.checkIn);
  const [checkOut, setCheckOut] = useState<string | null>(stay.checkOut);
  const [selecting, setSelecting] = useState<"in" | "out">("in");
  const [keyboardMode, setKeyboardMode] = useState(false);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());

  const base = stay.months[0];
  const left = addMonths(base.year, base.month, monthOffset);
  const right = addMonths(base.year, base.month, monthOffset + 1);

  const defaultFocus =
    checkIn ?? toKey(left.year, left.month, 1);
  const [focusKey, setFocusKey] = useState<string | null>(defaultFocus);

  const nights =
    checkIn && checkOut ? nightsBetween(checkIn, checkOut) : null;
  const rangeLabel = formatRangeLabel(checkIn, checkOut);

  const title = useMemo(() => {
    if (nights && nights > 0) {
      return `${nights} nights in ${stay.location}`;
    }
    if (checkIn && !checkOut) return "Select checkout date";
    return "Select check-in date";
  }, [nights, checkIn, checkOut, stay.location]);

  const onSelect = useCallback(
    (key: string) => {
      if (UNAVAILABLE.has(key)) return;

      if (!checkIn || (checkIn && checkOut) || selecting === "in") {
        setCheckIn(key);
        setCheckOut(null);
        setSelecting("out");
        setFocusKey(key);
        return;
      }

      const inTime = new Date(checkIn + "T00:00:00").getTime();
      const pickTime = new Date(key + "T00:00:00").getTime();
      if (pickTime <= inTime) {
        setCheckIn(key);
        setCheckOut(null);
        setSelecting("out");
      } else {
        setCheckOut(key);
        setSelecting("in");
      }
      setFocusKey(key);
    },
    [checkIn, checkOut, selecting],
  );

  const moveFocus = useCallback(
    (from: string, dayDelta: number) => {
      const { year, month, day } = parseKey(from);
      const next = new Date(year, month - 1, day + dayDelta);
      const key = toKey(
        next.getFullYear(),
        next.getMonth() + 1,
        next.getDate(),
      );
      setFocusKey(key);
      // Ensure the focused month is visible in the two-month window.
      const leftIndex = left.year * 12 + left.month;
      const rightIndex = right.year * 12 + right.month;
      const keyIndex = next.getFullYear() * 12 + (next.getMonth() + 1);
      if (keyIndex < leftIndex) setMonthOffset((o) => o - 1);
      if (keyIndex > rightIndex) setMonthOffset((o) => o + 1);
      requestAnimationFrame(() => dayRefs.current.get(key)?.focus());
    },
    [left.year, left.month, right.year, right.month],
  );

  const onGridKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!focusKey) return;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          moveFocus(focusKey, -1);
          break;
        case "ArrowRight":
          event.preventDefault();
          moveFocus(focusKey, 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveFocus(focusKey, -7);
          break;
        case "ArrowDown":
          event.preventDefault();
          moveFocus(focusKey, 7);
          break;
        case "Home":
          event.preventDefault();
          {
            const { year, month } = parseKey(focusKey);
            const key = toKey(year, month, 1);
            setFocusKey(key);
            requestAnimationFrame(() => dayRefs.current.get(key)?.focus());
          }
          break;
        case "End":
          event.preventDefault();
          {
            const { year, month } = parseKey(focusKey);
            const last = new Date(year, month, 0).getDate();
            const key = toKey(year, month, last);
            setFocusKey(key);
            requestAnimationFrame(() => dayRefs.current.get(key)?.focus());
          }
          break;
        case "PageUp":
          event.preventDefault();
          setMonthOffset((o) => o - 1);
          break;
        case "PageDown":
          event.preventDefault();
          setMonthOffset((o) => o + 1);
          break;
        default:
          break;
      }
    },
    [focusKey, moveFocus],
  );

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
    setSelecting("in");
  };

  return (
    <section
      id="availability"
      className="scroll-mt-24 border-b border-[var(--border)] py-12"
      aria-labelledby="calendar-heading"
    >
      <h2
        id="calendar-heading"
        className="text-[22px] font-medium leading-[26px] text-[var(--fg)]"
      >
        {title}
      </h2>
      <p
        className="mt-2 text-[14px] font-normal leading-[18px] text-[var(--fg-secondary)]"
        aria-live="polite"
      >
        {rangeLabel ?? "Add your travel dates for exact pricing"}
      </p>

      {keyboardMode ? (
        <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--fg)]">
            Check-in
            <input
              type="date"
              value={checkIn ?? ""}
              onChange={(e) => {
                setCheckIn(e.target.value || null);
                setCheckOut(null);
                setSelecting("out");
              }}
              className={`rounded-lg border border-[var(--border-strong)] px-3 py-2 text-[14px] font-normal normal-case tracking-normal text-[var(--fg)] ${dayFocusClass}`}
            />
          </label>
          <label className="flex flex-col gap-1 text-[12px] font-semibold uppercase tracking-wide text-[var(--fg)]">
            Checkout
            <input
              type="date"
              value={checkOut ?? ""}
              min={checkIn ?? undefined}
              onChange={(e) => {
                setCheckOut(e.target.value || null);
                setSelecting("in");
              }}
              className={`rounded-lg border border-[var(--border-strong)] px-3 py-2 text-[14px] font-normal normal-case tracking-normal text-[var(--fg)] ${dayFocusClass}`}
            />
          </label>
        </div>
      ) : (
        <div
          className="relative mt-8"
          onKeyDown={onGridKeyDown}
        >
          <div className="flex items-start gap-10">
            <div className="relative min-w-0 flex-1 pl-10">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setMonthOffset((o) => o - 1)}
                className={`absolute left-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] ${dayFocusClass}`}
              >
                <Icon name="chev-left" className="h-3.5 w-3.5" />
              </button>
              <MonthGrid
                year={left.year}
                month={left.month}
                checkIn={checkIn}
                checkOut={checkOut}
                focusKey={focusKey}
                onSelect={onSelect}
                onFocusDay={setFocusKey}
                dayRefs={dayRefs}
              />
            </div>

            <div className="relative min-w-0 flex-1 pr-10">
              <button
                type="button"
                aria-label="Next month"
                onClick={() => setMonthOffset((o) => o + 1)}
                className={`absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] ${dayFocusClass}`}
              >
                <Icon name="chev-right" className="h-3.5 w-3.5" />
              </button>
              <MonthGrid
                year={right.year}
                month={right.month}
                checkIn={checkIn}
                checkOut={checkOut}
                focusKey={focusKey}
                onSelect={onSelect}
                onFocusDay={setFocusKey}
                dayRefs={dayRefs}
              />
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          aria-label={
            keyboardMode
              ? "Switch to calendar view"
              : "Switch to keyboard date entry"
          }
          aria-pressed={keyboardMode}
          onClick={() => setKeyboardMode((v) => !v)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-strong)] text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] ${dayFocusClass}`}
        >
          <KeyboardIcon />
        </button>

        <button
          type="button"
          onClick={clearDates}
          disabled={!checkIn && !checkOut}
          className={`rounded-full border border-[var(--fg)] px-4 py-2 text-[14px] font-medium text-[var(--fg)] transition-colors hover:bg-[var(--bg-subtle)] disabled:cursor-default disabled:opacity-40 ${dayFocusClass}`}
        >
          Clear dates
        </button>
      </div>
    </section>
  );
}
