package com.palmyralabs.dms.revival.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.RevPolicyChartModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/RevPolicyPendencyService.java.txt
@Service
@RequiredArgsConstructor
public class RevPolicyPendencyService {

	public List<RevPolicyChartModel> searchPolicies(String soCode, String srNo) {
		 return Collections.emptyList(); 
	}
}
