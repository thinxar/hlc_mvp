package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.jpa.entity.PolicyEntity;

public interface PolicyRepository extends JpaRepository<PolicyEntity, Integer>{

	Optional<PolicyEntity> findById(Long id);

}
