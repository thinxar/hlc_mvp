package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.ResponseModel;
import com.palmyralabs.dms.revival.service.RevDoCodeSummaryService;
import com.palmyralabs.palmyra.base.PalmyraResponse;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev/policy")
public class RevDoCodeSummaryController extends AbstractController {

	private final RevDoCodeSummaryService summaryService;

	@GetMapping("/doCode/summary")
	public PalmyraResponse<List<ResponseModel>> getSummary(
			@RequestParam(value = "officecode", required = true) String soCode,
			@RequestParam(value = "srno", required = true) String srNo) {
		return apiResponse(summaryService.getPolicyCountByDoCode(soCode, srNo));
	}

}
