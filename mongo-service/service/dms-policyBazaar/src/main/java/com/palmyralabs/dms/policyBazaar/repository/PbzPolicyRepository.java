package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzPolicyEntity;

public interface PbzPolicyRepository extends MongoRepository<PbzPolicyEntity, Integer>{
	Optional<PbzPolicyEntity> findById(Integer id);

	Optional<PbzPolicyEntity> findByProposalNoAndSoCode(String proposalNo, String soCode);
}
