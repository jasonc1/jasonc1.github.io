// One date format across the site: three-letter uppercase month, four-digit
// year, arrow between the ends of a range — AUG 2024 → SEP 2025.
//
// Applied at render time rather than by rewriting every literal, so the stored
// strings stay readable and any future date is normalised automatically,
// whichever of the half-dozen shapes already in the codebase it is written in
// ("Sept 2020", "September 2025", "March 2020 - Present", "Oct 2021 - Sep 2022").

const MONTHS: Record<string, string> = {
  january: "JAN",
  february: "FEB",
  march: "MAR",
  april: "APR",
  may: "MAY",
  june: "JUN",
  july: "JUL",
  august: "AUG",
  september: "SEP",
  october: "OCT",
  november: "NOV",
  december: "DEC",
  jan: "JAN",
  feb: "FEB",
  mar: "MAR",
  apr: "APR",
  jun: "JUN",
  jul: "JUL",
  aug: "AUG",
  sep: "SEP",
  sept: "SEP",
  oct: "OCT",
  nov: "NOV",
  dec: "DEC",
};

export const formatDateRange = (input: string): string =>
  input
    .replace(
      /\b[A-Za-z]{3,9}\b/g,
      (word) => MONTHS[word.toLowerCase()] ?? word
    )
    .replace(/\bpresent\b/gi, "PRESENT")
    // Only a dash with space on both sides joins a range; nothing else in these
    // strings uses one, and this leaves hyphenated words alone.
    .replace(/\s+[-–—]\s+/g, " → ");

export default formatDateRange;
