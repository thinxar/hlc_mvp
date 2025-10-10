package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.DocumentTypeEntity;
import com.palmyralabs.dms.jpa.repository.DocumentTypeRepository;
import com.palmyralabs.dms.model.EndorsementRequest;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class EndorsementService {

	private final PolicyFileService policyFileService;
	private final DocumentTypeRepository docketTypeRepo;

	private final String inputDir = "src/main/resources/Templates/";

	private String inputExtension = ".txt";
	private String outputExtension = ".html";

	public String createEndorsement(EndorsementRequest request, Integer policyId, String code)
			throws IOException {

		String endorsementSubtype = request.getEndorsementSubType();
		if (endorsementSubtype == null || endorsementSubtype.isEmpty()) {
			throw new InvaidInputException("INV012","endorsementSubType is empty");
		}
		File templateFile = findTemplateFile(new File(inputDir), endorsementSubtype + inputExtension);
		if (templateFile == null) {
			throw new IOException(endorsementSubtype+" not found in dir: " +inputDir);
		}
		String content = new String(Files.readAllBytes(templateFile.toPath()));
		Map<String, Object>formDataMap = processFormData(request.getFormData());
		Pattern pattern = Pattern.compile("%%(\\w+)%%");
		Matcher matcher = pattern.matcher(content);
		StringBuffer sb = new StringBuffer();

		while (matcher.find()) {
			String placeholder = matcher.group(1).toLowerCase();
			Object value = formDataMap.getOrDefault(placeholder, "");
			matcher.appendReplacement(sb, "<b>" + value + "</b>");
		}
		matcher.appendTail(sb);
		String fileName = endorsementSubtype + outputExtension;
		byte[] fileContent = sb.toString().getBytes();
		MultipartFile multipartFile = new MockMultipartFile(fileName, fileName, "text/html", fileContent);

		DocumentTypeEntity docketTypeEntity = getDocumentTypeEntity(code);
		Integer docketTypeId =docketTypeEntity.getId().intValue();
		
		policyFileService.upload(multipartFile, policyId, docketTypeId);
		return "file uploaded successfully";
	}

	private File findTemplateFile(File dir, String fileName) {
		if (!dir.exists() || !dir.isDirectory())
			return null;
		for (File file : dir.listFiles()) {
			if (file.isDirectory()) {
				File found = findTemplateFile(file, fileName);
				if (found != null)
					return found;
			} else if (file.getName().equalsIgnoreCase(fileName)) {
				return file;
			}
		}
		return null;
	}
	private Map<String, Object> processFormData(Object jsonObj) {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> jsonMap = mapper.convertValue(jsonObj, new TypeReference<Map<String, Object>>() {
		});

		Map<String, Object> lowerCaseMap = new HashMap<>();
		for (Map.Entry<String, Object> entry : jsonMap.entrySet()) {
			String key = entry.getKey().toLowerCase();
			Object value = entry.getValue();

			if (value == null || value.toString().trim().isEmpty()) {
				lowerCaseMap.put(key, "--");
			} else {
				lowerCaseMap.put(key, value);
			}
		}
		return lowerCaseMap;
	}
	
	private DocumentTypeEntity getDocumentTypeEntity(String code) {
		return docketTypeRepo.findByCode(code)
				.orElseThrow(() -> new InvaidInputException("INV001", "docketType not found"));
	}

}
