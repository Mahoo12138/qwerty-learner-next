/**
 * 图片压缩工具
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSize?: number; // 最大文件大小 (bytes)
}

/**
 * 将文件转换为 base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * 压缩图片
 */
export const compressImage = (
  file: File,
  options: CompressOptions = {}
): Promise<File> => {
  const {
    maxWidth = 200,
    maxHeight = 200,
    quality = 0.8,
    maxSize = 1024 * 1024 // 1MB
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // 设置 canvas 尺寸
      canvas.width = width;
      canvas.height = height;

      // 绘制图片
      ctx?.drawImage(img, 0, 0, width, height);

      // 转换为 blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            // 检查文件大小
            if (blob.size > maxSize) {
              // 如果还是太大，进一步压缩
              const newQuality = Math.max(0.1, quality * (maxSize / blob.size));
              canvas.toBlob(
                (newBlob) => {
                  if (newBlob) {
                    const compressedFile = new File([newBlob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                  } else {
                    reject(new Error('Failed to compress image'));
                  }
                },
                file.type,
                newQuality
              );
            } else {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            }
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 压缩图片并转换为 base64
 */
export const compressImageToBase64 = async (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  const compressedFile = await compressImage(file, options);
  return await fileToBase64(compressedFile);
};

/**
 * 验证图片文件
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '请选择图片文件' };
  }

  // 检查文件大小 (10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: '图片文件过大，请选择小于 10MB 的图片' };
  }

  return { valid: true };
}; 