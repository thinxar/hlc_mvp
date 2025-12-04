const BYTES_IN_ONE_MB = 1024 * 1024;

const FileUploadConfig = {
  formData: {
    MAX_FILE_SIZE_MB: 25,
    getMaxFileSizeInBytes() {
      return this.MAX_FILE_SIZE_MB * BYTES_IN_ONE_MB;
    },
  },
  tus: {
    MAX_FILE_SIZE_MB: 100,
    getMaxFileSizeInBytes() {
      return this.MAX_FILE_SIZE_MB * BYTES_IN_ONE_MB;
    },
  },
};

export { FileUploadConfig };
