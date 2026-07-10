package com.palmyralabs.dms.revival.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.revival.entity.RevPolicyFileEntity;

public interface RevPolicyFileRepository extends JpaRepository<RevPolicyFileEntity, Integer>{

	Optional<RevPolicyFileEntity> findByObjectUrl(String objectUrl);

	Optional<RevPolicyFileEntity> findById(Integer id);

	RevPolicyFileEntity findByPolicyId_IdAndId(Integer policyId, Integer fileId);

}
