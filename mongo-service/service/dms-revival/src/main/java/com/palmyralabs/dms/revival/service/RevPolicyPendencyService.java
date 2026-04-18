package com.palmyralabs.dms.revival.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.model.RevPolicyChartModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyPendencyService {
	
	private final MongoTemplate mongoTemplate;

	public List<RevPolicyChartModel> searchPolicies(String soCode, String srNo) {
		 Query query = new Query();
		    if (soCode != null && !soCode.isBlank()) {
		        query.addCriteria(Criteria.where("soCode").is(soCode));
		    }
		    if (srNo != null && !srNo.isBlank()) {
		        query.addCriteria(Criteria.where("srNo").ne(srNo));
		    }
		
		List<RevPolicyEntity> result = mongoTemplate.find(query, RevPolicyEntity.class);
		List<RevPolicyChartModel> policyModels = new ArrayList<>();
		for (RevPolicyEntity entity : result) {
			policyModels.add(toPolicyModel(entity));
		}
		return policyModels;
	}
	
	public RevPolicyChartModel toPolicyModel(RevPolicyEntity entity) {
		RevPolicyChartModel model = new RevPolicyChartModel();
		model.setId(entity.getId());
		model.setDateOfSubmission(entity.getDateOfSubmission());
		return model;
	}

}
