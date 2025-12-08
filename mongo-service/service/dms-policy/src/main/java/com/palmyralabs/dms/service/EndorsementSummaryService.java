package com.palmyralabs.dms.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;
import com.palmyralabs.dms.jpa.repository.PolicyFileRepository;
import com.palmyralabs.dms.model.EndorsementSummaryModel;
import com.palmyralabs.dms.model.PaginatedResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EndorsementSummaryService {
	private final PolicyFileRepository policyFileRepository;

	public PaginatedResponse<EndorsementSummaryModel> getEndorsementSummary(Integer policyId, int limit, int offset,
			boolean includeTotal, String orderBy) {

		int page = offset / limit;
		Sort sort = Sort.unsorted();

		if (orderBy != null && !orderBy.isBlank()) {
			List<Sort.Order> orders = Arrays.stream(orderBy.split(",")).map(String::trim).filter(s -> !s.isEmpty())
					.map(s -> {
						Sort.Direction dir = s.startsWith("-") ? Sort.Direction.DESC : Sort.Direction.ASC;
						String field = (s.startsWith("+") || s.startsWith("-")) ? s.substring(1) : s;
						return new Sort.Order(dir, field);
					}).toList();
			sort = Sort.by(orders);
		} else {
			sort = Sort.by("createdOn").descending();
		}

		Pageable pageable = PageRequest.of(page, limit, sort);
		Page<PolicyFileEntity> pageResult = policyFileRepository.findByPolicyId_IdAndDocketType_Id(policyId, 15,
				pageable);
		List<EndorsementSummaryModel> data = pageResult.stream().map(this::toEndorsementSummaryModel).toList();
		long total = includeTotal ? pageResult.getTotalElements() : 0;
		return new PaginatedResponse<>(data, limit, offset, total);
	}

	private EndorsementSummaryModel toEndorsementSummaryModel(PolicyFileEntity fileEntity) {
		EndorsementSummaryModel model = new EndorsementSummaryModel();
		model.setId(fileEntity.getId());
		model.setPolicyId(fileEntity.getPolicyId().getId());
		model.setFileType(fileEntity.getFileType());
		model.setFileName(fileEntity.getFileName());
		model.setCreatedOn(fileEntity.getCreatedOn());
		model.setCreatedBy(fileEntity.getCreatedBy());
		return model;
	}
}
