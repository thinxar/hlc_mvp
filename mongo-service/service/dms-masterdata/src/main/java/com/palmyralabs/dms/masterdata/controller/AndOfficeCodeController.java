package com.palmyralabs.dms.masterdata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.AndOfficeCodeModel;
import com.palmyralabs.dms.masterdata.service.AndOfficeCodeService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata/and")
public class AndOfficeCodeController extends AbstractController {

	private final AndOfficeCodeService officeCodeService;
	
	@PostMapping("/officeCode")
	public PalmyraResponse<AndOfficeCodeModel>  createOfficeCode(@RequestBody AndOfficeCodeModel request) {
		return apiResponse(officeCodeService.createOfficeCode(request));
	}


	@GetMapping("/officeCode")
	public PalmyraResponse<List<AndOfficeCodeModel>> getAll() {
		return apiResponse(officeCodeService.getAll());
	}

	@GetMapping("/officeCode/{id}")
	public PalmyraResponse<AndOfficeCodeModel> getById(@PathVariable("id") Integer id) {
		return apiResponse(officeCodeService.getById(id));
	}
}
