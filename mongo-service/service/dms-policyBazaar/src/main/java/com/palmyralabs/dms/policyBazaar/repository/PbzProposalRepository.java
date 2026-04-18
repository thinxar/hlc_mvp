package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;

public interface PbzProposalRepository extends MongoRepository<PbzProposalEntity, Integer>{
	Optional<PbzProposalEntity> findById(Integer id);

	Optional<PbzProposalEntity> findByProposalNoAndBoCode(String proposalNo, String boCode);
}
