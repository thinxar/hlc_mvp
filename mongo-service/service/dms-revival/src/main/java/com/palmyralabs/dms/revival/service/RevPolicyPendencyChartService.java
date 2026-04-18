package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.model.RevPolicyResponseModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyPendencyChartService {

	private final MongoTemplate mongoTemplate;

	public List<RevPolicyResponseModel> getPendency(String soCode, String srNo) {
		List<RevPolicyEntity> policies = mongoTemplate.find(buildQuery(soCode, srNo), RevPolicyEntity.class);
		return preparePendencyResponse(policies);
	}

	private Query buildQuery(String soCode, String srNo) {
		Query query = new Query();
		if (soCode != null && !soCode.isBlank()) {
			query.addCriteria(Criteria.where("soCode").is(soCode));
		}
		if (srNo != null && !srNo.isBlank()) {
			query.addCriteria(Criteria.where("srNo").ne(srNo));
		}
		return query;
	}

	private List<RevPolicyResponseModel> preparePendencyResponse(List<RevPolicyEntity> policies) {
		long total = policies.size();
		long lessThan3Days = 0;
		long between3To10Days = 0;
		long above10Days = 0;

		LocalDate today = LocalDate.now();
		for (RevPolicyEntity policy : policies) {
			long days = getPendingDays(policy.getDateOfSubmission(), today);
			if (days < 3) {
				lessThan3Days++;
			} else if (days <= 10) {
				between3To10Days++;
			} else {
				above10Days++;
			}
		}

		return List.of(new RevPolicyResponseModel("Total", total), new RevPolicyResponseModel("<3 Days", lessThan3Days),
				new RevPolicyResponseModel("3-10 Days", between3To10Days),
				new RevPolicyResponseModel("Above 10 Days", above10Days));
	}

	private long getPendingDays(LocalDate submittedDate, LocalDate today) {
		return ChronoUnit.DAYS.between(submittedDate, today);
	}
}