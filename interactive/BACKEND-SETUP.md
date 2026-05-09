# 后端接入说明

这个项目现在还是静态网页，但已经准备好接 Supabase 后端

## 本地开发

```powershell
npm install
npm run dev
```

打开终端里显示的本地地址即可预览

## Supabase 需要创建的能力

1. Auth：邮箱登录、验证码登录、第三方登录
2. Database：用户资料、收藏、评论、投稿、通知、消息
3. Storage：头像、作品图、PDF 文件
4. Realtime：评论刷新、通知、聊天
5. RLS：权限规则，限制用户只能改自己的数据

## 环境变量

复制 `.env.example` 为 `.env.local`，填入 Supabase 项目的公开配置

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

注意：`anon key` 可以放前端，但 `service role key` 绝对不能放进前端文件

## 推荐数据表

```text
profiles
resources
favorites
comments
submissions
notifications
messages
```

## 功能开发顺序

1. 登录注册
2. 用户资料
3. 收藏
4. 评论
5. 投稿和作品展示
6. 文件上传
7. 表单发邮件
8. 实时通知和聊天
