package com.palmyralabs.dms.demo.generator.util;

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
