package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.ananda.entity.AndProposalEntity;

public interface AndPolicyRepository extends JpaRepository<AndProposalEntity, Integer>{
	Optional<AndProposalEntity> findById(Integer id);
	
	Optional<AndProposalEntity> findByProposalNoAndBoCode(String proposalNo, String boCode);
}
