package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
import com.palmyralabs.dms.masterdata.model.FixedStampModel;
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

	public void download(HttpServletRequest request, HttpServletResponse response, String code) throws IOException {

		FixedStampEntity stampEntity = getFixedStampEntity(code);
		String stampName = stampEntity.getCode();

		String fileName = stampName + inputExtension;
		String startDir = System.getProperty("user.dir");
		String folderName = findParentFolderName(new File(startDir), fileName);
		String finalPath = folderName + "/" + fileName;
		ClassLoader classLoader = getClass().getClassLoader();

		try (InputStream is = classLoader.getResourceAsStream(finalPath)) {
			if (is == null) {
				throw new IOException("Stamp not found");
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
		List<FixedStampModel> stampList = model.getStamp();

		if (policyOptional.isPresent()) {
			PolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber());
			String fileName = file.getOriginalFilename();
			String objectUrl = String.join("/", folder, file.getOriginalFilename());

			PolicyFileEntity policyFileEntity = getPolicyFileEntity(objectUrl);
			if (!policyFileEntity.getId().equals(model.getPolicyFileId())) {
				throw new InvaidInputException("INV001", "File record not found");
			}
			if (stampList.size() == 0) {
				throw new InvaidInputException("INV001", "stamp is empty");
			}
			saveStampInfo(model);
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				log.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			} catch (Exception e) {
				log.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(), e);
				throw new InvaidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			updatePolicyFile(fileName, file, policyId, objectUrl, docketTypeId, policyFileEntity);
			return "success";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private void updatePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId, PolicyFileEntity fileEntity) {
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId((long) policyId);
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType((long) docketTypeId);
		policyFileRepository.save(fileEntity);
	}

	private void saveStampInfo(PolicyStampRequest model) {
		List<FixedStampModel> stampList = model.getStamp();
		for (FixedStampModel stamp : stampList) {
			savePolicyStamp(stamp, model);
		}
	}

	private void savePolicyStamp(FixedStampModel stamp, PolicyStampRequest model) {
		PolicyFileFixedStampEntity entity = new PolicyFileFixedStampEntity();
		Optional<PolicyFileFixedStampEntity> optPolicyStamp = getPolicyAndStampEntity(model.getPolicyFileId(),
				stamp.getId());
		if (optPolicyStamp.isPresent()) {
			throw new InvaidInputException("INV001", "stamp already exists");
		}
		entity.setPolicyFile(model.getPolicyFileId());
		entity.setStamp(stamp.getId());
		pFixedStampRepo.save(entity);
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

	private FixedStampEntity getFixedStampEntity(String code) {
		return fixedStampRepo.findByCode(code).orElseThrow(() -> new InvaidInputException("INV001", "stamp not found"));
	}

	private PolicyFileEntity getPolicyFileEntity(String objectUrl) {
		return policyFileRepository.findByObjectUrl(objectUrl)
				.orElseThrow(() -> new InvaidInputException("INV001", "PolicyFile not found"));
	}

	private Optional<PolicyFileFixedStampEntity> getPolicyAndStampEntity(Long policyFile, Long stamp) {
		return pFixedStampRepo.findByPolicyFileAndStamp(policyFile, stamp);
	}

}
