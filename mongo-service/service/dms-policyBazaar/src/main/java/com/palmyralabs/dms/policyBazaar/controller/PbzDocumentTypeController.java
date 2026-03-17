package com.palmyralabs.dms.policyBazaar.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.policyBazaar.model.PbzDocumentTypeModel;
import com.palmyralabs.dms.policyBazaar.service.PbzDocumentTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/pbv")
public class PbzDocumentTypeController extends AbstractController {

	private final PbzDocumentTypeService documentTypeService;
	
	@PostMapping("/docketType")
	public PalmyraResponse<PbzDocumentTypeModel>  createDocketType(@RequestBody PbzDocumentTypeModel request) {
		return apiResponse(documentTypeService.createDocumentType(request));
	}

}
