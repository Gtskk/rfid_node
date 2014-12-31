## RFID读写器库

## Github与CommonJS规范

* 每个github项目下应该有一个README.md文件
* CommonJS规范建议文档存在在doc目录下
* CommonJS规范建议代码存在在lib目录下


## ChangeLog
### 2014-11-10
修改标签检查进程，讲C#程序传过来的数据直接存入redis数据库中，即使数据为空也是直接存入，这样每次都是最新的读取数据

### 2014-11-14
1. 添加log4js调试工具，可以生成不同状态的日志
2. 添加说明文档
3. 添加在架标签和离架标签检查
4. 使项目符合Github与CommonJS规范

### 2014-12-30
1. 修复内存占用过大的BUG,原因是启动子进程方式错误
2. 完善和优化一些代码，以提升性能



**哥特式KK**