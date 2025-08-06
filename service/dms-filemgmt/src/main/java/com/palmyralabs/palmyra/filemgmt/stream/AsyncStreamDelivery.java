package com.palmyralabs.palmyra.filemgmt.stream;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Path;
import java.util.concurrent.Executors;

import com.palmyralabs.palmyra.filemgmt.spring.ResponseFileEmitter;

public class AsyncStreamDelivery {	

	public ResponseFileEmitter push(Path path) throws FileNotFoundException {
		FileInputStream is = new FileInputStream(path.toFile());
		
		ResponseFileEmitter emitter = new ResponseFileEmitter();		

		Executors.newSingleThreadExecutor().execute(new FileSender(emitter, is));

		return emitter;
	}
	
	private static class FileSender implements Runnable{
		private final FileInputStream fis;
		private final ResponseFileEmitter emitter;
		
		public FileSender(ResponseFileEmitter emitter, FileInputStream f) {
			this.fis = f;
			this.emitter = emitter;
		}
		
		@Override
		public void run() {
			byte[] buffer = new byte[16 * 1024];
			int length =0;
			
			try {
				while ((length = fis.read(buffer)) > 0) {
					emitter.send(buffer, length);
				}
				emitter.complete();
			} catch (IOException e) {
				emitter.completeWithError(e); // Handle errors
			}finally {
				try {
					fis.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}			
		}
		
	}
}
