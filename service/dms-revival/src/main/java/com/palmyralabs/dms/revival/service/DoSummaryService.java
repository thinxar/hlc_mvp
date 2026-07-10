package com.palmyralabs.dms.revival.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.DivisionOverviewModel;
import com.palmyralabs.dms.revival.model.DivisionPerformanceModel;
import com.palmyralabs.dms.revival.model.DoAgingBucketModel;
import com.palmyralabs.dms.revival.repository.BranchRepository;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/DoSummaryService.java.txt
@Service
@RequiredArgsConstructor
public class DoSummaryService {

	private final BranchRepository branchRepository;

	public DivisionOverviewModel getDivisionOverview(String doCode, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<DivisionPerformanceModel> listDivisionPerformance(String doCode, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public DoAgingBucketModel getAgingBuckets(String doCode, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
