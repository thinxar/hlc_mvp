const ErrorMsgConfig = {
    form: {
        mandatory: "This field is mandatory.",
        number: "Please enter a valid number.",
        email: "Please enter a valid email.",
        alphabet: "Only alphabets are allowed in the field.",
        phNum: "Please enter a valid phone number.",
        panNum: "Please enter a valid PAN number.",
        gstNum: "Please enter a valid GST number.",
        ifsccode: "Please enter a valid IFSC number."
    },
    toast: {
        create: "Data saved successfully!",
        update: "Data updated successfully!",
        dataExist: 'Data Already Exist',
        resetPwd: 'Password Reset SuccessFully..',
        invalidLogin: 'Invalid Credentials',
        lglHearingDate: "NextHearingDate should be greater than the HearingDate",
        acl: "You are not authorized to perform this operation.",
        groupNotFound: 'No groups found for this user. Please add a group to continue.',
        serverError: 'Server error occurred, Please try again later!..',
        fileLengthError: 'File too large. Max allowed size is 5MB.',
        fileUploadSuccess: 'File Uploaded Successfully!..'
    }
}

export { ErrorMsgConfig };
