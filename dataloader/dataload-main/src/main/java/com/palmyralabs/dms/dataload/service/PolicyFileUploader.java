package com.palmyralabs.dms.dataload.service;

import java.nio.file.Path;
import java.util.function.Consumer;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class PolicyFileUploader implements Consumer<Path>{
	private final Path baseFolder;
	private final PolicyUploader uploader;
	
	@Override
	public void accept(Path t) {		
		String policyNumber = t.getFileName().toString();
		Path relativePath = baseFolder.relativize(t);
		uploader.loadPolicy(relativePath.toString(), policyNumber);
	}

}
