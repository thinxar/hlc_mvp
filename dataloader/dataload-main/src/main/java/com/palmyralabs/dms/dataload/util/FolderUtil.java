package com.palmyralabs.dms.dataload.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.function.Consumer;

public class FolderUtil {
	public static void processPolicy(Path rootPath, Consumer<Path> consumer) {
		try {
			Files.walk(rootPath)
					.filter(p -> Files.isDirectory(p) && p.getFileName().toString().toString().matches("\\d{9}"))
					.forEach(consumer::accept);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
