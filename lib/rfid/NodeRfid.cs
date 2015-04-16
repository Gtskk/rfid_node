using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using JW.UHF;
// 日志有关dll
//using log4net;
//using JW.LOG;

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
			// 记录日志的配置文件
			// JW.LOG.LogHelper.InitLogConfig(System.Environment.CurrentDirectory + "/lib/rfid/log.xml");
			this.logCallback = (Func<object, Task<object>>)input.logCallback;
			JWReader jwRe = this.initConnect(input);
			if (jwRe != null && this.setReader((object[])input.antInfos, (float)input.rssi, (float)input.frequency, (int)input.stay_time, (int)input.inventory_time,  jwRe))
			{
				this.logCallback("读写器"+input.host+"连接成功啦！^-^");

				// 关联读写器IP
				ReaderData readerData = new ReaderData(input.host, input.groupId, jwRe, this.logCallback, (Func<object, Task<object>>)input.onDataCallback, (Func<object, Task<object>>)input.offDataCallback);

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
		private bool setReader(object[] antInfos, float rssi, float frequency, int stay_time, int inventory_time, JWReader jwRe)
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
			rs.Inventory_Time = inventory_time;///盘点时间控制,盘点500ms

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

			// 修改天线驻留时间
		   	jwRe.RFID_Set_DWellTime(stay_time);

			result = jwRe.RFID_Set_Fix_Frequency(frequency);
			if (result != Result.OK)
			{
				this.logCallback("定频设置失败");
				return false;
			}

			return true;
		}

	}



	// 读写器数据类
	class ReaderData
	{
		private Dictionary<string, object> tagList = new Dictionary<string, object>();//在架Tag列表
		private Dictionary<string, object> goneList = new Dictionary<string, object>();//离架Tag列表
		private Dictionary<string, object> LastOnTagList = null;//上次在架数据

		private bool stopInventoryFlag = false;//是否停止盘点标志

		private string host;
		private int group;

		private JWReader jwReader = null;

		private Func<object, Task<object>> logCallback;
		private Func<object, Task<object>> onDataCallback;
		private Func<object, Task<object>> offDataCallback;

		public ReaderData(string h, int g, JWReader j, Func<object, Task<object>> l,Func<object, Task<object>> on, Func<object, Task<object>> off)
		{
			host = h;
			group = g;
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
			stopInventoryFlag = false;
			// 数据上报
			jwReader.TagsReported += TagsReport;

			// 盘点操作
			Thread updateThread = new Thread(updateList);//更新列表线程
			updateThread.Start();
		}


		/// <summary>
		/// 数据上报
		/// </summary>
		/// <param name="sender"></param>
		/// <param name="args"></param>
		private void TagsReport(object sender, TagsEventArgs args)
		{
			Tag tag = args.tag;
			if (tag != null)
			{
				if(!(this.tagList.ContainsKey(tag.EPC))){//不存在列表中
					#region 新增列表
					IDictionary<string, object> tagData = new Dictionary<string, object>();
					tagData["time"] = DateTime.Now;
					tagData["count"] = 1;
					tagData["host"] = this.host;
					tagData["group"] = this.group;
					tagData["data"] = tag;

					this.tagList.Add(tag.EPC, tagData);
					#endregion
				}
				else
				{
					IDictionary<string, object> tagDat = (IDictionary<string, object>)tagList[tag.EPC];
					tagDat["count"] = (int)tagDat["count"] + 1;
					tagList[tag.EPC] = tagDat;
				}
			}//回调函数事情越少越好。
		}



		/// <summary>
		/// 处理数据
		/// </summary>
		private void updateList()
		{
			while (!stopInventoryFlag)//未停止
			{
				tagList.Clear();
				goneList.Clear();

				// 同步模式盘点
				Result res = jwReader.RFID_Start_Inventory();
				if(res == Result.Network_Exception)
				{
					this.logCallback("gtskkwangluoyichang");
					break;
				}

				if(LastOnTagList == null)
				{// 代表第一次读取，上次在架数据为空
					LastOnTagList = new Dictionary<string, object>(tagList);//将本次读到商品暂存起来
					my_onDataCallback(LastOnTagList);
				}
				else
				{
					string[] lastKeys = new string[this.LastOnTagList.Count];
					this.LastOnTagList.Keys.CopyTo(lastKeys, 0);
					foreach (string key in lastKeys)
					{
						IDictionary<string, object> tagVal = (IDictionary<string, object>)LastOnTagList[key];
						if (!tagList.ContainsKey(key))//上次盘点数据不包含在本次数据中
						{
							int checkCount = (int)tagVal["count"];                         
							if(checkCount > 1 || ((Tag)tagVal["data"]).RSSI > -60)
							{
								goneList.Add(key, tagVal);//将上次盘点数据放到离架数据中
							}
						}
						else
						{
							LastOnTagList[key] = tagList[key];
						}
					}
				}

				// 对在架数据的处理（主要是新增标签这块）
				string[] tagkeyEpcs = new string[this.tagList.Count];
				this.tagList.Keys.CopyTo(tagkeyEpcs, 0);
				foreach (string tagkeyEpc in tagkeyEpcs)
				{
					if (!LastOnTagList.ContainsKey(tagkeyEpc))//上次盘点数据不包含在本次数据中
					{
						LastOnTagList.Add(tagkeyEpc, tagList[tagkeyEpc]); // 添加新增的标签
					}
				}

				Dictionary<string, object> uploadTagList = new Dictionary<string, object>(this.tagList);//在架Tag列表
				Dictionary<string, object> uploadGoneList = new Dictionary<string, object>(this.goneList);//离架Tag列表
				if(this.goneList.Count == 0)
				{
					IDictionary<string, object> emptyData = new Dictionary<string, object>();
					emptyData["group"] = this.group;
					uploadGoneList.Add("group", emptyData);
				}
		else
		{
				   //当离架数据不为空时才上传本次在架数据
					my_onDataCallback(uploadTagList);
		}
				//上传本次离架数据，这里是重点，如果上传过程时间久（内部处理速度慢），就不能实时的捕捉到商品移动
				my_offDataCallback(uploadGoneList);
			}
		}

		private async Task my_onDataCallback(object taglist)
		{
			await onDataCallback((Dictionary<string, object>)taglist);
			
		}


		private async Task my_offDataCallback(object gonelist)
		{
		   await offDataCallback((Dictionary<string, object>)gonelist);
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
