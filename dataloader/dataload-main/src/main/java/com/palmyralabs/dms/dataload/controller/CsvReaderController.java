package com.palmyralabs.dms.dataload.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.palmyralabs.dms.dataload.model.PolicyModel;
import com.palmyralabs.dms.dataload.service.CsvReaderService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/dataload")
public class CsvReaderController extends AbstractController {

	private final CsvReaderService csvReader;

	@PostMapping("/upload")
    public PalmyraResponse<PolicyModel> parseCsv(@RequestParam("file") MultipartFile file){
        return apiResponse(csvReader.parseCsv(file));
    }
}