package com.palmyralabs.dms.jpa.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.jpa.entity.PolicyFileEntity;

public interface PolicyFileRepository extends JpaRepository<PolicyFileEntity, Integer>{

	PolicyFileEntity findByPolicyIdAndId(Integer id,Integer fileId);

}
