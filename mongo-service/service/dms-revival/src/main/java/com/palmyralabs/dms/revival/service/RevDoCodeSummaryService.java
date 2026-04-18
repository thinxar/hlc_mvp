package com.palmyralabs.dms.revival.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.model.RevPolicyResponseModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevDoCodeSummaryService {

	private final MongoTemplate mongoTemplate;

	public List<RevPolicyResponseModel> getPolicyCountByDoCode(String officeCode, String srNo) {

		Criteria criteria = new Criteria();
		if (officeCode != null && !officeCode.isBlank()) {
			criteria.and("soCode").is(officeCode);
		}
		if (srNo != null && !srNo.isBlank()) {
			criteria.and("srNo").ne(srNo);
		}
		Aggregation aggregation = Aggregation.newAggregation(
				Aggregation.match(criteria),
				Aggregation.group("doCode").count().as("value"),
				Aggregation.project("value").and("_id").as("name"),
				Aggregation.sort(Sort.Direction.ASC, "name"));
		return mongoTemplate.aggregate(aggregation, RevPolicyEntity.class, RevPolicyResponseModel.class)
				.getMappedResults();
	}
}