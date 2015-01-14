using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using JW.UHF;

namespace NodeRfid
{

    class Startup
    {
        private JWReader jwReader = null;

        private Func<object, Task<object>> logCallback;

        /// <summary>
        /// 打开读写器
        /// </summary>
        public async Task<object> Open(dynamic input)
        {
            this.logCallback = (Func<object, Task<object>>)input.logCallback;
            JWReader jwRe = this.initConnect(input);
            if (jwRe != null && this.setReader((object[])input.antInfos, (float)input.rssi, (float)input.frequency, jwRe))
            {

                this.logCallback("读写器"+input.host+"连接成功啦！^-^");

                // 关联读写器IP
                ReaderData readerData = new ReaderData(input.host, jwRe, this.logCallback, (Func<object, Task<object>>)input.onDataCallback, (Func<object, Task<object>>)input.offDataCallback);

                // 开始盘点
                readerData.startInventory();

                return true;
            }

            return false;
        }

        /// <summary>
        /// 关闭读写器连接
        /// </summary>
        public async Task<object> Close(object input)
        {
            if (this.jwReader != null)
            {
                this.jwReader.RFID_Stop_Inventory();//停止当前UHF操作
                this.jwReader.RFID_Close();//关闭模块连接
            }

            return true;
        }

        /// <summary>
        /// 初始化读写器连接
        /// </summary>
        private JWReader initConnect(dynamic input)
        {
            #region 连接模块
            Result result = Result.OK;
            JWReader jw = new JWReader(input.host, input.port);
            result = jw.RFID_Open();//连接UHF模块

            if (result != Result.OK)
            {
                this.logCallback("不能打开读写器");
                return null;
            }
            #endregion

            return jw;
        }

        /// <summary>
        /// 配置读写器
        /// </summary>
        private bool setReader(object[] antInfos, float rssi, float frequency, JWReader jwRe)
        {
            #region 配置模块
            Result result = Result.OK;
            RfidSetting rs = new RfidSetting();

            rs.AntennaPort_List = new List<AntennaPort>();
            foreach (IDictionary<string, object> item in antInfos)
            {
                AntennaPort ap = new AntennaPort();
                ap.AntennaIndex = (int)item["antIndex"];//天线Index
                ap.Power = (int)item["antPower"];//功率
                rs.AntennaPort_List.Add(ap);
            }

            rs.GPIO_Config = null;
            rs.Inventory_Time = 0;

            rs.Region_List = RegionList.CCC;

            rs.Speed_Mode = SpeedMode.SPEED_FASTEST;

            #region 设置RSSI 过滤
            rs.RSSI_Filter =new RSSIFilter();
            rs.RSSI_Filter.Enable =true;
            rs.RSSI_Filter.RSSIValue = rssi;
            #endregion


            rs.Tag_Group = new TagGroup();
            rs.Tag_Group.SessionTarget = SessionTarget.A;
            rs.Tag_Group.SearchMode = SearchMode.SINGLE_TARGET;
            rs.Tag_Group.Session = Session.S0;

            result = jwRe.RFID_Set_Config(rs);
            if (result != Result.OK)
            {
                this.logCallback("读写器设置失败");
                return false;
            }
            #endregion

            return true;
        }

    }



    // 读写器数据类
    class ReaderData
    {
        Dictionary<string, object> tagList = new Dictionary<string, object>();//Tag列表
        Dictionary<string, object> goneList = new Dictionary<string, object>();//Tag列表

        private Queue<Tag> inventoryTagQueue = new Queue<Tag>();//盘点到Tag队列列表

        private bool stopInventoryFlag = false;//是否停止盘点标志

        private string host;

        private JWReader jwReader = null;

        private Func<object, Task<object>> logCallback;
        private Func<object, Task<object>> onDataCallback;
        private Func<object, Task<object>> offDataCallback;

        public ReaderData(string h, JWReader j, Func<object, Task<object>> l,Func<object, Task<object>> on, Func<object, Task<object>> off)
        {
            host = h;
            jwReader = j;
            logCallback = l;
            onDataCallback = on;
            offDataCallback = off;
        }


        /// <summary>
        /// 启动盘点
        /// </summary>
        public void startInventory()
        {
            clearInventoryData();//清空盘点数据

            stopInventoryFlag = false;

            Thread inventoryThread = new Thread(inventory);//盘点线程
            inventoryThread.IsBackground=true;
            inventoryThread.Start();

            Thread updateThread = new Thread(updateList);//更新列表线程
            updateThread.IsBackground=true;
            updateThread.Start();

            Thread checkGoneThread = new Thread(checkGone);//检查标签是否别拿走线程
            checkGoneThread.IsBackground=true;;
            checkGoneThread.Start();


        }


