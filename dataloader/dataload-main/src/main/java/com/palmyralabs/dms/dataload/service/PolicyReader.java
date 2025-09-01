package com.palmyralabs.dms.dataload.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.dataload.model.PolicyModel;

@Service
public class PolicyReader {

	public PolicyModel parseCsv(File file) {
		try (BufferedReader br = new BufferedReader(
				new InputStreamReader(new FileInputStream(file), StandardCharsets.UTF_8))) {
			String line;
			boolean isFirstLine = true;
			while ((line = br.readLine()) != null) {
				if (isFirstLine) {
					isFirstLine = false;
					continue;
				}

				String[] values = line.split(",");
				return extractPolicy(values);
			}
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse CSV file: " + e.getMessage());
		}
		return null;
	}

	private PolicyModel extractPolicy(String[] values) {
		String boxNumber = values[0].trim();
		String customerDob = values[1].trim();
		String brachCode = values[2].trim();
		String doc = values[3].trim();
		String divisionCode = values[4].trim();
		String policyNumber = values[5].trim();
		String batchNumber = values[6].trim();
		String customerName = values[7].trim();
		String uploadLabel = values[values.length - 1];

		PolicyModel model = new PolicyModel();
		model.setBoxNumber(boxNumber);
		model.setCustomerDob(LocalDate.parse(customerDob));
		model.setCustomerId(policyNumber);
		model.setBranchCode(brachCode);
		model.setDoc(LocalDate.parse(doc));
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
