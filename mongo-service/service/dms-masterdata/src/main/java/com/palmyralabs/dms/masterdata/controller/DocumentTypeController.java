package com.palmyralabs.dms.masterdata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.DocumentTypeModel;
import com.palmyralabs.dms.masterdata.service.DocumentTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata")
public class DocumentTypeController extends AbstractController {

	private final DocumentTypeService documentTypeService;
	
	@PostMapping("/docketType")
	public PalmyraResponse<DocumentTypeModel>  createDocketType(@RequestBody DocumentTypeModel request) {
		return apiResponse(documentTypeService.createDocumentType(request));
	}


	@GetMapping("/docketType")
	public PalmyraResponse<List<DocumentTypeModel>> getAll() {
		return apiResponse(documentTypeService.getAll());
	}

	@GetMapping("/docketType/{id}")
	public PalmyraResponse<DocumentTypeModel> getById(@PathVariable("id") Integer id) {
		return apiResponse(documentTypeService.getById(id));
	}
}
