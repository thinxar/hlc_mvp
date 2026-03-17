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
		int end = l;

		sb.append("\r\n").append(secondLine.substring(0, end));

		return sb.toString();
	}

	private PolicyModel extractPolicy(Map<String, String> record) {

		String policyNumber = record.get("Policy Number");
		String docType = record.get("Doc Type");
		String docSubType = record.get("Doc Sub Type");
		String srNo = record.get("SR No");
		String asrNo = record.get("ASR No");
		String soCode = record.get("SO Code");
		String doCode = record.get("DO Code");
		String dateOfSubmission = record.get("Date Of Submission");
		String uploadedBy = record.get("Uploaded By");
		String boCode = record.get("BO Code");

		PolicyModel model = new PolicyModel();

		model.setPolicyNumber(Integer.parseInt(policyNumber));
		model.setDocType(docType);
		model.setDocSubType(docSubType);
		model.setSrNo(srNo);
		model.setAsrNo(asrNo);
		model.setSoCode(soCode);
		model.setDoCode(doCode);
		model.setDateOfSubmission(dateOfSubmission);
		model.setUploadedBy(uploadedBy);
		model.setBoCode(boCode);
		return model;
	}

}
