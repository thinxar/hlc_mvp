package com.palmyralabs.dms.revival.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.ResponseModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/RevDoCodeSummaryService.java.txt
@Service
@RequiredArgsConstructor
public class RevDoCodeSummaryService {

	public List<ResponseModel> getPolicyCountByDoCode(String officeCode, String srNo) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
