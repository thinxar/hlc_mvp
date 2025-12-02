package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
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

	private final PolicyFileAttachmentService policyFileService;
	private final DocumentTypeRepository docketTypeRepo;

	private String inputExtension = ".txt";
	private String outputExtension = ".html";

	public String createEndorsement(EndorsementRequest request, Integer policyId, String code) throws IOException {
		String endorsementSubtype = request.getEndorsementSubType();
		if (endorsementSubtype == null || endorsementSubtype.isEmpty()) {
			throw new InvaidInputException("INV012", "endorsementSubType is empty");
		}
		String fileName = endorsementSubtype + inputExtension;
		String startDir = System.getProperty("user.dir");
		String folderName = findParentFolderName(new File(startDir), fileName);
		Path finalPath = Paths.get(folderName, fileName);

		ClassLoader classLoader = getClass().getClassLoader();
		try (InputStream is = classLoader.getResourceAsStream(finalPath.toString())) {
			if (is == null) {
				throw new IOException(fileName + " not found in classpath under" + folderName);
			}

			String content = new String(is.readAllBytes(), StandardCharsets.ISO_8859_1);

			Map<String, Object> formDataMap = processFormData(request.getFormData());
			StringBuffer sb = setFormDataValues(content, formDataMap);
			String htmlFileName = endorsementSubtype + outputExtension;
			byte[] fileContent = sb.toString().getBytes();

			MultipartFile multipartFile = new MockMultipartFile(htmlFileName, htmlFileName, "text/html", fileContent);
			DocumentTypeEntity docketTypeEntity = getDocumentTypeEntity(code);
			Integer docketTypeId = docketTypeEntity.getId().intValue();
			policyFileService.upload(multipartFile, policyId, docketTypeId);

			return "file uploaded successfully";
		} catch (Exception e) {
			throw new IOException(e);
		}
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

	private StringBuffer setFormDataValues(String content, Map<String, Object> formDataMap) {
		Pattern pattern = Pattern.compile("%%(\\w+)%%");
		Matcher matcher = pattern.matcher(content);
		StringBuffer sb = new StringBuffer();
		while (matcher.find()) {
			String placeholder = matcher.group(1).toLowerCase();
			Object value = formDataMap.getOrDefault(placeholder, "");
			matcher.appendReplacement(sb, "<b>" + value + "</b>");
		}
		matcher.appendTail(sb);
		return sb;
	}


	public String findParentFolderName(File dir, String fileName) {
		File[] files = dir.listFiles();
		if (files == null)
			return null;

		for (File file : files) {
			if (file.isDirectory()) {
				String result = findParentFolderName(file, fileName);
				if (result != null)
					return result;
			} else if (file.getName().equalsIgnoreCase(fileName)) {
				return file.getParentFile().getName();
			}
		}
		return null;
	}

	private DocumentTypeEntity getDocumentTypeEntity(String code) {
		return docketTypeRepo.findByCode(code)
				.orElseThrow(() -> new InvaidInputException("INV001", "docketType not found"));
	}

}
