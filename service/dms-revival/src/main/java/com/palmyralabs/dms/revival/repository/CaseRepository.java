package com.palmyralabs.dms.revival.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.revival.entity.CaseEntity;

public interface CaseRepository extends JpaRepository<CaseEntity, String> {
}
