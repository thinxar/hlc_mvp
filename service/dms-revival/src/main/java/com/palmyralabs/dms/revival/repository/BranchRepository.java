package com.palmyralabs.dms.revival.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.revival.entity.BranchEntity;

public interface BranchRepository extends JpaRepository<BranchEntity, Integer> {

	long countByDoCode(String doCode);
}
