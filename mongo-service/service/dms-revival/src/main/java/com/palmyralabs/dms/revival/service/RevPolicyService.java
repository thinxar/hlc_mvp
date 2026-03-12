package com.palmyralabs.dms.revival.service;

import java.util.List;

import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.jpa.entity.PolicyEntity;
import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.model.PolicyModel;
import com.palmyralabs.dms.modelMapper.PolicyModelMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyService {

	private final PolicyModelMapper modelMapper;
	private final MongoTemplate mongoTemplate;

	public PaginatedResponse<PolicyModel> searchPolicies(String soCode, String srNo, String policyNumber,int limit,int offset, boolean includeTotal) {
		
		int page = offset / limit;
		Pageable pageable = PageRequest.of(page, limit);
		
	    Query query = new Query();
	    if (soCode != null && !soCode.isBlank()) {
	        query.addCriteria(Criteria.where("soCode").is(soCode));
	    }
	    if (srNo != null && !srNo.isBlank()) {
	        query.addCriteria(Criteria.where("srNo").is(srNo));
	    }
	    if (policyNumber != null  && !policyNumber.isBlank()) {
	    	 String regex = policyNumber.replace("*", ".*");
	        Document regexMatch = new Document("$regexMatch",
	                new Document("input", new Document("$toString", "$policyNumber"))
	                        .append("regex", regex)
	                        .append("options", "i"));
	        query.addCriteria(Criteria.where("$expr").is(regexMatch));
	    }
	    
	    long total = mongoTemplate.count(query, PolicyEntity.class);
	    query.with(pageable);
	    List<PolicyEntity> result = mongoTemplate.find(query, PolicyEntity.class);
	    List<PolicyModel> models = result.stream()
	            .map(modelMapper::toPolicyModel)
	            .toList();
	     total = includeTotal ? total : 0;
	    return new PaginatedResponse<PolicyModel>(models,limit,offset, total);
	}
}
