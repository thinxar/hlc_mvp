package com.palmyralabs.dms.demo.generator.util;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Shared age-band bucketing for ageingSummary and tatPerformance.
 * Bands: 0-5, 6-10, 11-20, 21-30, 31-45, 45+.
 * See specs/aggregation/document_analysis_spec.txt.
 */
public final class AgeBands {

    private AgeBands() {}

    public static int[] create() { return new int[6]; }

    public static void increment(int[] bands, int days) {
        if (days <= 5)       bands[0]++;
        else if (days <= 10) bands[1]++;
        else if (days <= 20) bands[2]++;
        else if (days <= 30) bands[3]++;
        else if (days <= 45) bands[4]++;
        else                 bands[5]++;
    }

    public static Map<String, Object> toMap(int[] bands) {
        Map<String, Object> m = new LinkedHashMap<>(6);
        m.put("d0_5", bands[0]);
        m.put("d6_10", bands[1]);
        m.put("d11_20", bands[2]);
        m.put("d21_30", bands[3]);
        m.put("d31_45", bands[4]);
        m.put("d45plus", bands[5]);
        return m;
    }
}
