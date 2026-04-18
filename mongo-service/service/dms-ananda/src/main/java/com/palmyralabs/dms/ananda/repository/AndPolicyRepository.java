package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.ananda.entity.AndProposalEntity;

public interface AndPolicyRepository extends MongoRepository<AndProposalEntity, Integer>{
	Optional<AndProposalEntity> findById(Integer id);
	
	Optional<AndProposalEntity> findByProposalNoAndBoCode(String proposalNo, String boCode);
}
