package com.palmyralabs.dms.neft.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.neft.entity.NeftPolicyFileEntity;

public interface NeftPolicyFileRepository extends MongoRepository<NeftPolicyFileEntity, Integer>{

	Optional<NeftPolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<NeftPolicyFileEntity> findById(Integer id);

	NeftPolicyFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);

	List<NeftPolicyFileEntity> findByPolicyId_IdOrderByDocketTypeAsc(Integer policyId);

}
