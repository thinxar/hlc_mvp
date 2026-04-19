package com.palmyralabs.dms.revival.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.entity.BranchEntity;
import com.palmyralabs.dms.revival.entity.DivisionEntity;
import com.palmyralabs.dms.revival.model.BranchModel;
import com.palmyralabs.dms.revival.model.DivisionModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchService {

	private final MongoTemplate mongoTemplate;

	public PaginatedResponse<BranchModel> getBranchesByDivision(int limit, int offset, boolean includeTotal,
			String divisionName, String branchName) {
		int page = offset / limit;
		Pageable pageable = PageRequest.of(page, limit);
		Query query = new Query();
		if (divisionName != null && !divisionName.isBlank()) {
			query.addCriteria(Criteria.where("divisionName").is(divisionName));
		}
		if (branchName != null && !branchName.isBlank()) {
			String regex = branchName.replace("*", ".*");
			query.addCriteria(Criteria.where("branchName").regex(regex, "i"));
		}
		long total = mongoTemplate.count(query, BranchEntity.class);
		query.with(pageable);
		List<BranchEntity> result = mongoTemplate.find(query, BranchEntity.class);
		List<BranchModel> models = new ArrayList<>();
		for (BranchEntity entity : result) {
			models.add(toBranchModel(entity));
		}
		if (!includeTotal) {
			total = 0;
		}
		return new PaginatedResponse<>(models, limit, offset, total);
	}

	public PaginatedResponse<DivisionModel> getDivisionByBranch(int limit, int offset, boolean includeTotal,
			String branchName, String divisionName) {

		int page = offset / limit;
		Pageable pageable = PageRequest.of(page, limit);
		if (branchName != null && !branchName.isBlank()) {
			Query branchQuery = new Query();
			branchQuery.addCriteria(Criteria.where("branchName").regex(branchName, "i"));
			if (divisionName != null && !divisionName.isBlank()) {
				branchQuery.addCriteria(Criteria.where("divisionName").regex(divisionName, "i"));
			}
			long total = mongoTemplate.count(branchQuery, BranchEntity.class);
			branchQuery.with(pageable);
			List<BranchEntity> result = mongoTemplate.find(branchQuery, BranchEntity.class);
			List<DivisionModel> models = new ArrayList<>();
			for (BranchEntity entity : result) {
				DivisionModel model = new DivisionModel();
				model.setDivisionName(entity.getDivisionName());
				models.add(model);
			}
			if (!includeTotal) {
				total = 0;
			}
			return new PaginatedResponse<>(models, limit, offset, total);
		}
		Query divisionQuery = new Query();

		if (divisionName != null && !divisionName.isBlank()) {
			String regex = divisionName.replace("*", ".*");
			divisionQuery.addCriteria(Criteria.where("divisionName").regex(regex, "i"));
		}

		long total = mongoTemplate.count(divisionQuery, DivisionEntity.class);
		divisionQuery.with(pageable);
		List<DivisionEntity> result = mongoTemplate.find(divisionQuery, DivisionEntity.class);
		List<DivisionModel> models = new ArrayList<>();
		for (DivisionEntity entity : result) {
			models.add(toDivisionModel(entity));
		}
		if (!includeTotal) {
			total = 0;
		}

		return new PaginatedResponse<>(models, limit, offset, total);
	}

	private BranchModel toBranchModel(BranchEntity entity) {
		BranchModel model = new BranchModel();
		model.setId(entity.getId());
		model.setBranchName(entity.getBranchName());
		return model;
	}

	private DivisionModel toDivisionModel(DivisionEntity entity) {
		DivisionModel model = new DivisionModel();
		model.setId(entity.getId());
		model.setDivisionName(entity.getDivisionName());

		return model;
	}
}