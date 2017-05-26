# 「酷安日图」APP的微信小程序 A WeChat Mini Program for Cool Daily Photo APP

> 「酷安日图」APP的小程序版本，每日推送二次元和非二次元好图各一枚，少，而精。

![截图](art/screenshots.png)

| 扫码体验小程序 |
| :----: |
| ![小程序二维码](art/qrcode.jpg) |

> 附：[「酷安日图」APP](http://www.coolapk.com/apk/com.by_syk.cooldp)


### 流量节省

除查看原图，小程序内展示的图片均经过云端压缩处理（七牛云提供），最大限度节约流量。

| 压缩方案 | 压缩细节 | 单图 | 加载首页(2图) | 加载「往期日图」页面(14图) |
| :---- | :---- | :---- | :---- | :---- |
| -wc | 限定像素总数1024*1024 + 图片瘦身 + 图片质量85% | ~70KB | ~140KB | ~980KB |
| -wc720 | 限定像素总数720*720 + 图片瘦身 + 图片质量85% | ~57KB | ~114KB | ~798KB |

压缩方案会根据设备屏幕尺寸自动选择，总之，一次体验将消耗不到1MB流量。


### License

    Copyright 2017 By_syk

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.


*Copyright &#169; 2017 By_syk. All rights reserved.*