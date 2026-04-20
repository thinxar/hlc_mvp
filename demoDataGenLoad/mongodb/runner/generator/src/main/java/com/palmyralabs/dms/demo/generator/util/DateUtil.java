package com.palmyralabs.dms.demo.generator.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * LocalDate helpers that match the Node.js iso-string math. All I/O is
 * YYYY-MM-DD strings; internal computation uses {@link LocalDate}.
 */
public final class DateUtil {
    private DateUtil() {}

    public static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE;

    public static LocalDate parseIso(String s) { return LocalDate.parse(s, ISO); }

    public static String fmt(LocalDate d) { return d.format(ISO); }

    public static String addDays(String iso, int days) {
        return fmt(parseIso(iso).plusDays(days));
    }

    public static int daysBetween(String a, String b) {
        return (int) (parseIso(b).toEpochDay() - parseIso(a).toEpochDay());
    }

    public static String firstOfMonth(String iso) {
        return iso.substring(0, 7) + "-01";
    }

    public static String addMonthsToFirst(String firstIso, int months) {
        LocalDate d = parseIso(firstIso).plusMonths(months);
        return fmt(d.withDayOfMonth(1));
    }

    public static String lastOfMonth(String firstIso) {
        return fmt(parseIso(firstIso).withDayOfMonth(1).plusMonths(1).minusDays(1));
    }

    // ---------- weekend helpers ----------

    public static boolean isWeekend(String iso) {
        DayOfWeek dow = parseIso(iso).getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    public static boolean isSunday(String iso) {
        return parseIso(iso).getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    /** Sat→Mon(+2), Sun→Mon(+1), else no-op. */
    public static String nextWeekday(String iso) {
        LocalDate d = parseIso(iso);
        DayOfWeek dow = d.getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY) return fmt(d.plusDays(2));
        if (dow == DayOfWeek.SUNDAY) return fmt(d.plusDays(1));
        return iso;
    }

    /** Sat→Fri(-1), Sun→Fri(-2), else no-op. */
    public static String prevWeekday(String iso) {
        LocalDate d = parseIso(iso);
        DayOfWeek dow = d.getDayOfWeek();
        if (dow == DayOfWeek.SATURDAY) return fmt(d.minusDays(1));
        if (dow == DayOfWeek.SUNDAY) return fmt(d.minusDays(2));
        return iso;
    }

    /** Sun→Mon(+1), else no-op. */
    public static String nextNonSunday(String iso) {
        if (parseIso(iso).getDayOfWeek() == DayOfWeek.SUNDAY) return addDays(iso, 1);
        return iso;
    }

    /** Sun→Sat(-1), else no-op. */
    public static String prevNonSunday(String iso) {
        if (parseIso(iso).getDayOfWeek() == DayOfWeek.SUNDAY) return addDays(iso, -1);
        return iso;
    }

    /** Zero-pad to width digits. */
    public static String pad(long v, int width) {
        String s = Long.toString(v);
        if (s.length() >= width) return s;
        StringBuilder sb = new StringBuilder(width);
        for (int i = s.length(); i < width; i++) sb.append('0');
        sb.append(s);
        return sb.toString();
    }
}
