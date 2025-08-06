package com.palmyralabs.dms.base.exception;

import com.zitlab.palmyra.common.exception.PalmyraException;

public class InvaidInputException extends PalmyraException {

	private static final long serialVersionUID = 3139127936672097107L;

	public InvaidInputException(String errorCode, String message) {
		super(errorCode, message);
	}
}
