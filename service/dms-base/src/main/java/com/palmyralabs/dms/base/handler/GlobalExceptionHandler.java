package com.palmyralabs.dms.base.handler;

import java.time.DateTimeException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.palmyralabs.dms.base.controller.BaseController;
import com.palmyralabs.dms.base.exception.InvaidInputException;
import com.palmyralabs.dms.base.model.ErrorResponse;
import com.palmyralabs.palmyra.base.exception.EndPointForbiddenException;
import com.palmyralabs.palmyra.base.exception.ResourceAlreadyExistsException;
import com.palmyralabs.palmyra.base.exception.ResourceNotFoundException;
import com.palmyralabs.palmyra.ext.usermgmt.exception.UnAuthorizedException;
import com.zitlab.palmyra.common.exception.PalmyraException;
import com.zitlab.palmyra.store.base.exception.FieldValidationException;
import com.zitlab.palmyra.store.base.exception.MultipleTuplesExistsException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;

@RestControllerAdvice
public class GlobalExceptionHandler extends BaseController {

	@ExceptionHandler(NoSuchKeyException.class)
	public ResponseEntity<ErrorResponse> NoSuchKeyException(NoSuchKeyException e) {
		return notFound(getErrorResponse(e));
	}
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<ErrorResponse> resourceNotFoundException(ResourceNotFoundException e) {
		return notFound(getErrorResponse(e));
	}

	@ExceptionHandler(ResourceAlreadyExistsException.class)
	public ResponseEntity<ErrorResponse> resourceAlreadyExists(ResourceAlreadyExistsException e) {
		return alreadyExists(getErrorResponse(e));
	}

	@ExceptionHandler(UnAuthorizedException.class)
	public ResponseEntity<ErrorResponse> unauthorizedException(UnAuthorizedException e) {
		return unauthorized(getErrorResponse(e));
	}

	@ExceptionHandler(EndPointForbiddenException.class)
	public ResponseEntity<ErrorResponse> unauthorizedException(EndPointForbiddenException e) {
		return forbidden(getErrorResponse(e));
	}

	@ExceptionHandler({ InvaidInputException.class, FieldValidationException.class })
	public ResponseEntity<ErrorResponse> handleInvalidInputException(PalmyraException e) {
		return badRequest(getErrorResponse(e));
	}

	@ExceptionHandler(DateTimeException.class)
	public ResponseEntity<ErrorResponse> handleInvalidInputException(DateTimeException e) {
		return badRequest(getErrorResponse(e));
	}

	@ExceptionHandler(MultipleTuplesExistsException.class)
	public ResponseEntity<ErrorResponse> handleInvalidInputException(MultipleTuplesExistsException e) {
		return badRequest(getErrorResponse(e));
	}

	protected final ResponseEntity<ErrorResponse> badRequest(ErrorResponse response) {
		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	protected ErrorResponse getErrorResponse(RuntimeException e) {
		return new ErrorResponse("Others", e.getMessage());
	}

	private ErrorResponse getErrorResponse(PalmyraException e) {
		return new ErrorResponse(e.getErrorCode(), e.getMessage());
	}
}