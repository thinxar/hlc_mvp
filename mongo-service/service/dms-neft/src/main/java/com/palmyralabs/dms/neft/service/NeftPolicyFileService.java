package com.palmyralabs.dms.neft.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.base.exception.InvalidInputException;
import com.palmyralabs.dms.handler.PolicyFileUploadListener;
import com.palmyralabs.dms.neft.entity.NeftDocumentTypeEntity;
import com.palmyralabs.dms.neft.entity.NeftPolicyEntity;
import com.palmyralabs.dms.neft.entity.NeftPolicyFileEntity;
import com.palmyralabs.dms.neft.model.NeftPolicyFileModel;
import com.palmyralabs.dms.neft.modelMapper.NeftPolicyModelMapper;
import com.palmyralabs.dms.neft.repository.NeftDocumentTypeRepository;
import com.palmyralabs.dms.neft.repository.NeftPolicyFileRepository;
import com.palmyralabs.dms.neft.repository.NeftPolicyRepository;
import com.palmyralabs.palmyra.base.exception.DataNotFoundException;
import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;
import com.palmyralabs.palmyra.s3.service.AsyncFileService;
import com.palmyralabs.palmyra.s3.service.impl.SyncFileServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class NeftPolicyFileService {
	private final NeftPolicyFileRepository policyFileRepository;
	private final NeftPolicyRepository policyRepository;
	private final NeftDocumentTypeRepository docTypeRepository;

	private final NeftPolicyModelMapper modelMapper;
	private final AsyncFileService fileService;
	private final SyncFileServiceImpl syncFileService;
	
	public List<NeftPolicyFileModel> getAllPolicyFiles(Integer policyId) {
		List<NeftPolicyFileEntity> policyFileEntities = policyFileRepository.findByPolicyId_IdOrderByDocketTypeAsc(policyId);
		List<NeftPolicyFileModel> policyModels = new ArrayList<NeftPolicyFileModel>();
		for (NeftPolicyFileEntity entity : policyFileEntities) {
			policyModels.add(modelMapper.toPolicyFileModel(entity));
		}
		return policyModels;
	}
	
	public NeftPolicyFileModel getById(Integer policyId,Integer id) {
	 NeftPolicyFileEntity NeftPolicyFileEntity=	policyFileRepository.findByPolicyId_IdAndId(policyId, id);
	 if(NeftPolicyFileEntity!= null) {
		 return(modelMapper.toPolicyFileModel(NeftPolicyFileEntity));
	 }
	 else {
		 throw new InvalidInputException("INV001", "file record not found");
	 }
	}
	
	public ResponseFileEmitter download(Integer policyId, Integer fileId) {
		NeftPolicyFileEntity NeftPolicyFileEntity = policyFileRepository.findByPolicyId_IdAndId(policyId, fileId);

		if (NeftPolicyFileEntity != null) {
			if (NeftPolicyFileEntity.getObjectUrl() != null) {
				ResponseFileEmitter emitter = new ResponseFileEmitter(60 * 1000L);
				String key = NeftPolicyFileEntity.getObjectUrl();
				fileService.download(key, emitter);
				return emitter;
			} else {
				throw new DataNotFoundException("INV012", "Object url not found");
			}
		} else {
			throw new DataNotFoundException("INV012", "File record not found");
		}
	}

	public String upload(MultipartFile file, Integer policyId, Integer docketTypeId, boolean incrementalFileName) {

		log.info("Initiating upload process for policyId={}, docketTypeId={}", policyId, docketTypeId);
		Optional<NeftPolicyEntity> policyOptional = policyRepository.findById(policyId);

		if (policyOptional.isPresent()) {
			NeftPolicyEntity policy = policyOptional.get();
			String folder = String.valueOf(policy.getPolicyNumber()) + "/" + policy.getId();
			String objectUrl = String.join("/", folder, file.getOriginalFilename());

			String fileName = checkObjectUrlAlreadyExists(objectUrl, file, folder, docketTypeId, incrementalFileName);
			objectUrl = String.join("/", folder, fileName);
			PolicyFileUploadListener listener = new PolicyFileUploadListener();
			try {
				syncFileService.upload(folder, fileName, file, listener);
				log.info("Upload successful: File '{}' uploaded to '{}'", fileName, folder);
			} catch (Exception e) {
				log.error("S3 upload failed for file '{}': {}", fileName, e.getMessage(), e);
				throw new InvalidInputException("INV400", "File Upload To S3 failed for " + e.getMessage());
			}
			savePolicyFile(fileName, file, policyId, objectUrl, docketTypeId);
			return "completed";
		} else {
			throw new DataNotFoundException("INV012", "Policy Record not found");
		}
	}

	private void savePolicyFile(String fileName, MultipartFile file, Integer policyId, String objectUrl,
			Integer docketTypeId) {
		NeftPolicyFileEntity fileEntity = new NeftPolicyFileEntity();
		fileEntity.setFileName(fileName);
		fileEntity.setFileSize(file.getSize());
		fileEntity.setFileType(file.getContentType());
		fileEntity.setPolicyId(getNeftPolicyEntity(policyId));
		fileEntity.setObjectUrl(objectUrl);
		fileEntity.setDocketType(getDocketType(docketTypeId));
		fileEntity.setCreatedOn(LocalDateTime.now());
		fileEntity.setCreatedBy("Admin");
		policyFileRepository.save(fileEntity);
	}

	private String checkObjectUrlAlreadyExists(String objectUrl, MultipartFile file, String folder,
			Integer docketTypeId, boolean incrementalFileName) {

		Optional<NeftPolicyFileEntity> optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
		String fileName = file.getOriginalFilename();

		if (optPolicyFile.isPresent()) {
			String originalFileName = fileName;
			String extension = "";
			int dotIndex = originalFileName.lastIndexOf('.');
			if (dotIndex != -1) {
				fileName = originalFileName.substring(0, dotIndex);
				extension = originalFileName.substring(dotIndex);
			}
			int count = 1;
			String newFileName = "";
			do {
				newFileName = fileName + "_" + count + extension;
				count++;
				objectUrl = String.join("/", folder, newFileName);
				optPolicyFile = policyFileRepository.findByObjectUrl(objectUrl);
			} while (optPolicyFile.isPresent());
			return newFileName;
		}
		return fileName;

	}

	private NeftDocumentTypeEntity getDocketType(Integer id) {
		return docTypeRepository.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "docketType not found"));
	}

	private NeftPolicyEntity getNeftPolicyEntity(Integer id) {
		return policyRepository.findById(id)
				.orElseThrow(() -> new InvalidInputException("INV001", "policy record not found"));
	}

	

}
