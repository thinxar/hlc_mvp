package com.palmyralabs.dms.dataload.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class PolicyCsvGenerator {

	private static final String HEADER = "Policy Number,UID,ADV Reference Number";

	public GenerationSummary generate(Path masterCsvPath, Path policyBaseFolder) {
		log.info("generating policy CSVs from master {}", masterCsvPath);

		if (!Files.exists(masterCsvPath)) {
			log.error("master CSV not found at {} - skipping policy CSV generation", masterCsvPath);
			return new GenerationSummary(0, 0, 0, 0);
		}

		try {
			Files.createDirectories(policyBaseFolder);
		} catch (IOException e) {
			log.error("failed to create policy base folder {} - {}", policyBaseFolder, e.getMessage());
			return new GenerationSummary(0, 0, 0, 0);
		}

		Map<String, Map<String, List<String>>> policyMap = readMaster(masterCsvPath);

		int foldersCreated = 0;
		int filesWritten = 0;
		int failures = 0;

		for (Map.Entry<String, Map<String, List<String>>> entry : policyMap.entrySet()) {
			String policyNumber = entry.getKey();
			Map<String, List<String>> uidGroup = entry.getValue();

			Path folderPath = policyBaseFolder.resolve(policyNumber);
			try {
				if (!Files.exists(folderPath)) {
					Files.createDirectories(folderPath);
					foldersCreated++;
					log.info("created policy folder {}", policyBaseFolder.relativize(folderPath));
				}

				Path csvPath = folderPath.resolve(policyNumber + ".csv");
				System.out.println("creating policy CSV " + csvPath.getFileName());
				String content = buildCsvContent(policyNumber, uidGroup);
				Files.write(csvPath, content.getBytes(StandardCharsets.UTF_8),
						StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

				filesWritten++;
				log.info("created policy CSV {} for policy {} (uids={}, advRefs={})",
						policyBaseFolder.relativize(csvPath), policyNumber,
						uidGroup.size(), countAdvRefs(uidGroup));
				 System.out.println("completed policy CSV " + csvPath.getFileName());
			} catch (IOException e) {
				failures++;
				log.error("failed to create policy CSV for policy {} - {}", policyNumber, e.getMessage());
			}
		}

		GenerationSummary summary = new GenerationSummary(policyMap.size(), foldersCreated, filesWritten, failures);
		log.info("policy CSV generation complete - policies={}, newFolders={}, csvsWritten={}, failures={}",
				summary.policies, summary.foldersCreated, summary.filesWritten, summary.failures);
		return summary;
	}

	private Map<String, Map<String, List<String>>> readMaster(Path masterCsvPath) {
		Map<String, Map<String, List<String>>> policyMap = new LinkedHashMap<>();

		try (BufferedReader br = Files.newBufferedReader(masterCsvPath, StandardCharsets.UTF_8)) {
			String header = br.readLine(); 
			if (header == null) {
				log.warn("master CSV {} is empty", masterCsvPath);
				return policyMap;
			}

			String line;
			int lineNo = 1;
			while ((line = br.readLine()) != null) {
				lineNo++;
				if (line.trim().isEmpty()) {
					continue;
				}
				String[] parts = line.split(",");
				if (parts.length < 3) {
					log.warn("skipping malformed master CSV line {} - '{}'", lineNo, line);
					continue;
				}
				String policyNumber = parts[0].trim();
				String uid = parts[1].trim();
				String advRef = parts[2].trim();

				policyMap
						.computeIfAbsent(policyNumber, k -> new LinkedHashMap<>())
						.computeIfAbsent(uid, k -> new ArrayList<>())
						.add(advRef);
			}
		} catch (IOException e) {
			log.error("failed to read master CSV {} - {}", masterCsvPath, e.getMessage());
		}

		return policyMap;
	}

	private String buildCsvContent(String policyNumber, Map<String, List<String>> uidGroup) {
		StringBuilder uids = new StringBuilder();
		StringBuilder advs = new StringBuilder();

		boolean first = true;
		for (Map.Entry<String, List<String>> e : uidGroup.entrySet()) {
			if (!first) {
				uids.append('|');
				advs.append('|');
			}
			uids.append(e.getKey());
			advs.append(String.join(":", e.getValue()));
			first = false;
		}

		return HEADER + "\r\n" + policyNumber + ",\"" + uids + "\",\"" + advs + "\"";
	}

	private int countAdvRefs(Map<String, List<String>> uidGroup) {
		int total = 0;
		for (List<String> refs : uidGroup.values()) {
			total += refs.size();
		}
		return total;
	}

	public GenerationSummary generate(String masterCsvPath, String policyBaseFolder) {
		return generate(Paths.get(masterCsvPath), Paths.get(policyBaseFolder));
	}

	public static class GenerationSummary {
		public final int policies;
		public final int foldersCreated;
		public final int filesWritten;
		public final int failures;

		public GenerationSummary(int policies, int foldersCreated, int filesWritten, int failures) {
			this.policies = policies;
			this.foldersCreated = foldersCreated;
			this.filesWritten = filesWritten;
			this.failures = failures;
		}
	}
}
