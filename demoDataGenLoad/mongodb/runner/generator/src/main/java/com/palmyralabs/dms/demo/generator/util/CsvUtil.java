package com.palmyralabs.dms.demo.generator.util;

import java.util.ArrayList;
import java.util.List;

/**
 * Hand-rolled RFC4180-ish CSV parser + writer. Matches the Node.js
 * {@code parseCsv} / {@code csvCell} exactly:
 *
 * <ul>
 *   <li>Strips UTF-8 BOM from the start of input.</li>
 *   <li>Handles quoted fields with doubled-quote escapes ("").</li>
 *   <li>Tolerates newlines INSIDE quoted fields (branch names in the source
 *       CSV occasionally span two lines).</li>
 *   <li>Drops fully-blank rows (every cell trims to empty).</li>
 *   <li>On write, quotes cells containing {@code ","}, {@code "\""}, {@code "\r"}, or {@code "\n"}.</li>
 * </ul>
 */
public final class CsvUtil {
    private CsvUtil() {}

    /** Parse CSV text into rows of cells. Never returns null; drops blank rows. */
    public static List<List<String>> parse(String text) {
        if (text == null || text.isEmpty()) return new ArrayList<>();
        // strip BOM
        if (text.charAt(0) == 0xFEFF) text = text.substring(1);

        List<List<String>> rows = new ArrayList<>();
        List<String> row = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (inQuotes) {
                if (c == '"') {
                    if (i + 1 < text.length() && text.charAt(i + 1) == '"') {
                        field.append('"');
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field.append(c);
                }
            } else {
                if (c == '"') {
                    inQuotes = true;
                } else if (c == ',') {
                    row.add(field.toString());
                    field.setLength(0);
                } else if (c == '\r') {
                    // skip
                } else if (c == '\n') {
                    row.add(field.toString());
                    rows.add(row);
                    row = new ArrayList<>();
                    field.setLength(0);
                } else {
                    field.append(c);
                }
            }
        }
        if (field.length() > 0 || !row.isEmpty()) {
            row.add(field.toString());
            rows.add(row);
        }

        // Drop rows where every cell is whitespace-only (matches JS filter).
        List<List<String>> cleaned = new ArrayList<>(rows.size());
        for (List<String> r : rows) {
            if (r.isEmpty()) continue;
            boolean anyContent = false;
            for (String v : r) {
                if (v != null && !v.trim().isEmpty()) { anyContent = true; break; }
            }
            if (anyContent) cleaned.add(r);
        }
        return cleaned;
    }

    /** Quote-and-escape a single CSV cell. */
    public static String cell(Object v) {
        String s = (v == null) ? "" : v.toString();
        boolean needsQuote = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == ',' || c == '"' || c == '\r' || c == '\n') { needsQuote = true; break; }
        }
        if (!needsQuote) return s;
        StringBuilder sb = new StringBuilder(s.length() + 2);
        sb.append('"');
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '"') sb.append("\"\"");
            else sb.append(c);
        }
        sb.append('"');
        return sb.toString();
    }

    /**
     * Whitespace-normalize a text cell: replace any CR/LF + runs of whitespace
     * with a single space, then trim. Same rule used in every Node script.
     */
    public static String cleanWs(String s) {
        if (s == null) return "";
        StringBuilder out = new StringBuilder(s.length());
        boolean lastWasSpace = false;
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            // Treat any whitespace character (including \r \n \t) as a single space.
            if (Character.isWhitespace(c)) {
                if (!lastWasSpace) {
                    out.append(' ');
                    lastWasSpace = true;
                }
            } else {
                out.append(c);
                lastWasSpace = false;
            }
        }
        // Trim manually (output may have leading / trailing single space).
        int start = 0, end = out.length();
        while (start < end && out.charAt(start) == ' ') start++;
        while (end > start && out.charAt(end - 1) == ' ') end--;
        return out.substring(start, end);
    }

    /** canon(x) = drop every non-alphanumeric char, uppercase the rest. */
    public static String canon(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if ((c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')) {
                sb.append(c);
            } else if (c >= 'a' && c <= 'z') {
                sb.append((char) (c - 'a' + 'A'));
            }
        }
        return sb.toString();
    }
}
