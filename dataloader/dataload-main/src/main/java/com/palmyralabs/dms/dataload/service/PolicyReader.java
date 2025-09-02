package com.palmyralabs.dms.dataload.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.palmyralabs.dms.dataload.model.PolicyModel;

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
		int end = l/2 ;
		
		sb.append("\r\n").append(secondLine.substring(0, end));

		return sb.toString();
	}

	private PolicyModel extractPolicy(Map<String, String> record) {

		String boxNumber = record.get("Box Number");
		String customerDob = record.get("DOB");
		String branchCode = record.get("Branch Code");
		String doc = record.get("DOC");
		String divisionCode = record.get("Division Code");
		String policyNumber = record.get("Policy Number");
		String batchNumber = record.get("Batch Number");
		String customerName = record.get("Name");
		String uploadLabel = record.get("Upload Label");

		PolicyModel model = new PolicyModel();
		model.setBoxNumber(boxNumber);
		model.setCustomerDob(customerDob);
		model.setCustomerId(policyNumber);
		model.setBranchCode(branchCode);
		model.setDoc(doc);
		model.setDivisionCode(Long.parseLong(divisionCode));
		model.setPolicyNumber(Integer.parseInt(policyNumber));
		model.setBatchNumber(batchNumber);
		model.setCustomerName(customerName);
		model.setUploadLabel(uploadLabel);
		model.setRmsStatus(1);
		model.setPolicyStatus(1);
		return model;
	}

}
