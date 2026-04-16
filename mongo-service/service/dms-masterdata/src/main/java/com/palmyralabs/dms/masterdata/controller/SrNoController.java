package com.palmyralabs.dms.masterdata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.SrNoModel;
import com.palmyralabs.dms.masterdata.service.SrNoService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata")
public class SrNoController extends AbstractController {

	private final SrNoService srNoService;
	
	@PostMapping("/srNo")
	public PalmyraResponse<SrNoModel>  createSrNo(@RequestBody SrNoModel request) {
		return apiResponse(srNoService.createSrNo(request));
	}


	@GetMapping("/srNo")
	public PalmyraResponse<List<SrNoModel>> getAll() {
		return apiResponse(srNoService.getAll());
	}

	@GetMapping("/srNo/{id}")
	public PalmyraResponse<SrNoModel> getById(@PathVariable("id") Integer id) {
		return apiResponse(srNoService.getById(id));
	}
}
