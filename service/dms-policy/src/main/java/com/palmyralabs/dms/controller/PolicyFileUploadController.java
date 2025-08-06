package com.palmyralabs.dms.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "${palmyra.servlet.prefix-path:#{'palmyra'}}/policy/{policy_id}/file")
public class PolicyFileUploadController {

}
