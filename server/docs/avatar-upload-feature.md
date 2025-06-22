# 头像上传功能实现文档

## 概述

实现了基于 base64 的头像上传功能，支持图片压缩和验证，将头像数据直接存储在数据库中。

## 功能特性

### 1. 头像存储方式
- **Base64 存储**: 头像以 base64 格式直接存储在数据库的 `image` 字段中
- **无需文件服务**: 不需要额外的文件存储服务（如 S3）
- **简单部署**: 减少了外部依赖，简化了部署流程

### 2. 前端图片处理
- **自动压缩**: 上传前自动压缩图片尺寸和质量
- **格式验证**: 验证文件类型和大小
- **用户体验**: 实时预览和上传状态反馈

### 3. 后端验证
- **格式验证**: 验证 base64 图片格式
- **大小限制**: 限制文件大小（1MB）
- **安全处理**: 防止恶意文件上传

## 技术实现

### 1. 数据库设计

#### UserEntity 更新
```typescript
@Column({
  type: 'text',
  nullable: true,
})
bio?: string;

@Column({ default: '' })
image?: string; // 存储 base64 头像数据
```

#### 数据库迁移
```sql
ALTER TABLE "user" ADD "bio" character varying(500);
```

### 2. 后端 API

#### 新增 DTO
```typescript
export class UploadAvatarReqDto {
  @StringField()
  @IsString()
  @IsNotEmpty()
  avatar: string; // base64 编码的图片数据
}
```

#### 新增 Service 方法
```typescript
async uploadAvatar(userId: Uuid, uploadAvatarDto: UploadAvatarReqDto): Promise<UserResDto> {
  const user = await this.userRepository.findOneByOrFail({ id: userId });

  // 验证 base64 图片数据
  const { avatar } = uploadAvatarDto;
  
  // 检查格式
  if (!avatar.startsWith('data:image/')) {
    throw new ValidationException(ErrorCode.E004);
  }

  // 检查文件大小
  const base64Data = avatar.split(',')[1];
  const fileSizeInBytes = Math.ceil((base64Data.length * 3) / 4);
  const maxSizeInBytes = 1024 * 1024; // 1MB

  if (fileSizeInBytes > maxSizeInBytes) {
    throw new ValidationException(ErrorCode.E005);
  }

  // 更新用户头像
  user.image = avatar;
  user.updatedBy = userId;

  const savedUser = await this.userRepository.save(user);
  return plainToInstance(UserResDto, savedUser);
}
```

#### 新增 API 端点
```typescript
@Post('avatar')
async uploadAvatar(
  @CurrentUser('id') userId: Uuid,
  @Body() uploadAvatarDto: UploadAvatarReqDto,
): Promise<UserResDto> {
  return await this.userService.uploadAvatar(userId, uploadAvatarDto);
}
```

### 3. 前端实现

#### 图片压缩工具
```typescript
export const compressImageToBase64 = async (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  const {
    maxWidth = 200,
    maxHeight = 200,
    quality = 0.8,
    maxSize = 1024 * 1024
  } = options;

  // 使用 Canvas API 进行图片压缩
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  // 计算新尺寸
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

  // 绘制和压缩
  canvas.width = width;
  canvas.height = height;
  ctx?.drawImage(img, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else {
          reject(new Error('Failed to compress image'));
        }
      },
      file.type,
      quality
    );
  });
};
```

#### 头像上传组件
```typescript
const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // 验证文件
  const validation = validateImageFile(file);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  try {
    // 压缩图片并转换为 base64
    const base64Data = await compressImageToBase64(file, {
      maxWidth: 200,
      maxHeight: 200,
      quality: 0.8,
      maxSize: 1024 * 1024,
    });

    // 上传到服务器
    uploadAvatarMutation.mutate({ avatar: base64Data });
  } catch (error) {
    console.error('头像上传失败:', error);
    alert('头像上传失败，请重试');
  }
};
```

## 安全考虑

### 1. 文件验证
- **类型检查**: 只允许图片文件类型
- **大小限制**: 限制文件大小为 1MB
- **格式验证**: 验证 base64 数据格式

### 2. 数据安全
- **用户隔离**: 用户只能上传自己的头像
- **认证要求**: 所有头像操作都需要用户认证
- **输入验证**: 使用 class-validator 进行输入验证

### 3. 错误处理
- **友好提示**: 提供用户友好的错误信息
- **异常捕获**: 完善的异常处理机制
- **回滚机制**: 上传失败时不影响现有数据

## 性能优化

### 1. 前端优化
- **图片压缩**: 上传前自动压缩，减少传输量
- **尺寸限制**: 限制图片最大尺寸为 200x200
- **质量控制**: 可配置的压缩质量参数

### 2. 后端优化
- **大小限制**: 限制 base64 数据大小
- **缓存策略**: 可考虑添加头像缓存
- **数据库优化**: 考虑将大文件分离存储

### 3. 用户体验
- **实时反馈**: 上传过程中显示加载状态
- **预览功能**: 上传前可预览图片
- **错误提示**: 清晰的错误信息提示

## 使用方式

### 1. 用户操作
1. 点击头像右下角的相机图标
2. 选择图片文件
3. 系统自动压缩并上传
4. 上传成功后立即显示新头像

### 2. API 调用
```typescript
// 上传头像
const response = await uploadAvatar({
  avatar: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
});
```

### 3. 数据库查询
```sql
-- 获取用户头像
SELECT image FROM "user" WHERE id = 'user-id';
```

## 错误码

### 新增错误码
- **E004**: `user.error.invalid_image_format` - 无效的图片格式
- **E005**: `user.error.file_too_large` - 文件过大
- **E006**: `user.error.invalid_password` - 密码错误

## 未来扩展

### 1. 功能增强
- **裁剪功能**: 添加图片裁剪功能
- **滤镜效果**: 支持简单的滤镜效果
- **多尺寸**: 支持生成多种尺寸的头像

### 2. 存储优化
- **CDN 集成**: 集成 CDN 服务
- **对象存储**: 迁移到对象存储服务
- **缓存策略**: 实现头像缓存机制

### 3. 性能提升
- **懒加载**: 实现头像懒加载
- **预加载**: 预加载常用头像
- **压缩算法**: 使用更高效的压缩算法

## 总结

通过实现基于 base64 的头像上传功能，我们获得了以下优势：

1. **简化架构**: 无需额外的文件存储服务
2. **易于部署**: 减少了外部依赖
3. **用户体验**: 自动压缩和实时反馈
4. **安全性**: 完善的验证和错误处理
5. **可维护性**: 清晰的代码结构和文档

这个实现为 Profile 页面提供了完整的头像管理功能，确保了系统的稳定性和用户体验。 