const ErrorMsgConfig = {
    form: {
        mandatory: "This field is mandatory.",
        number: "Please enter a valid number.",
        email: "Please enter a valid email.",
        alphabet: "Only alphabets are allowed in the field.",
        phNum: "Please enter a valid phone number.",
    },
    toast: {
        create: "Data saved successfully!",
        update: "Data updated successfully!",
        dataExist: 'Data Already Exist',
        resetPwd: 'Password Reset SuccessFully..',
        invalidLogin: 'Invalid Credentials',
        groupNotFound: 'No groups found for this user. Please add a group to continue.',
        serverError: 'Server error occurred, Please try again later!..',
        fileLengthError: 'File too large. Max allowed size is 5MB.',
        fileUploadSuccess: 'File Uploaded Successfully!..'
    }
}

export { ErrorMsgConfig };
