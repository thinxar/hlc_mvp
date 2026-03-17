package com.palmyralabs.dms.ananda.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.ananda.entity.AndPolicyEntity;

public interface AndPolicyRepository extends MongoRepository<AndPolicyEntity, Integer>{
	Optional<AndPolicyEntity> findById(Integer id);
	
	Optional<AndPolicyEntity> findByProposalNoAndBoCode(String proposalNo, String boCode);
}
