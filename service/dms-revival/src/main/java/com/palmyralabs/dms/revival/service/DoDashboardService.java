package com.palmyralabs.dms.revival.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.model.BranchPerformanceModel;

import lombok.RequiredArgsConstructor;

// TODO: Postgres migration - original Mongo aggregation preserved at claude/service/dms_revival/_mongo_original/DoDashboardService.java.txt
@Service
@RequiredArgsConstructor
public class DoDashboardService {

	public List<BranchPerformanceModel> getBranchProcessed(String doCode, String order, int count, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<BranchPerformanceModel> getBranchPending(String doCode, String order, int count, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<BranchPerformanceModel> getBranchSubmitted(String doCode, String order, int count, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<BranchPerformanceModel> listBranches(String doCode, int limit, String orderBy, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<BranchPerformanceModel> getBranchPendingRatio(String doCode, String order, int count, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}

	public List<BranchPerformanceModel> getBranchProcessedRatio(String doCode, String order, int count, int window) {
		throw new UnsupportedOperationException("dms-revival dashboard pending Postgres migration");
	}
}
