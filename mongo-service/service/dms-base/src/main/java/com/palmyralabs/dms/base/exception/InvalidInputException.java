package com.palmyralabs.dms.base.exception;

import com.zitlab.palmyra.common.exception.PalmyraException;

public class InvalidInputException extends PalmyraException {

	private static final long serialVersionUID = 3139127936672097107L;

	public InvalidInputException(String errorCode, String message) {
		super(errorCode, message);
	}
}
