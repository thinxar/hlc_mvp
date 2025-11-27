//package com.palmyra.dms.jpa.config;
//
//import java.time.LocalDateTime;
//
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//
//import com.palmyralabs.dms.jpa.entity.Auditable;
//import com.palmyralabs.dms.jpa.entity.Timestamps;
//
//import jakarta.persistence.PrePersist;
//import jakarta.persistence.PreUpdate;
//
//public class AuditListener {
//	
//	@PrePersist
//	public void setCreatedOn(Auditable auditable) {
//			
//		Timestamps audit = auditable.getTimestamps();
//
//		if (audit == null) {
//			audit = new Timestamps();
//			auditable.setTimestamps(audit);
//		}
//
//		audit.setCreatedOn(LocalDateTime.now());
//		audit.setCreatedBy(getCurrentUser());
//	}
//
//	@PreUpdate
//	public void setUpdatedOn(Auditable auditable) {
//		Timestamps audit = auditable.getTimestamps();
//
//		if (audit == null) {
//			audit = new Timestamps();
//			auditable.setTimestamps(audit);
//		}
//
//		audit.setLastUpdOn(LocalDateTime.now());
//		audit.setLastUpdBy(getCurrentUser());
//	}
//
//	private String getCurrentUser() {
//		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//		return auth.getName();
//	}
//}


