package com.palmyralabs.dms.masterdata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.EndorsementSubTypeModel;
import com.palmyralabs.dms.masterdata.service.EndorsementSubTypeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata")
public class EndorsementSubTypeController extends AbstractController {

	private final EndorsementSubTypeService endorsementSubTypeService;

	@PostMapping("/endorsementSubType")
	public PalmyraResponse<EndorsementSubTypeModel>  createEndorsementSubType(@RequestBody EndorsementSubTypeModel request) {
		return apiResponse(endorsementSubTypeService.createEndorsementSubType(request));
	}

	
	@GetMapping("/{endorsementType}/endorsementSubType")
	public PalmyraResponse<List<EndorsementSubTypeModel>> getAll(@PathVariable("endorsementType") Integer endorsementType) {
		return apiResponse(endorsementSubTypeService.getAll(endorsementType));
	}

	@GetMapping("/endorsementSubType/{id}")
	public PalmyraResponse<EndorsementSubTypeModel> getById(@PathVariable("id") Integer id) {
		return apiResponse(endorsementSubTypeService.getById(id));
	}
}



