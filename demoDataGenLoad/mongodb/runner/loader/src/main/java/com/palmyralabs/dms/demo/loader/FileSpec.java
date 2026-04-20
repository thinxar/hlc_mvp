package com.palmyralabs.dms.demo.loader;

import java.util.Arrays;

/**
 * One row of the load plan. Mirrors the nested class in
 * {@code MongoDataLoader}: filename on disk, destination collection,
 * the unique-key field(s) used for upsert + index, the ISO-date fields to
 * normalize to BSON Date at UTC midnight, and a JSONL flag.
 */
public final class FileSpec {
    private static final String[] NONE = new String[0];

    public final String fileName;
    public final String collection;
    public final String[] keyFields;
    public final String[] dateFields;
    public final boolean jsonl;

    public FileSpec(String fileName, String collection, String[] keyFields, String[] dateFields, boolean jsonl) {
        this.fileName = fileName;
        this.collection = collection;
        this.keyFields = keyFields;
        this.dateFields = (dateFields == null) ? NONE : dateFields;
        this.jsonl = jsonl;
    }

    @Override
    public String toString() {
        return fileName + " -> " + collection
                + " key=" + Arrays.toString(keyFields)
                + " dates=" + Arrays.toString(dateFields);
    }
}
