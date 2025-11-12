package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;
import com.palmyralabs.dms.jpa.repository.FixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileFixedStampRepo;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.jpa.repository.PolicyRepository;
import com.palmyralabs.dms.model.PolicyStampPositionModel;
import com.palmyralabs.dms.model.PolicyStampRequest;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.common.MultipartFileSender;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

	private final FixedStampRepo fixedStampRepo;
	private final PolicyRepository policyRepository;
	private final SyncFileServiceImpl syncFileService;
	private final PolicyFileRepository policyFileRepository;
	private final PolicyFileFixedStampRepo pFixedStampRepo;
	private final String inputExtension = ".tif";
	private final ObjectMapper mapper;

	public void download(HttpServletRequest request, HttpServletResponse response, String code) throws IOException {
		String stampName = code;
		Optional<FixedStampEntity> stampEntity = fixedStampRepo.findByCode(stampName);
		if(stampEntity.isEmpty()) {
			throw new InvaidInputException("INV001", "stamp not found");
		}
		String fileName = stampName + inputExtension;
		String startDir = System.getProperty("user.dir");
		String folderName = findParentFolderName(new File(startDir), fileName);
		Path finalPath = Paths.get(folderName, fileName);
		ClassLoader classLoader = getClass().getClassLoader();

		try (InputStream is = classLoader.getResourceAsStream(finalPath.toString())) {
			if (is == null) {
				throw new IOException("stamp not found");
			}

			Path tempFile = Files.createTempFile(stampName, inputExtension);
			Files.copy(is, tempFile, StandardCopyOption.REPLACE_EXISTING);

			log.info("Serving stamp file {} from temp location {}", fileName, tempFile.toString());
			MultipartFileSender.fromPath(tempFile).setFileName(fileName).with(request).with(response).serveResource();
			response.setStatus(HttpStatus.FOUND.value());
			tempFile.toFile().deleteOnExit();
		} catch (IOException e) {
			log.error("Error while serving stamp file {}: {}", fileName, e.getMessage());
			response.setStatus(HttpStatus.NOT_FOUND.value());
			throw e;
		}
	}

	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId,
			PolicyStampRequest model) {

		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<PolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber());
			String fileName = file.getOriginalFilename();
			String objectUrl = String.join("/", folder, file.getOriginalFilename());

			PolicyFileEntity policyFileEntity = getPolicyFileEntity(objectUrl);
			List<PolicyFileFixedStampEntity> policyFileFixedStampEntities = validateStampInfo(policyFileEntity,model);
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				log.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			} catch (Exception e) {
				log.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(), e);
				throw new InvaidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			pFixedStampRepo.saveAll(policyFileFixedStampEntities);
			updatePolicyFile(fileName, file, policyId, objectUrl, docketTypeId, policyFileEntity);
			return "success";
		} else {
			throw new DataNotFoundException("INV012", "policy record not found");
		}
	}
	
	private List<PolicyFileFixedStampEntity> validateStampInfo(PolicyFileEntity policyFileEntity, PolicyStampRequest model) {
		List<PolicyStampPositionModel> stampList = model.getStamp();
		if (!policyFileEntity.getId().equals(model.getPolicyFileId())) {
			throw new InvaidInputException("INV001", "file record mismatch");
		}
		if (stampList.size() == 0) {
			throw new InvaidInputException("INV001", "stamp is empty");
		}
		List<PolicyFileFixedStampEntity> policyFileFixedStampEntities = new ArrayList<PolicyFileFixedStampEntity>();
		for (PolicyStampPositionModel stamp : stampList) {
			PolicyFileFixedStampEntity entity = new PolicyFileFixedStampEntity();
			Optional<PolicyFileFixedStampEntity> optPolicyStamp = getPolicyAndStampEntity(model.getPolicyFileId(),
					stamp.getId());
			if (optPolicyStamp.isPresent()) {
				throw new InvaidInputException("INV001", "stamp already exists");
			}
			entity.setPolicyFile(model.getPolicyFileId());
			entity.setStamp(stamp.getId());
			entity.setPosition(getPosition(stamp));
			policyFileFixedStampEntities.add(entity);
		}
		return policyFileFixedStampEntities;
	}
	
	private String getPosition(PolicyStampPositionModel model){
		ObjectWriter writer = mapper.writerFor(PolicyStampPositionModel.class);
		String position = "";
		try {
		    position = writer.writeValueAsString(model); 
		}catch(Exception e) {
			log.error("error while convert class {} to String", model, e.getMessage());
		}
		return position;
	}

	private void updatePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId, PolicyFileEntity fileEntity) {
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		policyFileRepository.save(fileEntity);
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

	private PolicyFileEntity getPolicyFileEntity(String objectUrl) {
		return policyFileRepository.findByObjectUrl(objectUrl)
				.orElseThrow(() -> new InvaidInputException("INV001", "file record not found"));
	}

	private Optional<PolicyFileFixedStampEntity> getPolicyAndStampEntity(Long policyFile, Long stamp) {
		return pFixedStampRepo.findByPolicyFileAndStamp(policyFile, stamp);
	}

}
