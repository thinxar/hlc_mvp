package com.palmyralabs.dms.revival.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.palmyralabs.dms.revival.entity.MonthWiseReportEntity;

public interface MonthWiseReportRepo extends MongoRepository<MonthWiseReportEntity, Integer>{
	

}
