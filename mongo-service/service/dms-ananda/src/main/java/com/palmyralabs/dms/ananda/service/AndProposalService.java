package com.palmyralabs.dms.ananda.service;

import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndProposalEntity;
import com.palmyralabs.dms.ananda.model.AndProposalModel;
import com.palmyralabs.dms.ananda.modelMapper.AndPolicyModelMapper;
import com.palmyralabs.dms.ananda.repository.AndPolicyRepository;
import com.palmyralabs.dms.model.PaginatedResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndProposalService {

	private final AndPolicyRepository andPolicyRepository;
	private final AndPolicyModelMapper modelMapper;
	private final MongoTemplate mongoTemplate;

	public AndProposalModel createProposal(AndProposalModel model) {
		AndProposalEntity  policyEntity = new AndProposalEntity();
		Optional<AndProposalEntity> dbPolicyOpt = andPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
				model.getBoCode());
		if(dbPolicyOpt.isPresent()) {
			policyEntity = dbPolicyOpt.get();
		}
		policyEntity.setPolicyNumber(model.getPolicyNumber());
		policyEntity.setBoCode(model.getBoCode());
		policyEntity.setAgentCode(model.getAgentCode());
		policyEntity.setAckNo(model.getAckNo());
		policyEntity.setLaName(model.getLaName());
		policyEntity.setProposalType(model.getProposalType());
		policyEntity.setProposalNo(model.getProposalNo());
		policyEntity.setYear(model.getYear());
		policyEntity.setObjectSubmittedOn(model.getObjectSubmittedOn());
		policyEntity.setProcessTime(model.getProcessTime());
		policyEntity.setRequestTime(model.getRequestTime());
		policyEntity.setPlanCode(model.getPlanCode());

		AndProposalEntity savedPolicyEntity = andPolicyRepository.save(policyEntity);
		return modelMapper.toProposalModel(savedPolicyEntity);
	}
	
	public PaginatedResponse<AndProposalModel> searchPolicies(String boCode, String year, String proposalNo,int limit,int offset, boolean includeTotal) {
		int page = offset / limit;
		Pageable pageable = PageRequest.of(page, limit);
	    Query query = new Query();
	    if (boCode != null && !boCode.isBlank()) {
	        query.addCriteria(Criteria.where("boCode").is(boCode));
	    }
	    if (year != null && !year.isBlank()) {
	        query.addCriteria(Criteria.where("year").is(year));
	    }
	    if (proposalNo != null  && !proposalNo.isBlank()) {
	    	 String regex = proposalNo.replace("*", ".*");
	        Document regexMatch = new Document("$regexMatch",
	                new Document("input", new Document("$toString", "$proposalNo"))
	                        .append("regex", regex)
	                        .append("options", "i"));
	        query.addCriteria(Criteria.where("$expr").is(regexMatch));
	    }
	    long total = mongoTemplate.count(query, AndProposalEntity.class);
	    query.with(pageable);
	    List<AndProposalEntity> result = mongoTemplate.find(query, AndProposalEntity.class);
	    List<AndProposalModel> models = result.stream()
	            .map(modelMapper::toProposalModel)
	            .toList();
	     total = includeTotal ? total : 0;
	    return new PaginatedResponse<AndProposalModel>(models,limit,offset, total);
	}

}
