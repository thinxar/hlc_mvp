package com.palmyralabs.dms.revival.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.RevDocumentTypeModel;
import com.palmyralabs.dms.revival.service.RevDocumentTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevDocumentTypeController extends AbstractController {

	private final RevDocumentTypeService documentTypeService;
	
	@PostMapping("/docketType")
	public PalmyraResponse<RevDocumentTypeModel>  createDocketType(@RequestBody RevDocumentTypeModel request) {
		return apiResponse(documentTypeService.createDocumentType(request));
	}

}
