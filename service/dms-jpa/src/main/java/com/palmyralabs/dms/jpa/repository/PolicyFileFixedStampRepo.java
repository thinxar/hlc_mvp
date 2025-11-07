package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.jpa.entity.PolicyFileFixedStampEntity;

public interface PolicyFileFixedStampRepo  extends JpaRepository<PolicyFileFixedStampEntity, Integer>{

	Optional<PolicyFileFixedStampEntity> findByPolicyFileAndStamp(Long fileId, Long stampId);


}
