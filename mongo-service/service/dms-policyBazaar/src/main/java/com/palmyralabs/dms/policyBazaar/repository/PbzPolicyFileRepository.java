package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzPolicyFileEntity;

public interface PbzPolicyFileRepository extends MongoRepository<PbzPolicyFileEntity, Integer> {

	Optional<PbzPolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<PbzPolicyFileEntity> findById(Integer id);

	PbzPolicyFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);

}
