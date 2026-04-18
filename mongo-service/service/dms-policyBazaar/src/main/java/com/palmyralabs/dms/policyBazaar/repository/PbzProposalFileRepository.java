package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzProposalFileEntity;

public interface PbzProposalFileRepository extends MongoRepository<PbzProposalFileEntity, Integer> {

	Optional<PbzProposalFileEntity> findByObjectUrl(String objectUrl);

	Optional<PbzProposalFileEntity> findById(Integer id);

	PbzProposalFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);

}
