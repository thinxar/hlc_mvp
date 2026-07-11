package com.palmyralabs.dms.revival.service;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.ResponseModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/RevPolicyPendencyChartService.java.txt
@Service
@RequiredArgsConstructor
public class RevPolicyPendencyChartService {

	public List<ResponseModel> getPendency(String soCode, String srNo) {
		 return Collections.emptyList(); 
	}
}
