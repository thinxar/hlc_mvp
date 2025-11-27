package com.palmyralabs.dms.base.converter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
public class FileToTsxConverter {
    private static final String inputExtension = ".txt";
    private static final String outputExtension = ".tsx";
    private static String datePickerImport = "";
    private static String textFieldImport = "";
    private static boolean isEdit = true;
    public static void main(String[] args) {
        // convert one specific file
        String inputFilePath = "/home/palmyra/Downloads/hlc-endorsements/Variable_Endorsements_details/Alteration/";
        String outputDir = "/home/palmyra/mydev/hlc_mvp/web/src/pages/home/";
        String fileName = "3553-Alteration DOC(age at entry is altered)";
        File inputFile = new File(inputFilePath, fileName + inputExtension);
        File outputDirectory = new File(outputDir);
        if (!inputFile.exists() || !inputFile.isFile()) {
            System.err.println("Input file not found: " + inputFilePath);
            return;
        }
        if (!outputDirectory.exists()) {
            outputDirectory.mkdirs();
        }
        try {
            convertFile(inputFile, outputDirectory);
        } catch (IOException e) {
            System.err.println("Conversion failed: " + e.getMessage());
            e.printStackTrace();
        }
    }
    private static void convertFile(File inputFile, File outputDir) throws IOException {
        String fileName = inputFile.getName().replace(inputExtension, "");
        String finalFileName = formatFileName(fileName);
        String htmlContent;
        try {
            htmlContent = Files.readString(inputFile.toPath(), StandardCharsets.UTF_8);
        } catch (MalformedInputException e) {
            // Retry with ISO encoding if UTF-8 fails
            byte[] bytes = Files.readAllBytes(inputFile.toPath());
            htmlContent = new String(bytes, StandardCharsets.ISO_8859_1);
        }

        htmlContent = removeTagContent(htmlContent, "style");
        htmlContent = removeTagContent(htmlContent, "script");
        htmlContent = makeTagsLowercase(htmlContent);
    	htmlContent = htmlContent.replaceAll("(?s)<style.*?>.*?</style>", "").replaceAll("\r\n", "\n")
				.replaceAll("&nbsp;", " ").trim().replaceAll("(?i)<tbody[^>]*>", "").replaceAll("(?i)</tbody>", "")
				.replaceAll("(?i)<br\\s*/?>", "<br />").replaceAll("\\bstyle\\b", "className")
				.replaceAll("(?i)<\\s*hr\\s*>", "<hr />")
				.replaceAll("(?i)<SignatureOfApprover>", "{/* <SignatureOfApprover> */}")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?center\"?[^>]*>", "<$1 className=\"text-center\">")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?right\"?[^>]*>", "<$1 className=\"text-right\">")
				.replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?left\"?[^>]*>", "<$1 className=\"text-left\">")
				.replaceAll("width\\s*=\\s*(\\d+)", "width=\"$1\"").replaceAll("height\\s*=\\s*(\\d+)", "height=\"$1\"")
				.replaceAll("align\\s*=\\s*(\\w+)", "align=\"$1\"").replaceAll("border\\s*=\\s*\"[0-9]+\"", "")
				.replaceAll("\\s{2,}", " ").replaceAll(">\\s+<", ">\n<").replace("style", "className")
				.replaceAll("(?i)<p\\s+align=['\"]?justify['\"]?\\s*>", "<p className=\"justify\">")
				.replaceAll("(?i)<p\\s+align=['\"]?left['\"]?\\s*>", "<p className=\"text-left\">")
				.replaceAll("(?i)<p\\s+align=['\"]?right['\"]?\\s*>", "<p className=\"text-right\">")
				.replaceAll("(?i)<p\\s+align=['\"]?center['\"]?\\s*>", "<p className=\"text-center\">")
				.replaceAll("(?i)<font[^>]*>", "").replaceAll("(?i)</font>", "")
				.replaceAll("(?i)<table([^>]*?)border=([\"']?)(\\d+)\\2", "<table$1border={$3}")
				.replaceAll("nowrap", "").replaceAll("(?i)<hr\\s+color=([^\\s\">/]+)\\s*/?>", "<hr color=\"$1\" />") // ✅
				.replaceAll("(?i)(<tr\\b[^>]*?)\\s+width\\s*=\\s*\"[^\"]*\"", "$1")
				.replaceAll("(?i)<table([^>]*?)\\s+align=['\"]?justify['\"]?([^>]*?)>", "<table$1 align=\"center\"$2>")
				.replaceAll("(?i)<table([^>]*?)\\s+margin=['\"][^'\"]*['\"]([^>]*?)>", "<table$1$2>")
				.replaceAll("(?i)<p\\s+className=[\"']text-align:\\s*left;[\"']>", "<p className=\"text-left\">")
				.replaceAll("(?i)<p\\s+className=[\"']text-align:\\s*right;[\"']>", "<p className=\"text-right\">")
				.replaceAll("(?i)<p\\s+className=[\"']text-align:\\s*center;[\"']>", "<p className=\"text-center\">")
				.replaceAll("(?i)<p\\s+className=[\"']text-align:\\s*justify;[\"']>", "<p className=\"text-justify\">");
    	if (isEdit) {
			// DatePicker logic
			if (htmlContent.contains("%%CurrDate%%")) {
				htmlContent = htmlContent.replace("%%CurrDate%%",
						" <DatePicker attribute=\"currDate\" placeholder=\"dd-mm-yyyy\" readOnly/>");
				datePickerImport = "DatePicker,";
			} else {
				datePickerImport = "";
			}
 
			// Check if any other placeholder (%%...%% except CurrDate) exists
			// We'll look for %%...%% placeholders excluding CurrDate
			Pattern otherPlaceholderPattern = Pattern.compile("%%(?!CurrDate)([^%]+)%%");
			Matcher otherMatcher = otherPlaceholderPattern.matcher(htmlContent);
			if (otherMatcher.find()) {
				textFieldImport = "TextField,";
			} else {
				textFieldImport = "";
			}
		}
 
    	Pattern pattern = Pattern.compile("%%(.*?)%%");
		Matcher matcher = pattern.matcher(htmlContent);
		StringBuffer replaced = new StringBuffer();
		while (matcher.find()) {
			String refName = matcher.group(1).trim();
			 if (!refName.isEmpty()) {
			        refName = refName.substring(0, 1).toLowerCase() + refName.substring(1);
			    }
			String replacement = "";
			 if (isEdit) {
			        if (refName.equalsIgnoreCase("polNumber")) {
			            replacement = "<TextField attribute=\"" + refName + "\" type=\"text\" readOnly />";
			        } else {
			            replacement = "<TextField attribute=\"" + refName + "\" type=\"text\" />";
			        }
			    } else {
			    	replacement = "<TextView attribute=\"" + refName + "\" />";
			    }
			    matcher.appendReplacement(replaced, Matcher.quoteReplacement(replacement));
		}
		matcher.appendTail(replaced);
 
		String tsxContent = replaced.toString();
		String importString = isEdit
				? "import { " + datePickerImport + textFieldImport + "} from 'templates/mantineForm';\n"
				: "import { TextView } from 'templates/mantineForm';";
        
        File outputFile = new File(outputDir, finalFileName + outputExtension);
        File existingFile = findFileInDirectory(outputDir, finalFileName + outputExtension);
		int count = 1;

		while (existingFile != null && existingFile.exists()) {
			finalFileName = finalFileName + count;
		    outputFile = new File(outputDir, finalFileName+ outputExtension);
		    existingFile = findFileInDirectory(outputDir, finalFileName+ outputExtension);
		    count++;
		}
		
		 String tsxTemplate = importString + "import { PalmyraForm } from '@palmyralabs/rt-forms';\n\n" + "const "
	                + finalFileName + " = (props: any) => {\n" + "  return (\n" + "    <PalmyraForm ref={props.formRef} formData={props.formData}>\n"
	                + tsxContent + "\n" + "    </PalmyraForm>\n" + "  );\n" + "};\n\n" + "export {" + finalFileName
	                + "};\n";
		 
		try (FileWriter writer = new FileWriter(outputFile)) {
		    writer.write(tsxTemplate);
		}
        System.out.println("Converted single file: " + inputFile.getName() + " -> " + outputFile.getAbsolutePath());
    }
    private static String removeTagContent(String html, String tagName) {
        return html.replaceAll("(?is)<" + tagName + ".*?>.*?</" + tagName + ">", "");
    }
    private static String formatFileName(String fileName) {
        if (fileName == null || fileName.isEmpty())
            return fileName;
        
        int dotIndex = fileName.lastIndexOf('.');
		String namePart = (dotIndex >= 0) ? fileName.substring(0, dotIndex) : fileName;
		String extension = (dotIndex >= 0) ? fileName.substring(dotIndex) : "";
		
        String cleaned = namePart.replaceAll("[()\\-_,\\s]+", "");
        String digits = cleaned.replaceAll("\\D+", "");
        String letters = cleaned.replaceAll("\\d+", "");
        
        if (!digits.isEmpty()) {
			return isEdit ? "Template"+ digits + extension : "TemplateV" + digits + extension;
		} else {
			return isEdit ? "Template"+ letters + extension: "TemplateV" + letters + extension;
		}
    }
    public static String makeTagsLowercase(String html) {
        if (html == null || html.isEmpty())
            return html;
        Pattern pattern = Pattern.compile("<[^>]+>");
        Matcher matcher = pattern.matcher(html);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(sb, Matcher.quoteReplacement(matcher.group().toLowerCase()));
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
    
	private static File findFileInDirectory(File directory, String fileName) {
	    File[] files = directory.listFiles();
	    if (files == null) return null;
	    for (File file : files) {
	        if (file.isDirectory()) {
	            File found = findFileInDirectory(file, fileName);
	            if (found != null) {
	                return found;
	            }
	        } else if (file.getName().equalsIgnoreCase(fileName)) {
	            return file;
	        }
	    }
	    return null;
	}
}