package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzProposalEntity;

public interface PbzProposalRepository extends JpaRepository<PbzProposalEntity, Integer>{
	Optional<PbzProposalEntity> findById(Integer id);

	Optional<PbzProposalEntity> findByProposalNoAndBoCode(String proposalNo, String boCode);
}
