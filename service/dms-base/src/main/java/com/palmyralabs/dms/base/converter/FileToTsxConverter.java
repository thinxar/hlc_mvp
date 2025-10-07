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
                .replaceAll("(?i)<br\\s*/?>", "<br />")
                .replaceAll("\\bstyle\\b", "className")
                .replaceAll("(?i)<\\s*hr\\s*>", "<hr />")
                .replaceAll("(?i)<SignatureOfApprover>", "{/* <SignatureOfApprover> */}")
                .replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?center\"?[^>]*>", "<$1 className=\"text-center\">")
                .replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?right\"?[^>]*>", "<$1 className=\"text-right\">")
                .replaceAll("(?i)<(h[1-5])[^>]*align\\s*=\\s*\"?left\"?[^>]*>", "<$1 className=\"text-left\">")
                .replaceAll("width\\s*=\\s*(\\d+)", "width=\"$1\"")
                .replaceAll("height\\s*=\\s*(\\d+)", "height=\"$1\"")
                .replaceAll("align\\s*=\\s*(\\w+)", "align=\"$1\"")
                .replaceAll("border\\s*=\\s*\"[0-9]+\"", "").replaceAll("\\s{2,}", " ").replaceAll(">\\s+<", ">\n<")
                .replace("style", "className")
                .replaceAll("(?i)<p\\s+align=['\"]?justify['\"]?\\s*>", "<p className=\"justify\">")
                .replaceAll("(?i)<p\\s+align=['\"]?left['\"]?\\s*>", "<p className=\"text-left\">")
                .replaceAll("(?i)<p\\s+align=['\"]?right['\"]?\\s*>", "<p className=\"text-right\">")
                .replaceAll("(?i)<p\\s+align=['\"]?center['\"]?\\s*>", "<p className=\"text-center\">")
                .replaceAll("(?i)<font[^>]*>", "").replaceAll("(?i)</font>", "")
                .replaceAll("(?i)<table([^>]*?)border=([\"']?)(\\d+)\\2", "<table$1border={$3}")
                .replaceAll("nowrap", "")
                .replaceAll("<hr\\s+color=([^\\s>]+)\\s*>", "<hr color=\"$1\" />")
                .replaceAll("(?i)<table([^>]*?)\\s+align=['\"]?justify['\"]?([^>]*?)>", "<table$1 align=\"center\"$2>");
 
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
            String replacement = isEdit ? "<TextField attribute=\"" + refName + "\" type=\"text\" />"
                    : "<TextView attribute=\"" + refName + "\" type=\"text\" />";
            matcher.appendReplacement(replaced, Matcher.quoteReplacement(replacement));
        }
        matcher.appendTail(replaced);
 
        String tsxContent = replaced.toString();
        String importString = isEdit ? "import { " + datePickerImport + " TextField } from 'templates/mantineForm';\n"
                : "import { TextView } from 'templates/mantineForm';";
 
        String tsxTemplate = importString + "import { PalmyraForm } from '@palmyralabs/rt-forms';\n\n" + "const "
                + finalFileName + " = (props: any) => {\n" + "  return (\n" + "    <PalmyraForm ref={props.formRef}>\n"
                + tsxContent + "\n" + "    </PalmyraForm>\n" + "  );\n" + "};\n\n" + "export {" + finalFileName
                + "};\n";
 
        File outputFile = new File(outputDir, finalFileName + outputExtension);
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
        String cleaned = fileName.replaceAll("[()\\-_,\\s]+", "");
        String digits = cleaned.replaceAll("\\D+", "");
        String letters = cleaned.replaceAll("\\d+", "");
        return !digits.isEmpty() ? "Template" + digits : "Template" + letters;
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
}