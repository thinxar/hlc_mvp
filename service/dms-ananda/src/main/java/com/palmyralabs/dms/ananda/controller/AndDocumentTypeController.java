package com.palmyralabs.dms.ananda.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.ananda.model.AndDocumentTypeModel;
import com.palmyralabs.dms.ananda.service.AndDocumentTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/and")
public class AndDocumentTypeController extends AbstractController {

	private final AndDocumentTypeService documentTypeService;
	
	@PostMapping("/docketType")
	public PalmyraResponse<AndDocumentTypeModel>  createDocketType(@RequestBody AndDocumentTypeModel request) {
		return apiResponse(documentTypeService.createDocumentType(request));
	}

}
