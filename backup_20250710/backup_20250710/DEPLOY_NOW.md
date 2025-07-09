# 🚀 立即部署到 maopi.me - 操作指南

## ✅ **准备工作已完成**

完整部署脚本已验证所有文件正确：
- ✅ **PI配置正确**: 1,000 PI/次
- ✅ **无错误残留**: 已清除 10,000 PI 和 85% 显示
- ✅ **部署包就绪**: `maopi-deployment-v3.2.1-final.tar.gz` (695KB)

---

## 🎯 **立即部署操作**

### **选择部署方式**：

### **方式A：FTP客户端部署（推荐新手）**

1. **打开FTP客户端**（如FileZilla、WinSCP）
2. **连接到 maopi.me 服务器**
3. **导航到网站根目录**
4. **上传文件**：
   ```
   上传目录：./temp_deploy/
   包含文件：index.html, game.html, _next/, components/, 等
   ```
5. **确保覆盖**：特别是 `index.html` 和 `game.html`

### **方式B：命令行部署（推荐有经验用户）**

```bash
# 上传所有文件到maopi.me
scp -r temp_deploy/* user@maopi.me:/path/to/website/

# 或者先上传压缩包再解压
scp maopi-deployment-v3.2.1-final.tar.gz user@maopi.me:/tmp/
ssh user@maopi.me
cd /path/to/website/
tar -xzf /tmp/maopi-deployment-v3.2.1-final.tar.gz
```

---

## 🔧 **服务器端操作**

上传完成后，在maopi.me服务器执行：

```bash
# 1. 设置文件权限
chmod 644 *.html
chmod 755 _next/ components/ mobile/ pages/
chmod -R 644 _next/* components/* mobile/* pages/*

# 2. 重启Web服务器
sudo systemctl restart nginx
# 或
sudo systemctl restart apache2

# 3. 清除服务器缓存
sudo rm -rf /var/cache/nginx/*
```

---

## 🔍 **立即验证**

部署完成后立即测试：

### **基础验证**
```bash
# 检查主页PI配置（应显示1,000 PI/次）
curl -s "http://maopi.me" | grep "PI/次"

# 检查概率显示（应该无结果）
curl -s "http://maopi.me" | grep "85%"
```

### **浏览器验证**
访问 `http://maopi.me` 确认：
- ✅ 显示 "1,000 PI/次"（不是 10,000）
- ✅ 无 "85%" 概率显示
- ✅ MAO 显示 "100 MAO/次"

---

## 🚨 **如果仍显示老版本**

### **强制清除缓存**：
```bash
# 服务器端
sudo systemctl restart nginx
sudo rm -rf /var/cache/nginx/*

# CDN缓存（如Cloudflare）
登录面板 → 缓存 → 清除所有内容
```

### **用户端清除**：
- **手机**：下拉刷新页面
- **电脑**：Ctrl+F5 或 Cmd+R

---

## 📞 **部署文件位置**

- **完整部署包**: `maopi-deployment-v3.2.1-final.tar.gz`
- **源文件目录**: `temp_deploy/`
- **验证脚本**: `complete-maopi-deployment.sh`

---

## 🎉 **部署成功标志**

当你看到以下内容，说明部署成功：

✅ **maopi.me 主页显示**:
```
PI代币: "1,000 PI/次"
MAO代币: "100 MAO/次"
无概率百分比显示
```

✅ **功能正常**:
- 代币选择按钮工作正常
- 转盘界面显示7个奖励区域
- 移动端响应正常

---

## 🚀 **现在开始部署！**

**选择上述任一方式，立即将文件上传到 maopi.me！**

用户将看到完全正确的游戏界面，所有问题都已解决！ 🎰 