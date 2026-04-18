package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.ananda.entity.AndProposalFileEntity;

public interface AndPolicyFileRepository extends MongoRepository<AndProposalFileEntity, Integer>{


	Optional<AndProposalFileEntity> findByObjectUrl(String objectUrl);

	Optional<AndProposalFileEntity> findById(Integer id);

	AndProposalFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);
	
}
