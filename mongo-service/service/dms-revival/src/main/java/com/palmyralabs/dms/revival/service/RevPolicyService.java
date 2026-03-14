package com.palmyralabs.dms.revival.service;

import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.revival.entity.RevPolicyEntity;
import com.palmyralabs.dms.revival.model.RevPolicyModel;
import com.palmyralabs.dms.revival.modelMapper.RevPolicyModelMapper;
import com.palmyralabs.dms.revival.repository.RevPolicyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RevPolicyService {

	private final MongoTemplate mongoTemplate;
	private final RevPolicyRepository revPolicyRepository;
	private final RevPolicyModelMapper modelMapper;
	
	public RevPolicyModel createPolicy(RevPolicyModel model) {
		RevPolicyEntity policyEntity = new RevPolicyEntity();
		Optional<RevPolicyEntity> dbPolicyOpt = revPolicyRepository.findByPolicyNumberAndSoCode(model.getPolicyNumber(),
				model.getSoCode());
		if(dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}
		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setBoCode(model.getBoCode());
		policyEntity.setAsrNo(model.getAsrNo());
		policyEntity.setDateOfSubmission(model.getDateOfSubmission());
		policyEntity.setDoCode(model.getDoCode());
		policyEntity.setDocSubType(model.getDocSubType());
		policyEntity.setDocType(model.getDocType());
		policyEntity.setSrNo(model.getSrNo());
		if(model.getSrNo()!=null)
		policyEntity.setUploadedBy(model.getSrNo());
		policyEntity.setSoCode(model.getSoCode());
		RevPolicyEntity savedPolicyEntity = revPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}
	

	public PaginatedResponse<RevPolicyModel> searchPolicies(String soCode, String srNo, String policyNumber,int limit,int offset, boolean includeTotal) {
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
	    long total = mongoTemplate.count(query, RevPolicyEntity.class);
	    query.with(pageable);
	    List<RevPolicyEntity> result = mongoTemplate.find(query, RevPolicyEntity.class);
	    List<RevPolicyModel> models = result.stream()
	            .map(modelMapper::toPolicyModel)
	            .toList();
	     total = includeTotal ? total : 0;
	    return new PaginatedResponse<RevPolicyModel>(models,limit,offset, total);
	}
	
}
