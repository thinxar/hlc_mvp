package com.palmyralabs.dms.policyBazaar.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.model.PaginatedResponse;
import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;
import com.palmyralabs.dms.policyBazaar.model.PbzProposalLookUpModel;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PbzProposallookupService {

	private final MongoTemplate mongoTemplate;

	public PaginatedResponse<PbzProposalLookUpModel> getAllProposal(String boCode, String year,String proposalNo, int limit, int offset,
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
		long total = mongoTemplate.count(query, PbzProposalEntity.class);
		query.with(pageable);

		List<PbzProposalEntity> entities = mongoTemplate.find(query, PbzProposalEntity.class);
		List<PbzProposalLookUpModel> result = new ArrayList<PbzProposalLookUpModel>();
		for (PbzProposalEntity entity : entities) {
			result.add(toModel(entity));
		}
		total = includeTotal ? total : 0;
		return new PaginatedResponse<PbzProposalLookUpModel>(result, limit, offset, total);
	}

	private PbzProposalLookUpModel toModel(PbzProposalEntity entity) {
		PbzProposalLookUpModel model = new PbzProposalLookUpModel();
		model.setId(entity.getId());
		model.setProposalNo(entity.getProposalNo());
		return model;
	}

}
