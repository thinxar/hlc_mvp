package com.palmyralabs.dms.dataload.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.palmyralabs.dms.dataload.model.PolicyModel;
import com.palmyralabs.dms.dataload.model.UidAdvReference;

@Service
public class PolicyReader {

	public PolicyModel parseCsv(File file) {
		try (BufferedReader br = new BufferedReader(
				new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
			String firstLine = br.readLine();
			String secondLine = br.readLine();
			if (null == firstLine || null == secondLine)
				return null;

			String correctedCSV = extract(firstLine, secondLine);

			CsvMapper mapper = new CsvMapper();
			CsvSchema schema = CsvSchema.emptySchema().withHeader().withQuoteChar('"');

			Map<String, String> values = mapper.readerFor(Map.class).with(schema).readValue(correctedCSV);

			return extractPolicy(values);
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
		}
	}

	private String extract(String firstLine, String secondLine) {
		String[] labels = firstLine.split(",");

		StringBuilder sb = new StringBuilder();

		String firstLabel = labels[0].trim();
		sb.append(firstLabel);

		for (int i = 1; i < labels.length; i++) {
			String label = labels[i].trim();

			if (label.endsWith(firstLabel)) {
				i = labels.length - 2;
				continue;
			}
			sb.append(",");
			sb.append(label);
		}

		int l = secondLine.length();
		int end = l;

		sb.append("\r\n").append(secondLine.substring(0, end));

		return sb.toString();
	}

	private PolicyModel extractPolicy(Map<String, String> record) {

	    String policyNumber = record.get("Policy Number");
	    String uidStr       = record.get("UID");
	    String advRefStr    = record.get("ADV Reference Number");
	    PolicyModel model = new PolicyModel();
	    model.setPolicyNumber(Integer.parseInt(policyNumber.trim()));

	    List<UidAdvReference> mappings = new ArrayList<>();
	    boolean hasUids    = uidStr    != null && !uidStr.trim().isEmpty();
	    boolean hasAdvRefs = advRefStr != null && !advRefStr.trim().isEmpty();
	    if (hasUids && hasAdvRefs) {
	        String[] uidArr      = uidStr.trim().split("\\|");
	        String[] advGroupArr = advRefStr.trim().split("\\|");
	        if (uidArr.length != advGroupArr.length) {
	            throw new RuntimeException(
	                "UID and ADV Reference group count mismatch for policy " + policyNumber
	                + " (uids=" + uidArr.length + ", advGroups=" + advGroupArr.length + ")");
	        }
	        for (int i = 0; i < uidArr.length; i++) {
	            UidAdvReference ref = new UidAdvReference();
	            ref.setUid(Integer.parseInt(uidArr[i].trim()));

	            String[] advNumbers = advGroupArr[i].split(":");
	            List<Long> advList = new ArrayList<>(advNumbers.length);
	            for (String adv : advNumbers) {
	                advList.add(Long.parseLong(adv.trim()));
	            }
	            ref.setAdvReferenceNumbers(advList);
	            mappings.add(ref);
	        }
	    } else if (hasUids ^ hasAdvRefs) {
	        throw new RuntimeException(
	            "Policy " + policyNumber + " has UID but no ADV Reference Number (or vice versa)");
	    }
	    model.setUidAdvreference(mappings);
	    return model;
	}

}
