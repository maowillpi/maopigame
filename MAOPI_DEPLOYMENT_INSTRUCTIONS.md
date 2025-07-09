# 🎰 MAO转盘游戏 v3.2.1 - maopi.me 部署操作指南

## ✅ **部署准备已完成**

您的MAO转盘游戏已完全修复并准备部署！

### 📦 **部署包信息**
- **部署包**: `maopi-deployment-v3.2.1.tar.gz` (707KB)
- **源文件夹**: `temp_deploy/` 
- **版本**: v3.2.1-professional-fixed
- **修复状态**: ✅ 所有问题已解决

---

## 🚀 **maopi.me 部署步骤**

### **第一步：备份现有文件**
在上传新文件前，请备份maopi.me服务器上的现有文件：
```bash
# 在服务器上创建备份目录
mkdir -p /path/to/backup/$(date +%Y%m%d_%H%M%S)
cp -r /path/to/maopi.me/* /path/to/backup/$(date +%Y%m%d_%H%M%S)/
```

### **第二步：选择部署方式**

#### **方式A：使用压缩包部署**
1. **下载部署包**：
   ```bash
   # 部署包位置
   /Users/mac/Desktop/MAOGAME/maopi-deployment-v3.2.1.tar.gz
   ```

2. **上传到服务器**：
   ```bash
   # 使用SCP上传（示例）
   scp maopi-deployment-v3.2.1.tar.gz user@maopi.me:/tmp/
   
   # 在服务器上解压
   ssh user@maopi.me
   cd /path/to/maopi.me/
   tar -xzf /tmp/maopi-deployment-v3.2.1.tar.gz
   ```

#### **方式B：直接上传文件夹**
```bash
# 使用rsync同步（推荐）
rsync -avz --delete temp_deploy/ user@maopi.me:/path/to/website/

# 或使用SCP递归上传
scp -r temp_deploy/* user@maopi.me:/path/to/website/
```

#### **方式C：通过FTP客户端**
1. 使用FileZilla、WinSCP等FTP工具
2. 连接到maopi.me服务器
3. 上传`temp_deploy/`目录中的所有文件
4. 确保覆盖原有的`index.html`和`game.html`

### **第三步：设置文件权限**
```bash
# 在服务器上设置正确的文件权限
chmod 644 *.html
chmod 755 _next/ components/ mobile/ pages/
chmod -R 644 _next/* components/* mobile/* pages/*
```

### **第四步：清除缓存**

#### **服务器端缓存清除**
```bash
# 重启Web服务器（根据实际情况选择）
sudo systemctl restart nginx
# 或
sudo systemctl restart apache2

# 清除服务器缓存（如果使用）
sudo rm -rf /var/cache/nginx/*
```

#### **CDN缓存清除**
- 如果使用Cloudflare：登录面板 → 缓存 → 清除所有内容
- 如果使用其他CDN：按提供商指导清除缓存

---

## 🔍 **部署验证**

### **第一步：基础验证**
访问 `http://maopi.me` 或 `https://maopi.me`，检查：

✅ **必须看到的正确内容**：
- PI投注显示："1,000 PI/次"（不是10,000）
- MAO投注显示："100 MAO/次"
- 页面标题包含：v3.2.1
- 无任何概率百分比显示（如85%等）

❌ **不应该看到的错误内容**：
- ~~"10,000 PI/次"~~
- ~~"85%"或其他概率百分比~~
- ~~老版本号~~

### **第二步：功能验证**
1. **代币选择功能**：
   - MAO按钮可点击，显示"100 MAO/次"
   - PI按钮可点击，显示"1,000 PI/次"

2. **转盘界面**：
   - 7个奖励区域正确显示
   - 无概率百分比显示
   - 动画效果正常

3. **移动端测试**：
   - 手机访问响应正常
   - 触摸操作流畅
   - 界面适配良好

### **第三步：用户缓存清除指导**
如果用户仍看到老版本，指导他们：

**手机用户**：
- 下拉刷新页面
- 清除浏览器缓存
- 重新打开浏览器

**电脑用户**：
- 按Ctrl+F5强制刷新
- 按Cmd+R（Mac）强制刷新
- 清除浏览器缓存

---

## 📊 **最终配置确认**

| 配置项 | 正确值 | 状态 |
|--------|--------|------|
| MAO投注金额 | 100 MAO/次 | ✅ |
| PI投注金额 | 1,000 PI/次 | ✅ |
| 概率显示 | 完全移除 | ✅ |
| 谢谢惠顾概率 | 60%（内部） | ✅ |
| 总中奖率 | 40% | ✅ |
| 移动端兼容 | 完全支持 | ✅ |
| 版本标识 | v3.2.1 | ✅ |

---

## 🛟 **故障排除**

### **问题1：上传后仍显示老版本**
**解决方案**：
1. 确认文件已正确覆盖
2. 清除服务器缓存
3. 清除CDN缓存
4. 检查文件权限

### **问题2：页面无法正常加载**
**解决方案**：
1. 检查文件完整性
2. 检查目录结构
3. 检查Web服务器配置
4. 查看服务器错误日志

### **问题3：移动端显示异常**
**解决方案**：
1. 确认响应式CSS已加载
2. 检查移动端文件是否完整
3. 测试不同手机浏览器

---

## 🎉 **部署完成检查清单**

- [ ] 文件已上传到maopi.me服务器
- [ ] index.html和game.html已替换
- [ ] 文件权限设置正确
- [ ] Web服务器已重启
- [ ] CDN缓存已清除
- [ ] 桌面端测试通过
- [ ] 移动端测试通过
- [ ] 显示"1,000 PI/次"（不是10,000）
- [ ] 无概率百分比显示
- [ ] 版本显示v3.2.1

---

## 📞 **技术支持**

如果部署过程中遇到问题：

1. **检查部署包完整性**：
   ```bash
   tar -tzf maopi-deployment-v3.2.1.tar.gz | head -10
   ```

2. **验证文件内容**：
   ```bash
   grep "1,000 PI/次" temp_deploy/*.html
   ```

3. **查看详细日志**：
   ```bash
   tail -f /var/log/nginx/error.log
   ```

---

**🚀 恭喜！您的MAO转盘游戏v3.2.1已准备就绪，可以在maopi.me上为全球用户提供服务！** 