        /// <summary>
        /// 清空盘点数据
        /// </summary>
        private void clearInventoryData()
        {
            inventoryTagQueue.Clear();
            tagList.Clear();
            goneList.Clear();
        }


        /// <summary>
        /// 数据上报
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        private void TagsReport(object sender, TagsEventArgs args)
        {
            Tag tag = args.tag;
            inventoryTagQueue.Enqueue(tag);//回调函数事情越少越好。
        }


        /// <summary>
        /// 盘点线程
        /// </summary>
        private void inventory()
        {
            jwReader.TagsReported += TagsReport;
            //盘点
            jwReader.RFID_Start_Inventory();
        }


        /// <summary>
        /// 停止盘点
        /// </summary>
        /*private void stopBtn_Click()
        {
            jwReader.RFID_Stop_Inventory();//停止当前UHF操作
            jwReader.TagsReported -= TagsReport;
            stopInventoryFlag = true;
        }*/


        /// <summary>
        /// 更新列表线程
        /// </summary>
        private void updateList()
        {
            while (!stopInventoryFlag)//未停止
            {
                updateInventoryGridList();
                Thread.Sleep(10);
            }

            /*DateTime dt = DateTime.Now;
            while (true)
            {
                updateInventoryGridList();
                //500毫秒内确定没有包了 防止线程提前结束 有些盘点包还没处理完 可保证该线程最后结束。
                if (inventoryTagQueue.Count == 0 && UtilD.DateDiffMillSecond(DateTime.Now, dt) > 500)
                    break;
            }*/
        }

        /// <summary>
        /// 更新列表
        /// </summary>
        private void updateInventoryGridList()
        {
            while (inventoryTagQueue.Count > 0)
            {
                if (inventoryTagQueue.Count > 0)
                {
                    lock (tagList)
                    {
                        Tag packet = inventoryTagQueue.Dequeue();
                        String epc = packet.EPC;

                        // 移除又能被盘点上的标签
                        if (this.goneList.ContainsKey(epc))
                        {
                            this.goneList.Remove(epc);
                        }

                        if (this.tagList.ContainsKey(epc))
                        {
                            IDictionary<string, object> currentTag = (IDictionary<string, object>)this.tagList[epc];
                            currentTag["time"] = DateTime.Now;
                            currentTag["count"] = (int)currentTag["count"] + 1;
                            this.tagList[epc] = currentTag;
                        }
                        else
                        {
                            #region 新增列表
                            IDictionary<string, object> tagData = new Dictionary<string, object>();
                            tagData["time"] = DateTime.Now;
                            tagData["count"] = 0;
                            tagData["host"] = this.host;
                            tagData["data"] = packet;

                            this.tagList.Add(epc, tagData);
                            #endregion
                        }
                    }
                }

                //Thread callback_thread=new Thread(new ParameterizedThreadStart (my_onDataCallback));
                //callback_thread.IsBackground=true;
                //callback_thread.Start(this.tagList);
            }
            
            my_onDataCallback(this.tagList);

        }


        private async Task my_onDataCallback(object taglist)
        {
            await onDataCallback((Dictionary<string, object> )taglist);
        }


        /// <summary>
        /// 检查标签是否被拿走
        /// </summary>
        private void checkGone()
        {
            
            while (!stopInventoryFlag)//未停止
            {
                lock(tagList)
                {
                    string[] tagkeyEpcs = new string[this.tagList.Count];
                    this.tagList.Keys.CopyTo(tagkeyEpcs, 0);
                    foreach (string tagkeyEpc in tagkeyEpcs)
                    {
                        IDictionary<string, object> val = (IDictionary<string, object>)this.tagList[tagkeyEpc];
                        if (UtilD.DateDiffMillSecond(DateTime.Now, (DateTime)val["time"]) > 300 && (int)val["count"] > 10)
                        {
                            val["time"] = DateTime.Now;
                            this.goneList[tagkeyEpc] = val;
                            // 从在架标签中移除被拿走的标签
                            this.tagList.Remove(tagkeyEpc);

                        }
                    }
                }

                lock(goneList)
                {
                    string[] keyEpcs = new string[this.goneList.Count];
                    this.goneList.Keys.CopyTo(keyEpcs, 0);
                    foreach (string keyEpc in keyEpcs)
                    {

                        // 从离架标签中移除被拿走特定时间后没拿回来的标签
                        IDictionary<string, object> val = (IDictionary<string, object>)this.goneList[keyEpc];
                        if (UtilD.DateDiffMillSecond(DateTime.Now, (DateTime)val["time"]) > 30000)
                        {
                            this.goneList.Remove(keyEpc);
                        }
                    }
                }

                //this.offDataCallback(this.goneList);
                my_offDataCallback(this.goneList);

            }
        }

