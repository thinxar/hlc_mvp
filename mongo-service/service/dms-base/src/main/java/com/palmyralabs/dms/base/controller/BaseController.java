package com.palmyralabs.dms.base.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.palmyralabs.dms.base.model.ErrorResponse;
import com.palmyralabs.palmyra.core.rest.service.NativeQueryExportService;
import com.palmyralabs.palmyra.handlers.NativeQueryResponse;

public abstract class BaseController {
//	private NativeQueryExportService exportService;
//	private RequestInfoProvider requestInfoProvider;

//	protected void asJson(NativeQueryResponse query) {
//		exportService.asJson(query);
//	}

//	protected void export(NativeQueryResponse query, CustomFormatWriterFactory writerFactory) {
//		HttpServletRequest request = requestInfoProvider.getServletRequest();
//
//		String exportFormat = request.getParameter("_format");
//		if (null == exportFormat)
//			exportService.asJson(query);
//		else {
//			exportService.export(query, writerFactory.getWriter(exportFormat));
//		}
//	}

//	@Autowired
//	public void setExportService(NativeQueryExportService exportService) {
//		this.exportService = exportService;
//	}
//
//	@Autowired
//	public void setRequestInfoProvider(RequestInfoProvider requestInfoProvider) {
//		this.requestInfoProvider = requestInfoProvider;
//	}

	protected final <R> ResponseEntity<R> response(R val) {
		if (null == val) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(val, HttpStatus.OK);
		}
	}

	protected final <R> ResponseEntity<R> response(Optional<R> val) {
		if (val.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<>(val.get(), HttpStatus.OK);
		}
	}

	protected final ResponseEntity<Void> noContent() {
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	protected final ResponseEntity<Void> ok() {
		return new ResponseEntity<>(HttpStatus.OK);
	}

	protected final <R> ResponseEntity<R> ok(R val) {
		return new ResponseEntity<>(val, HttpStatus.OK);
	}

	protected final ResponseEntity<ErrorResponse> notFound(ErrorResponse response) {
		return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
	}

	protected final ResponseEntity<ErrorResponse> alreadyExists(ErrorResponse response) {
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	protected final ResponseEntity<ErrorResponse> unauthorized(ErrorResponse response) {
		return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
	}

	protected final ResponseEntity<Void> unauthorized() {
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	protected final ResponseEntity<ErrorResponse> forbidden(ErrorResponse response) {
		return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
	}

	protected final ResponseEntity<Void> forbidden() {
		return new ResponseEntity<>(HttpStatus.FORBIDDEN);
	}
}
