package com.palmyralabs.dms.ananda.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.ananda.entity.AndProposalEntity;
import com.palmyralabs.dms.ananda.model.AndProposalLookUpModel;
import com.palmyralabs.dms.model.PaginatedResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AndPolicylookupService {

	private final MongoTemplate mongoTemplate;
//	private final AndPolicyRepository andPolicyRepository;

	public PaginatedResponse<AndProposalLookUpModel> getAllProposal(String boCode, String year,String proposalNo, int limit, int offset,
			boolean includeTotal) {
		int page = offset / limit;
		Pageable pageable = PageRequest.of(page, limit);
		Query query = new Query();
		if (boCode != null && !boCode.isBlank()) {
			query.addCriteria(Criteria.where("boCode").is(boCode));
		}
		if (year != null && !year.isBlank()) {
			query.addCriteria(Criteria.where("year").is(year));
		}
		if (proposalNo != null && !proposalNo.isBlank()) {
			String regex = proposalNo.replace("*", ".*");

			Document regexMatch = new Document("$regexMatch",
					new Document("input", new Document("$toString", "$proposalNo")).append("regex", regex)
							.append("options", "i"));

			query.addCriteria(Criteria.where("$expr").is(regexMatch));
		}
		long total = mongoTemplate.count(query, AndProposalEntity.class);
		query.with(pageable);

		List<AndProposalEntity> entities = mongoTemplate.find(query, AndProposalEntity.class);
		List<AndProposalLookUpModel> result = new ArrayList<AndProposalLookUpModel>();
		for (AndProposalEntity entity : entities) {
			result.add(toModel(entity));
		}
		total = includeTotal ? total : 0;
		return new PaginatedResponse<AndProposalLookUpModel>(result, limit, offset, total);
	}

	private AndProposalLookUpModel toModel(AndProposalEntity entity) {
		AndProposalLookUpModel model = new AndProposalLookUpModel();
		model.setId(entity.getId());
		model.setProposalNo(entity.getProposalNo());
		return model;
	}

}
