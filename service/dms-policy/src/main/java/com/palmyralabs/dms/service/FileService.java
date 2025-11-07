package com.palmyralabs.dms.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.jpa.entity.FixedStampEntity;
import com.palmyralabs.dms.jpa.repository.FixedStampRepo;
import com.palmyralabs.palmyra.filemgmt.common.MultipartFileSender;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class FileService {

	private final FixedStampRepo fixedStampRepo;
	private final String inputExtension = ".tif";

	public void getStamp(HttpServletRequest request, HttpServletResponse response, String code) throws IOException {

		FixedStampEntity stampEntity = getFixedStampEntity(code);
		String stampName = stampEntity.getCode();
		
		String fileName = stampName + inputExtension;
		String startDir = System.getProperty("user.dir");
		String folderName = findParentFolderName(new File(startDir), fileName);
		String finalPath = folderName + "/" + fileName;
		ClassLoader classLoader = getClass().getClassLoader();

		try (InputStream is = classLoader.getResourceAsStream(finalPath)) {
			if (is == null) {
				throw new IOException("Stamp file " + fileName + " not found in classpath under " + folderName);
			}

			Path tempFile = Files.createTempFile(stampName, inputExtension);
			Files.copy(is, tempFile, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

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

}
