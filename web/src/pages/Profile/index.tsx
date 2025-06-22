import { useState, useEffect, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Main } from "@/components/layouts/Main";
import { PageHeader } from "@/components/PageHeader";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Table,
  IconButton,
  Chip,
  Modal,
  ModalDialog,
  ModalClose,
  DialogTitle,
  DialogContent,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/joy";
import {
  Settings,
  LogOut,
  Info,
  Copy,
  Plus,
  Edit,
  Lock,
  Camera,
  MoreVertical,
} from "lucide-react";
import dayjs from "dayjs";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getApiTokens,
  createApiToken,
  deleteApiToken,
  uploadAvatar,
  type UserProfile,
  type ApiToken,
  type CreateTokenRequest,
} from "@/api/profile";
import { compressImageToBase64, validateImageFile } from "@/utils/image-compression";

const columnHelper = createColumnHelper<ApiToken>();

export default function ProfileSettings() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal 状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [createTokenModalOpen, setCreateTokenModalOpen] = useState(false);

  // 表单状态
  const [editForm, setEditForm] = useState({
    username: "",
    email: "",
    bio: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [tokenForm, setTokenForm] = useState({
    name: "",
    expiresAt: ""
  });

  // 新建 Token 成功后保存 accessToken
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  // 查询用户信息
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  // 查询 API Tokens
  const { data: tokensData, isLoading: tokensLoading } = useQuery({
    queryKey: ['apiTokens'],
    queryFn: getApiTokens,
  });

  // 当用户信息加载完成后，更新表单
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        username: userProfile.username || "",
        email: userProfile.email || "",
        bio: userProfile.bio || ""
      });
    }
  }, [userProfile]);

  // 更新用户信息
  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      setEditModalOpen(false);
    },
  });

  // 上传头像
  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  // 修改密码
  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
  });

  // 创建 Token
  const createTokenMutation = useMutation({
    mutationFn: createApiToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apiTokens'] });
      setCreateTokenModalOpen(true); // 保持弹窗打开
      setTokenForm({ name: '', expiresAt: '' });
      setCreatedToken(data.accessToken); // 保存 accessToken
    },
  });

  // 删除 Token
  const deleteTokenMutation = useMutation({
    mutationFn: deleteApiToken,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiTokens'] });
    },
  });

  // 处理表单提交
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(editForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("新密码和确认密码不匹配");
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateTokenRequest = {
      name: tokenForm.name,
      expiresAt: tokenForm.expiresAt || undefined,
    };
    createTokenMutation.mutate(data);
  };

  // 处理头像上传
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
        maxSize: 1024 * 1024, // 1MB
      });

      // 上传到服务器
      uploadAvatarMutation.mutate({ avatar: base64Data });
    } catch (error) {
      console.error('头像上传失败:', error);
      alert('头像上传失败，请重试');
    }

    // 清空 input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 复制 Token
  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    // 这里可以添加一个 toast 提示
  };

  // 删除 Token
  const handleDeleteToken = (id: string) => {
    if (confirm("确定要删除这个 Token 吗？删除后无法恢复。")) {
      deleteTokenMutation.mutate(id);
    }
  };

  const columns = useMemo(() => [
    columnHelper.accessor('name', {
      header: '名称',
      cell: info => <Typography level="body-sm">{info.getValue() || 'Session'}</Typography>,
    }),
    columnHelper.accessor('createdAt', {
      header: '创建时间',
      cell: info => dayjs(info.getValue()).format('YYYY/MM/DD HH:mm:ss'),
    }),
    columnHelper.accessor('expiresAt', {
      header: '过期时间',
      cell: info => info.getValue() ? dayjs(info.getValue()).format('YYYY/MM/DD HH:mm:ss') : '永不过期',
    }),
    columnHelper.accessor('lastUsedAt', {
      header: '最后使用',
      cell: info => info.getValue() ? dayjs(info.getValue()).format('YYYY/MM/DD HH:mm:ss') : '从未使用',
    }),
    columnHelper.accessor('isExpired', {
      header: '状态',
      cell: info => (
        <Chip
          size="sm"
          color={info.getValue() ? "danger" : "success"}
          variant="soft"
        >
          {info.getValue() ? "已过期" : "有效"}
        </Chip>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <IconButton
          size="sm"
          color="danger"
          variant="plain"
          onClick={() => handleDeleteToken(row.original.id)}
          disabled={deleteTokenMutation.isPending}
        >
          <LogOut size={16} />
        </IconButton>
      ),
    }),
  ], [deleteTokenMutation.isPending]);


  const table = useReactTable({
    data: tokensData?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // 表格样式参考 MistakePage
  const tableSx = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    '& thead': {
      backgroundColor: '#f8fafc',
    },
    '& th': {
      fontWeight: 600,
      textAlign: 'left',
      padding: '0.75rem 1rem',
      color: '#64748b',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
    },
    '& td': {
      padding: '0.75rem 1rem',
      color: '#334155',
      textAlign: 'left',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: 'white',
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
    '& tbody tr:hover': {
      backgroundColor: '#f8fafc',
    },
  };

  if (profileLoading) {
    return (
      <Main>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Main>
    );
  }

  return (
    <Main>
      <PageHeader
        title="设置"
        description="管理您的个人资料、密码和访问令牌。"
      />
      {/* 账户信息卡片 */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              src={userProfile?.image || "https://avatars.githubusercontent.com/u/45908451"}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography level="h4" sx={{ fontWeight: 'bold' }}>
                {userProfile?.username} <Typography level="body-sm" sx={{ color: 'text.secondary' }}>({userProfile?.email})</Typography>
              </Typography>
              {userProfile?.bio && (
                <Typography level="body-sm" sx={{ color: 'text.secondary', mt: 1, mb: 2 }}>
                  {userProfile.bio}
                </Typography>
              )}
              <Stack direction="row" spacing={1}>
                <Button
                  size="sm"
                  variant="outlined"
                  startDecorator={<Edit size={16} />}
                  onClick={() => setEditModalOpen(true)}
                >
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="outlined"
                  startDecorator={<Lock size={16} />}
                  onClick={() => setPasswordModalOpen(true)}
                >
                  修改密码
                </Button>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Access Token 表格 */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography level="title-lg" sx={{ fontWeight: 'semibold' }}>
                Access Tokens
              </Typography>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                A list of all access tokens for your account.
              </Typography>
            </Box>
            <Button
              color="success"
              startDecorator={<Plus size={16} />}
              onClick={() => setCreateTokenModalOpen(true)}
            >
              创建
            </Button>
          </Box>

          {tokensLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            tokensData?.items.length === 0 ? (
              <Box sx={{ textAlign: 'center', color: '#64748b', py: 4 }}>
                暂无 Token，请点击右上角"创建"按钮
              </Box>
            ) : (
              <Table sx={tableSx}>
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id} style={{ width: header.getSize(), textAlign: 'left' }}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          )}
        </CardContent>
      </Card>

      {/* 编辑信息 Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <ModalDialog size="md">
          <ModalClose />
          <DialogTitle>编辑个人信息</DialogTitle>
          <DialogContent>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={userProfile?.image || "https://avatars.githubusercontent.com/u/45908451"}
                      sx={{ width: 80, height: 80 }}
                    />
                    <IconButton
                      size="sm"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.surface',
                        border: '2px solid',
                        borderColor: 'background.surface',
                        borderRadius: '50%',
                        '&:hover': {
                          bgcolor: 'background.level1',
                        },
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadAvatarMutation.isPending}
                    >
                      {uploadAvatarMutation.isPending ? (
                        <CircularProgress size="sm" />
                      ) : (
                        <Camera size={16} />
                      )}
                    </IconButton>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarUpload}
                    />
                  </Box>
                </Box>
                <FormControl>
                  <FormLabel>用户名</FormLabel>
                  <Input
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>邮箱</FormLabel>
                  <Input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>个人简介</FormLabel>
                  <Textarea
                    minRows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="介绍一下自己..."
                  />
                </FormControl>
                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ pt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setEditModalOpen(false)}
                    disabled={updateProfileMutation.isPending}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? <CircularProgress size="sm" /> : "保存"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* 修改密码 Modal */}
      <Modal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <ModalDialog size="md">
          <ModalClose />
          <DialogTitle>修改密码</DialogTitle>
          <DialogContent>
            <form onSubmit={handlePasswordSubmit}>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel>当前密码</FormLabel>
                  <Input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>新密码</FormLabel>
                  <Input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>确认新密码</FormLabel>
                  <Input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </FormControl>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => setPasswordModalOpen(false)}
                    disabled={changePasswordMutation.isPending}
                  >
                    取消
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    disabled={changePasswordMutation.isPending}
                  >
                    {changePasswordMutation.isPending ? <CircularProgress size="sm" /> : "修改密码"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>

      {/* 创建 Token Modal */}
      <Modal open={createTokenModalOpen} onClose={() => { setCreateTokenModalOpen(false); setCreatedToken(null); }}>
        <ModalDialog size="md">
          <ModalClose />
          <DialogTitle>创建 API Token</DialogTitle>
          <DialogContent>
            {createdToken ? (
              <Alert color="success" sx={{ mb: 2 }}>
                <Info size={16} />
                <Typography level="body-sm">
                  只会展示一次，请复制保存：
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Input
                    value={createdToken}
                    readOnly
                    sx={{ flex: 1, fontFamily: 'monospace' }}
                  />
                  <Button
                    size="sm"
                    sx={{ ml: 1 }}
                    onClick={() => { navigator.clipboard.writeText(createdToken); }}
                  >
                    复制
                  </Button>
                </Box>
              </Alert>
            ) : (
              <Alert color="primary" sx={{ mb: 2 }}>
                <Info size={16} />
                <Typography level="body-sm">
                  API Token 将用于第三方应用程序访问您的账户。请妥善保管，不要泄露给他人。
                </Typography>
              </Alert>
            )}
            {!createdToken && (
              <form onSubmit={handleCreateToken}>
                <Stack spacing={3}>
                  <FormControl>
                    <FormLabel>Token 名称</FormLabel>
                    <Input
                      placeholder="例如：GitHub Integration"
                      value={tokenForm.name}
                      onChange={(e) => setTokenForm({ ...tokenForm, name: e.target.value })}
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>过期时间</FormLabel>
                    <Input
                      type="datetime-local"
                      value={tokenForm.expiresAt}
                      onChange={(e) => setTokenForm({ ...tokenForm, expiresAt: e.target.value })}
                    />
                    <Typography level="body-xs" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      留空表示永不过期
                    </Typography>
                  </FormControl>
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={() => setCreateTokenModalOpen(false)}
                      disabled={createTokenMutation.isPending}
                    >
                      取消
                    </Button>
                    <Button
                      type="submit"
                      color="success"
                      disabled={createTokenMutation.isPending}
                    >
                      {createTokenMutation.isPending ? <CircularProgress size="sm" /> : "创建 Token"}
                    </Button>
                  </Stack>
                </Stack>
              </form>
            )}
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Main>
  );
}
