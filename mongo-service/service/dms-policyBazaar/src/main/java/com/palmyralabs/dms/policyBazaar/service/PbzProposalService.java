package com.palmyralabs.dms.policyBazaar.service;

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
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalModel;
import com.palmyralabs.dms.policyBazaar.modelMapper.PbzProposalModelMapper;
import com.palmyralabs.dms.policyBazaar.repository.PbzProposalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzProposalService {

	private final PbzProposalRepository PbzPolicyRepository;
	private final PbzProposalModelMapper modelMapper;
	private final MongoTemplate mongoTemplate;

	public PbzProposalModel createPolicy(PbzProposalModel model) {
		PbzProposalEntity policyEntity = new PbzProposalEntity();
		Optional<PbzProposalEntity> dbPolicyOpt = PbzPolicyRepository.findByProposalNoAndBoCode(model.getProposalNo(),
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
		policyEntity.setDob(model.getDob());
		policyEntity.setMobileNo(model.getMobileNo());

		PbzProposalEntity savedPolicyEntity = PbzPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}
	
	public PaginatedResponse<PbzProposalModel> searchPolicies(String boCode, String year, String proposalNo,int limit,int offset, boolean includeTotal) {
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
	    long total = mongoTemplate.count(query, PbzProposalEntity.class);
	    query.with(pageable);
	    List<PbzProposalEntity> result = mongoTemplate.find(query, PbzProposalEntity.class);
	    List<PbzProposalModel> models = result.stream()
	            .map(modelMapper::toPolicyModel)
	            .toList();
	     total = includeTotal ? total : 0;
	    return new PaginatedResponse<PbzProposalModel>(models,limit,offset, total);
	}

}
