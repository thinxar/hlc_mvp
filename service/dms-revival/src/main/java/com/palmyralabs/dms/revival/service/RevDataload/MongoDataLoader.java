package com.palmyralabs.dms.revival.service.RevDataload;

/**
 * Loads the pipeline's generated JSON/JSONL files into the datastore.
 *
 * <p>The original MongoDB bulk-loader implementation is preserved verbatim at
 * claude/service/dms_revival/_mongo_original/MongoDataLoader.java.txt and will be
 * rewritten against Postgres/JPA in a later pass.
 */
// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/MongoDataLoader.java.txt
public final class MongoDataLoader {

	private MongoDataLoader() {
	}

	public static void main(String[] args) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
