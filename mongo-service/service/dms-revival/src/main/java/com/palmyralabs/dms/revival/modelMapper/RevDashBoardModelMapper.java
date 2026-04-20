package com.palmyralabs.dms.revival.modelMapper;

import java.util.List;

import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;
import com.palmyralabs.dms.revival.model.MonthWiseReportModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDashBoardModelMapper {

	public MonthWiseReportModel toMonthWiseReportModel(MonthWiseReportEntity entity) {
		MonthWiseReportModel model = new MonthWiseReportModel();
		model.setId(entity.getId());
		model.setMonth(entity.getMonth());
		model.setZone(entity.getZone());
		model.setDivisionName(entity.getDivisionName());
		model.setDoCode(entity.getDoCode());
		model.setBranchCode(entity.getBranchCode());
		model.setBranchName(entity.getBranchName());
		model.setNo_cases(entity.getNo_cases());
		model.setTotalDocuments(entity.getTotalDocuments());
		model.setApprovedDocuments(entity.getApprovedDocuments());
		model.setPendingDocuments(entity.getPendingDocuments());
		model.setRejectedDocuments(entity.getRejectedDocuments());
		return model;
	}

	public List<MonthWiseReportModel> toMonthWiseReportModels(List<MonthWiseReportEntity> entities) {
		return entities.stream().map(this::toMonthWiseReportModel).toList();
	}
}
