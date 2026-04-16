package com.palmyralabs.dms.revival.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.palmyralabs.dms.revival.model.RevPolicyChartModel;
import com.palmyralabs.dms.revival.service.RevPolicyPendencyService;
import com.palmyralabs.palmyra.core.rest.controller.AbstractController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/rev")
public class RevPolicyPendencyController extends AbstractController{

	private final RevPolicyPendencyService policyPendencyService;
	
	@GetMapping("/policy/pendency")
	public List<RevPolicyChartModel> getAll(@RequestParam(value = "officecode", required = false) String soCode,
			@RequestParam(value = "srno", required = false) String srNo) {
		return policyPendencyService.searchPolicies(soCode,srNo);
	}
}