        private async Task my_offDataCallback(object gonelist)
        {
           await offDataCallback((Dictionary<string, object> )gonelist);
        }


    }

    class UtilD
    {
        /// <summary>
        /// 检测空或NULL
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool checkEmptyorNull(String value)
        {
            return value == null || value.Trim().Equals("");
        }

        /// <summary>
        /// 返回两个时间差(秒数)
        /// </summary>
        /// <param name="DateTime1"></param>
        /// <param name="DateTime2"></param>
        /// <returns></returns>
        public static int DateDiff(DateTime DateTime1, DateTime DateTime2)
        {
            int dateDiff;
            TimeSpan ts1 = new TimeSpan(DateTime1.Ticks);
            TimeSpan ts2 = new TimeSpan(DateTime2.Ticks);
            TimeSpan ts = ts1.Subtract(ts2).Duration();

            dateDiff = (int)ts.TotalSeconds;
            return dateDiff;
        }

        /// <summary>
        /// 返回两个时间差(毫秒数)
        /// </summary>
        /// <param name="DateTime1"></param>
        /// <param name="DateTime2"></param>
        /// <returns></returns>
        public static double DateDiffMillSecond(DateTime DateTime1, DateTime DateTime2)
        {
            double dateDiff;
            TimeSpan ts1 = new TimeSpan(DateTime1.Ticks);
            TimeSpan ts2 = new TimeSpan(DateTime2.Ticks);
            TimeSpan ts = ts1.Subtract(ts2).Duration();

            dateDiff = ts.TotalMilliseconds;
            return dateDiff;
        }

        public static string ToHexStrByByte(byte[] bytes)
        {
            if (bytes != null)
            {
                char[] chars = new char[bytes.Length * 2];
                for (int i = 0; i < bytes.Length; i++)
                {
                    int b = bytes[i];
                    chars[i * 2] = hexDigits[b >> 4];
                    chars[i * 2 + 1] = hexDigits[b & 0xF];
                }
                return new string(chars);
            }
            else
                return null;
        }

        static char[] hexDigits = {
        '0', '1', '2', '3', '4', '5', '6', '7',
        '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

        public static byte[] ToByteByHexStr(string hexString)
        {
            if (hexString == null)
                return null;

            hexString = hexString.Replace(" ", "");
            if ((hexString.Length % 2) != 0)
                hexString += " ";
            byte[] returnBytes = new byte[hexString.Length / 2];
            for (int i = 0; i < returnBytes.Length; i++)
                returnBytes[i] = Convert.ToByte(hexString.Substring(i * 2, 2), 16);
            return returnBytes;
        }

        /// <summary>
        /// 将16进制的Byte数组转换为UShort数组
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static ushort[] ToUShortFromByte(byte[] source)
        {
            int length = source.Length;

            ushort[] output = new ushort[length / 2];
            for (int i = 0; i < output.Length; ++i)
            {
                output[i] = (ushort)(source[i * 2 + 1] | source[i * 2] << 8);
            }
            return output;
        }

        /// <summary>
        /// 将16进制的字符串转换为UShort数组
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static ushort[] ToUShortFromHexStr(String str)
        {
            byte[] source = ToByteByHexStr(str);
            int length = source.Length;

            ushort[] output = new ushort[length / 2];
            for (int i = 0; i < output.Length; ++i)
            {
                output[i] = (ushort)(source[i * 2 + 1] | source[i * 2] << 8);
            }
            return output;
        }

        /// <summary>
        /// 格式化EPC或User等
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static String DisplayFormatHexStr(String str)
        {
            if (str != null)
            {
                for (int i = 4; i < str.Length; i = i + 5)
                {
                    str = str.Insert(i, "-");
                }
                return str;
            }
            else
                return "";
        }

        /// <summary>
        /// 替换字符'-'
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static String FormatHexStr(String str)
        {
            if (str == null)
                return "";
            else
                return str.Replace("-", "");
        }

        /// <summary>
        /// 检查是否全部16进制
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static bool isHex(string s)
        {
            int Flag = 0;
            char[] str = s.ToCharArray();
            for (int i = 0; i < str.Length; i++)
            {
                if (Char.IsNumber(str[i])
                || str[i] == (char)45//中划线
                || (str[i] >= (char)65 && str[i] <= (char)70)//A-F
                || (str[i] >= (char)97 && str[i] <= (char)102))//a-f
                {
                    Flag++;
                }
                else
                {
                    Flag = -1;
                    break;
                }
            }
            if (Flag > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}