package com.palmyralabs.dms.demo.generator.model;

/**
 * Document status enum for revival request documents.
 * Wire values are lowercase strings matching the MongoDB schema.
 */
public enum DocStatus {
    ACCEPTED("accepted"),
    REJECTED("rejected"),
    PENDING("pending");

    private final String value;

    DocStatus(String value) { this.value = value; }

    public String value() { return value; }

    public boolean is(String s) { return value.equals(s); }

    @Override
    public String toString() { return value; }
}
