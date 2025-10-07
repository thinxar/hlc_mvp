package com.palmyralabs.dms.base.converter;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class BatchTsxConverter {
	private static String inputExtension = ".txt";
	private static String outputExtension = ".tsx";
	private static String datePickerImport = "";
	private static boolean isEdit = true;

	public static void main(String[] args) {
		String inputDir = "/home/palmyra/Desktop/TestFiles/Variable_Endorsements_details/";
		String outputDir = "/home/palmyra/mydev/hlc_mvp/web/src/Template/";
		// String outputDir = "/home/palmyra/Desktop/TestFiles/output";

		File inputDirectory = new File(inputDir);
		File outputDirectory = new File(outputDir);

		if (!inputDirectory.exists() || !inputDirectory.isDirectory()) {
			System.err.println("Input directory not found or not a directory: " + inputDir);
			return;
		}

		processDirectory(inputDirectory, inputDirectory, outputDirectory);
	}

	private static void processDirectory(File rootDir, File currentDir, File outputRoot) {
		for (File file : currentDir.listFiles()) {
			if (file.isDirectory()) {
				// Preserve directory structure
				File newOutputDir = new File(outputRoot, rootDir.toPath().relativize(file.toPath()).toString());
				if (!newOutputDir.exists()) {
					newOutputDir.mkdirs();
				}
				processDirectory(rootDir, file, outputRoot);
			} else if (file.isFile() && file.getName().endsWith(inputExtension)) {
				try {
					convertFile(rootDir, file, outputRoot);
				} catch (IOException e) {
					System.err.println("Failed to convert file: " + file.getAbsolutePath());
					e.printStackTrace();
				}
			}
		}
	}

	private static void convertFile(File rootDir, File inputFile, File outputRoot) throws IOException {
		String fileName = inputFile.getName().replace(inputExtension, "");
		String finalFileName = formatFileName(fileName);
		System.out.println(inputFile.toPath());
		String htmlContent = Files.readString(inputFile.toPath(), StandardCharsets.UTF_8);

		htmlContent = removeTagContent(htmlContent, "style");
		htmlContent = removeTagContent(htmlContent, "script");
		htmlContent = makeTagsLowercase(htmlContent);

		htmlContent = htmlContent.replaceAll("(?s)<style.*?>.*?</style>", "").replaceAll("\r\n", "\n")
				.replaceAll("&nbsp;", " ").trim().replaceAll("(?i)<tbody[^>]*>", "").replaceAll("(?i)</tbody>", "")
				.replaceAll("(?i)<b>", "").replaceAll("(?i)<br\\s*/?>", "<br />").replaceAll("\\bstyle\\b", "className")
				.replaceAll("(?i)<\\s*hr\\s*>", "<hr />")
				.replaceAll("(?i)<SignatureOfApprover>", "{/* <SignatureOfApprover> */}")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?center\"?[^>]*>", "<$1 className=\"text-center\">")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?right\"?[^>]*>", "<$1 className=\"text-right\">")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?left\"?[^>]*>", "<$1 className=\"text-left\">")
				.replaceAll("width\\s*=\\s*(\\d+)", "width=\"$1\"").replaceAll("align\\s*=\\s*(\\w+)", "align=\"$1\"")
				.replaceAll("border\\s*=\\s*\"[0-9]+\"", "").replaceAll("\\s{2,}", " ").replaceAll(">\\s+<", ">\n<")
				.replace("style", "className")
				.replaceAll("(?i)<p\\s+align=['\"]?justify['\"]?\\s*>", "<p className=\"justify\">")
				.replaceAll("(?i)<font[^>]*>", "").replaceAll("(?i)</font>", "")
				.replaceAll("(?i)<table([^>]*?)border=([\"']?)(\\d+)\\2", "<table$1border={$3}");

		if (isEdit) {
			if (htmlContent.contains("%%CurrDate%%")) {
				htmlContent = htmlContent.replace("%%CurrDate%%",
						" <DatePicker attribute=\"currDate\" placeholder=\"dd-mm-yyyy\" />");
				datePickerImport = "DatePicker,";
			} else {
				datePickerImport = "";
			}
		}

		Pattern pattern = Pattern.compile("%%(.*?)%%");
		Matcher matcher = pattern.matcher(htmlContent);
		StringBuffer replaced = new StringBuffer();
		while (matcher.find()) {
			String refName = matcher.group(1).trim();
			String replacement = "";
			if (isEdit)
				replacement = "<TextField attribute=\"" + refName + "\" type=\"text\" />";
			else
				replacement = "<TextView attribute=\"" + refName + "\" type=\"text\" />";
			matcher.appendReplacement(replaced, Matcher.quoteReplacement(replacement));
		}
		matcher.appendTail(replaced);

		String tsxContent = replaced.toString();
		String importString = isEdit ? "import { " + datePickerImport + " TextField } from 'templates/mantineForm';\n"
				: "import { TextView } from 'templates/mantineForm';";
		String tsxTemplate = importString + "import { PalmyraForm } from '@palmyralabs/rt-forms';\n\n" + "const "
				+ finalFileName + " = (props: any) => {\n" + "  return (\n"
				+ "           <PalmyraForm ref={props.formRef}>\n" + tsxContent + "\n" + "           </PalmyraForm>\n"
				+ "  );\n" + "};\n\n" + "export {" + finalFileName + "};\n";

		// Preserve directory structure
		File relativeDir = new File(outputRoot,
				rootDir.toPath().relativize(inputFile.getParentFile().toPath()).toString());
		if (!relativeDir.exists()) {
			relativeDir.mkdirs();
		}

		File outputFile = new File(relativeDir, finalFileName + outputExtension);
		try (FileWriter writer = new FileWriter(outputFile)) {
			writer.write(tsxTemplate);
		}

		System.out.println("Converted: " + inputFile.getAbsolutePath() + " -> " + outputFile.getAbsolutePath());
	}

	private static String removeTagContent(String html, String tagName) {
		return html.replaceAll("(?is)<" + tagName + ".*?>.*?</" + tagName + ">", "");
	}

	private static String formatFileName(String fileName) {
		if (fileName == null || fileName.isEmpty()) {
			return fileName;
		}

		// Split filename and extension
		int dotIndex = fileName.lastIndexOf('.');
		String namePart = (dotIndex >= 0) ? fileName.substring(0, dotIndex) : fileName;
		String extension = (dotIndex >= 0) ? fileName.substring(dotIndex) : "";

		// Remove unwanted characters
		String cleaned = namePart.replaceAll("[()\\-_,\\s]+", "");

		// Extract digits and letters
		String digits = cleaned.replaceAll("\\D+", ""); // numbers only
		String letters = cleaned.replaceAll("\\d+", ""); // letters only

		// Decide output based on presence of digits
		if (!digits.isEmpty()) {
			return "Template" + digits + extension;
		} else {
			return "Template" + letters + extension;
		}
	}

	public static String makeTagsLowercase(String html) {
		if (html == null || html.isEmpty())
			return html;

		Pattern pattern = Pattern.compile("<[^>]+>");
		Matcher matcher = pattern.matcher(html);

		StringBuffer sb = new StringBuffer();
		while (matcher.find()) {
			String tagContent = matcher.group();
			matcher.appendReplacement(sb, Matcher.quoteReplacement(tagContent.toLowerCase()));
		}
		matcher.appendTail(sb);

		return sb.toString();
	}
}
