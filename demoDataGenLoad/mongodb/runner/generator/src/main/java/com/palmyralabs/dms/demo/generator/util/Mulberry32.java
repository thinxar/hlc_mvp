package com.palmyralabs.dms.demo.generator.util;

/**
 * Faithful Java port of the mulberry32 PRNG used by
 * {@code scripts/data_gen/generate_all_cases.js}. Bit-for-bit identical output
 * for a given seed when invoked the same number of times in the same order.
 *
 * <p>The JS implementation:
 * <pre>
 *   function mulberry32(seed) {
 *     return function () {
 *       seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
 *       let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
 *       t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
 *       return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 *     };
 *   }
 * </pre>
 *
 * <p>JS's {@code Math.imul} is 32-bit signed multiplication modulo 2^32 - the
 * Java {@code int} multiplication operator has exactly the same semantics when
 * the result is kept in an {@code int}. {@code | 0} is a no-op on 32-bit ints
 * in Java. {@code >>> } is unsigned right shift, identical in both languages.
 */
public final class Mulberry32 {

    private int state;

    public Mulberry32(int seed) {
        this.state = seed;
    }

    /** Returns a double in [0, 1). Advances internal state. */
    public double nextDouble() {
        state = state + 0x6D2B79F5;                       // (seed + 0x6D2B79F5) | 0
        int t = (state ^ (state >>> 15)) * (1 | state);   // Math.imul(...)
        t = ((t + (t ^ (t >>> 7)) * (61 | t))) ^ t;       // (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        long u = (t ^ (t >>> 14)) & 0xFFFFFFFFL;          // >>> 0 in JS - reinterpret as unsigned
        return (double) u / 4294967296.0;
    }

    /** JS idiom: {@code Math.floor(rng() * n)}; returns [0, n). */
    public int nextIntBelow(int n) {
        return (int) Math.floor(nextDouble() * n);
    }
}
