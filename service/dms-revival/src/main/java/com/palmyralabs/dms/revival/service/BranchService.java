package com.palmyralabs.dms.revival.service;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.model.BranchModel;
import com.palmyralabs.dms.revival.model.DivisionModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/BranchService.java.txt
@Service
@RequiredArgsConstructor
public class BranchService {

	public PaginatedResponse<BranchModel> getBranchesByDivision(int limit, int offset, boolean includeTotal,
			String doCode, String branchName) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public PaginatedResponse<DivisionModel> getDivisionByBranch(int limit, int offset, boolean includeTotal,
			String branchCode, String divisionName) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
