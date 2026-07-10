package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.ananda.entity.AndProposalFileEntity;

public interface AndPolicyFileRepository extends JpaRepository<AndProposalFileEntity, Integer>{


	Optional<AndProposalFileEntity> findByObjectUrl(String objectUrl);

	Optional<AndProposalFileEntity> findById(Integer id);

	AndProposalFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);
	
}
