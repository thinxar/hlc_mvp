package com.palmyralabs.dms.jpa.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.palmyralabs.dms.jpa.entity.FixedStampEntity;

public interface FixedStampRepo extends JpaRepository<FixedStampEntity, Integer>{

	Optional<FixedStampEntity> findById(Long id);

	Optional<FixedStampEntity> findByCode(String code);

}
