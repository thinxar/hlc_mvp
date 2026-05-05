package com.palmyralabs.dms.neft.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.neft.model.NeftDocumentTypeModel;
import com.palmyralabs.dms.neft.service.NeftDocumentTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/neft")
public class NeftDocumentTypeController extends AbstractController {

	private final NeftDocumentTypeService documentTypeService;
	
	@PostMapping("/docketType")
	public PalmyraResponse<NeftDocumentTypeModel>  createDocketType(@RequestBody NeftDocumentTypeModel request) {
		return apiResponse(documentTypeService.createDocumentType(request));
	}

}
