package com.palmyralabs.dms.revival.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.DailyBranchWiseReportEntity;

public interface DailyBranchWiseReportRepository extends MongoRepository<DailyBranchWiseReportEntity, Integer>{
	

}
