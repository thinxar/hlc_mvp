package com.palmyralabs.palmyra.filemgmt.stream;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

@Service
public class AsyncStreamDelivery {

	private TaskExecutor fileSenderTaskExecutor;

	public ResponseFileEmitter push(Path path) throws FileNotFoundException {
		return push(path.toFile());
	}

	public ResponseFileEmitter push(File file) throws FileNotFoundException {
		FileInputStream is = new FileInputStream(file);

		ResponseFileEmitter emitter = new ResponseFileEmitter();

		fileSenderTaskExecutor.execute(new FileSender(emitter, is));

		return emitter;
	}

	private static class FileSender implements Runnable {
		private final FileInputStream fis;
		private final ResponseFileEmitter emitter;

		public FileSender(ResponseFileEmitter emitter, FileInputStream f) {
			this.fis = f;
			this.emitter = emitter;
		}

		@Override
		public void run() {
			byte[] buffer = new byte[16 * 1024];
			int length = 0;

			try {
				while ((length = fis.read(buffer)) > 0) {
					emitter.send(buffer, length);
				}
				emitter.complete();
			} catch (IOException e) {
				emitter.completeWithError(e); // Handle errors
			} finally {
				try {
					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}

	}

	@Autowired
	@Qualifier("fileSenderTaskExecutor")
	public void setTileSenderTaskExecutor(TaskExecutor ex) {
		this.fileSenderTaskExecutor = ex;
	}
}
