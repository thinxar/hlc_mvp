package com.palmyralabs.dms.policyBazaar.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.policyBazaar.entity.PbzProposalFileEntity;

public interface PbzProposalFileRepository extends JpaRepository<PbzProposalFileEntity, Integer> {

	Optional<PbzProposalFileEntity> findByObjectUrl(String objectUrl);

	Optional<PbzProposalFileEntity> findById(Integer id);

	PbzProposalFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);

}
