package com.palmyralabs.dms.dataload.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.util.function.Consumer;

public class FolderUtil {
	public static void processPolicy(Path rootPath, Consumer<Path> consumer) {
		try {
			Files.walk(rootPath)
					.filter(p -> isConfigFile(p))
					.forEach(consumer::accept);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	private static boolean isConfigFile(Path p) {
		return Files.isDirectory(p, LinkOption.NOFOLLOW_LINKS) && p.getFileName().toString().toString().matches("\\d{9}");
	}
}
