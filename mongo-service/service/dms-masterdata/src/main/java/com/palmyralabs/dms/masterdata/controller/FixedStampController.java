package com.palmyralabs.dms.masterdata.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.masterdata.model.FixedStampModel;
import com.palmyralabs.dms.masterdata.service.FixedStampService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/masterdata")
public class FixedStampController extends AbstractController {

	private final FixedStampService fixedStampService;
	

    @PostMapping("/fixedStamp")
	public PalmyraResponse<FixedStampModel>  createFixedStamp(@RequestBody FixedStampModel request) {
		return apiResponse(fixedStampService.createFixedStamp(request));
	}

	@GetMapping("/fixedStamp")
	public PalmyraResponse<List<FixedStampModel>> getAll() {
		return apiResponse(fixedStampService.getAll());
	}

	@GetMapping("/fixedStamp/{id}")
	public PalmyraResponse<FixedStampModel> getById(@PathVariable("id") Integer id) {
		return apiResponse(fixedStampService.getById(id));
	}
}
