package com.palmyralabs.dms.revival.service;

import java.time.LocalDate;
import java.util.Arrays;
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
import org.springframework.data.domain.Sort;

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
		if (dbPolicyOpt.isPresent()) {
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
		if (model.getSrNo() != null)
			policyEntity.setUploadedBy(model.getSrNo());
		policyEntity.setSoCode(model.getSoCode());
		RevPolicyEntity savedPolicyEntity = revPolicyRepository.save(policyEntity);
		return modelMapper.toPolicyModel(savedPolicyEntity);
	}

	public PaginatedResponse<RevPolicyModel> searchPolicies(String soCode, String srNo, String policyNumber, int limit,
			int offset, boolean includeTotal, String dos, String orderBy) {

		int page = offset / limit;
		Query query = new Query();
		if (soCode != null && !soCode.isBlank()) {
			query.addCriteria(Criteria.where("soCode").is(soCode));
		}
		if (srNo != null && !srNo.isBlank()) {
			query.addCriteria(Criteria.where("srNo").ne(srNo));
		}
		if (policyNumber != null && !policyNumber.isBlank()) {
			String regex = policyNumber.replace("*", ".*");

			Document regexMatch = new Document("$regexMatch",
					new Document("input", new Document("$toString", "$policyNumber")).append("regex", regex)
							.append("options", "i"));

			query.addCriteria(Criteria.where("$expr").is(regexMatch));
		}
		if (dos != null && !dos.isBlank()) {
			applyDosFilter(query, dos);
		}
		Pageable pageable = PageRequest.of(page, limit, getSort(orderBy));
		long total = mongoTemplate.count(query, RevPolicyEntity.class);
		query.with(pageable);
		List<RevPolicyEntity> result = mongoTemplate.find(query, RevPolicyEntity.class);
		List<RevPolicyModel> models = result.stream().map(modelMapper::toPolicyModel).toList();
		total = includeTotal ? total : 0;
		return new PaginatedResponse<>(models, limit, offset, total);
	}
	
	private void applyDosFilter(Query query, String dos) {
		LocalDate today = LocalDate.now();
		Criteria criteria = switch (dos.trim()) {
		case "<3" -> Criteria.where("dateOfSubmission").gt(today.minusDays(3)).lte(today);
		case "3-10" -> Criteria.where("dateOfSubmission").gte(today.minusDays(10)).lte(today.minusDays(3));
		case ">10" -> Criteria.where("dateOfSubmission").lt(today.minusDays(10));
		default -> null;
		};
		if (criteria != null) {
			query.addCriteria(criteria);
		}
	}

	private Sort getSort(String orderBy) {
		if (orderBy == null || orderBy.isBlank()) {
			return Sort.by(Sort.Direction.DESC, "_id");
		}
		List<Sort.Order> orders = Arrays.stream(orderBy.split(",")).map(String::trim).filter(s -> !s.isEmpty())
				.map(this::toSortOrder).toList();
		return Sort.by(orders);
	}

	private Sort.Order toSortOrder(String value) {
		Sort.Direction direction = value.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
		String field = (value.startsWith("+") || value.startsWith("-")) ? value.substring(1) : value;
		return new Sort.Order(direction, field);
	}
}
