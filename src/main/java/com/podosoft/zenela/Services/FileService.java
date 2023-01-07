package com.podosoft.zenela.Services;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadFile(MultipartFile file);

    boolean deleteFile(String url);

    String uploadThumb(MultipartFile file);
}
