# SSH Key-Based Authentication Setup Guide

## 🎯 OVERVIEW

This guide explains how to set up SSH key-based authentication for automated deployment to the production VPS at 109.205.181.119.

---

## ✅ STEP 1: SSH KEYS GENERATED

**Status**: ✅ COMPLETE

SSH keys have been successfully generated on the local machine:

- **Private Key**: `~/.ssh/id_rsa` (3.4 KB, permissions: 600)
- **Public Key**: `~/.ssh/id_rsa.pub` (770 bytes, permissions: 644)
- **Key Type**: RSA 4096-bit
- **Comment**: extremelifeherbal-deployment@109.205.181.119
- **Fingerprint**: SHA256:TaRsHQH2tB4MBrj3d3D6GhzmtuqeMplIsZbBK2PJdp8

---

## 📋 STEP 2: ADD PUBLIC KEY TO VPS

### Your Public Key

Copy the entire content below (including the `ssh-rsa` prefix and comment):

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmxfbOPVuDii6rN1f4nfZv+fJinHVG0vWEhLfE97vLkTJ5yYZeKsUapurCxh27kYunMSayLjf3j9lUxw6kEdnrGFXstZIj3Ftoz3si5C67SeNSkhROeDIrnNh+rnXvdVlp1D4hKy23Sr35dKYufHs35D5etDPZnZIwjDpROu3iOhrCQSztHspVjQYTEm73oJc5TVAizGIGUYl5DxjvM38tzSUtPqE2BUTpewmEciBSPJs8agsMC3POJM96fvoQeLkKCB2RiFhZjBZE3wEtfia5q9p40lzI05YJF0IBSHo9OWllW3WUnjqy5Lf977JnD0uIrfd65ws20qpmbU/n5JELoj+NwJ94PZQ1qc8kAXQrW4EgslXdxttTTcwFnJaZwUiTh5M1gwTlYDjAbrptmGUkagy1a5Kq/5KyM0weIw7Yr3OjW8Mv0idIljQ9qj+E33AxcJF0XARCxEr6JqU3rqNsfR9QhOgWDQ+p1eocfnJ9nxQXBeYMW1F/HoG19/tv27nZkx5pJXZ7HC6DDBXWardc0wVosFpOEI8klN6L4PoRG31GCb57mUy3CREUR3S6zdRooJFVp/boTh4xwu7UCUs5aobjafvqKjj0F9UOvc29fD5p2hPDxC+0XEafjzMCz7r2qh/DBuJZSVHSyXMqF4P5W9gaY1VjOQdPWyIC+sSXrQ== extremelifeherbal-deployment@109.205.181.119
```

### Instructions to Add Public Key to VPS

#### Option A: Using SSH with Password (Recommended for First Time)

1. **SSH into VPS with password**:
   ```bash
   ssh root@109.205.181.119
   ```
   **Password**: `4K-6GsnA$3pQ5931`

2. **Create .ssh directory if it doesn't exist**:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ```

3. **Add public key to authorized_keys**:
   ```bash
   echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmxfbOPVuDii6rN1f4nfZv+fJinHVG0vWEhLfE97vLkTJ5yYZeKsUapurCxh27kYunMSayLjf3j9lUxw6kEdnrGFXstZIj3Ftoz3si5C67SeNSkhROeDIrnNh+rnXvdVlp1D4hKy23Sr35dKYufHs35D5etDPZnZIwjDpROu3iOhrCQSztHspVjQYTEm73oJc5TVAizGIGUYl5DxjvM38tzSUtPqE2BUTpewmEciBSPJs8agsMC3POJM96fvoQeLkKCB2RiFhZjBZE3wEtfia5q9p40lzI05YJF0IBSHo9OWllW3WUnjqy5Lf977JnD0uIrfd65ws20qpmbU/n5JELoj+NwJ94PZQ1qc8kAXQrW4EgslXdxttTTcwFnJaZwUiTh5M1gwTlYDjAbrptmGUkagy1a5Kq/5KyM0weIw7Yr3OjW8Mv0idIljQ9qj+E33AxcJF0XARCxEr6JqU3rqNsfR9QhOgWDQ+p1eocfnJ9nxQXBeYMW1F/HoG19/tv27nZkx5pJXZ7HC6DDBXWardc0wVosFpOEI8klN6L4PoRG31GCb57mUy3CREUR3S6zdRooJFVp/boTh4xwu7UCUs5aobjafvqKjj0F9UOvc29fD5p2hPDxC+0XEafjzMCz7r2qh/DBuJZSVHSyXMqF4P5W9gaY1VjOQdPWyIC+sSXrQ== extremelifeherbal-deployment@109.205.181.119" >> ~/.ssh/authorized_keys
   ```

4. **Set proper permissions**:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

5. **Verify the key was added**:
   ```bash
   cat ~/.ssh/authorized_keys
   ```

6. **Exit SSH**:
   ```bash
   exit
   ```

---

## 🔐 STEP 3: TEST SSH KEY-BASED AUTHENTICATION

After adding the public key to the VPS, test the connection:

```bash
ssh root@109.205.181.119
```

**Expected Result**: SSH connects without prompting for password

**Success Indicator**: Prompt shows `root@extremelifeherbal:~#`

---

## ✅ SECURITY BEST PRACTICES

✅ Private key permissions: 600 (read/write for owner only)  
✅ Public key permissions: 644 (read for all, write for owner)  
✅ authorized_keys permissions: 600  
✅ .ssh directory permissions: 700  
✅ Use strong key size: 4096-bit RSA  
✅ Use unique comment for identification  
✅ Never share private key  
✅ Keep private key secure  

---

## 🔄 TROUBLESHOOTING

### Issue: "Permission denied (publickey)"
**Solution**: Check authorized_keys permissions (should be 600)

### Issue: "No such file or directory"
**Solution**: Create ~/.ssh directory with proper permissions

### Issue: SSH still prompts for password
**Solution**: Verify public key was added correctly to authorized_keys

---

## 📝 NEXT STEPS

1. Add public key to VPS using instructions above
2. Test SSH key-based authentication
3. Proceed with automated deployment

