# SSH Key Setup - Step-by-Step Instructions

## 🎯 CURRENT STATUS

✅ **SSH Keys Generated Successfully**

- Private Key: `~/.ssh/id_rsa` (3.4 KB)
- Public Key: `~/.ssh/id_rsa.pub` (770 bytes)
- Key Type: RSA 4096-bit
- Fingerprint: SHA256:TaRsHQH2tB4MBrj3d3D6GhzmtuqeMplIsZbBK2PJdp8

---

## 📋 STEP 1: ADD PUBLIC KEY TO VPS

### Your Public Key (Copy entire line):

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmxfbOPVuDii6rN1f4nfZv+fJinHVG0vWEhLfE97vLkTJ5yYZeKsUapurCxh27kYunMSayLjf3j9lUxw6kEdnrGFXstZIj3Ftoz3si5C67SeNSkhROeDIrnNh+rnXvdVlp1D4hKy23Sr35dKYufHs35D5etDPZnZIwjDpROu3iOhrCQSztHspVjQYTEm73oJc5TVAizGIGUYl5DxjvM38tzSUtPqE2BUTpewmEciBSPJs8agsMC3POJM96fvoQeLkKCB2RiFhZjBZE3wEtfia5q9p40lzI05YJF0IBSHo9OWllW3WUnjqy5Lf977JnD0uIrfd65ws20qpmbU/n5JELoj+NwJ94PZQ1qc8kAXQrW4EgslXdxttTTcwFnJaZwUiTh5M1gwTlYDjAbrptmGUkagy1a5Kq/5KyM0weIw7Yr3OjW8Mv0idIljQ9qj+E33AxcJF0XARCxEr6JqU3rqNsfR9QhOgWDQ+p1eocfnJ9nxQXBeYMW1F/HoG19/tv27nZkx5pJXZ7HC6DDBXWardc0wVosFpOEI8klN6L4PoRG31GCb57mUy3CREUR3S6zdRooJFVp/boTh4xwu7UCUs5aobjafvqKjj0F9UOvc29fD5p2hPDxC+0XEafjzMCz7r2qh/DBuJZSVHSyXMqF4P5W9gaY1VjOQdPWyIC+sSXrQ== extremelifeherbal-deployment@109.205.181.119
```

### Commands to Execute on VPS:

1. **SSH into VPS**:
   ```bash
   ssh root@109.205.181.119
   ```
   Password: `4K-6GsnA$3pQ5931`

2. **Create .ssh directory**:
   ```bash
   mkdir -p ~/.ssh
   chmod 700 ~/.ssh
   ```

3. **Add public key** (paste the entire key above):
   ```bash
   echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCmxfbOPVuDii6rN1f4nfZv+fJinHVG0vWEhLfE97vLkTJ5yYZeKsUapurCxh27kYunMSayLjf3j9lUxw6kEdnrGFXstZIj3Ftoz3si5C67SeNSkhROeDIrnNh+rnXvdVlp1D4hKy23Sr35dKYufHs35D5etDPZnZIwjDpROu3iOhrCQSztHspVjQYTEm73oJc5TVAizGIGUYl5DxjvM38tzSUtPqE2BUTpewmEciBSPJs8agsMC3POJM96fvoQeLkKCB2RiFhZjBZE3wEtfia5q9p40lzI05YJF0IBSHo9OWllW3WUnjqy5Lf977JnD0uIrfd65ws20qpmbU/n5JELoj+NwJ94PZQ1qc8kAXQrW4EgslXdxttTTcwFnJaZwUiTh5M1gwTlYDjAbrptmGUkagy1a5Kq/5KyM0weIw7Yr3OjW8Mv0idIljQ9qj+E33AxcJF0XARCxEr6JqU3rqNsfR9QhOgWDQ+p1eocfnJ9nxQXBeYMW1F/HoG19/tv27nZkx5pJXZ7HC6DDBXWardc0wVosFpOEI8klN6L4PoRG31GCb57mUy3CREUR3S6zdRooJFVp/boTh4xwu7UCUs5aobjafvqKjj0F9UOvc29fD5p2hPDxC+0XEafjzMCz7r2qh/DBuJZSVHSyXMqF4P5W9gaY1VjOQdPWyIC+sSXrQ== extremelifeherbal-deployment@109.205.181.119" >> ~/.ssh/authorized_keys
   ```

4. **Set permissions**:
   ```bash
   chmod 600 ~/.ssh/authorized_keys
   ```

5. **Verify key was added**:
   ```bash
   cat ~/.ssh/authorized_keys
   ```

6. **Exit SSH**:
   ```bash
   exit
   ```

---

## 🔐 STEP 2: TEST SSH KEY-BASED AUTHENTICATION

After adding the public key, test the connection:

```bash
ssh root@109.205.181.119
```

**Expected**: SSH connects without prompting for password

**Success Indicator**: Prompt shows `root@extremelifeherbal:~#`

---

## ✅ STEP 3: CONFIRM SETUP COMPLETE

Once SSH key-based authentication is working, reply with:

> "SSH key-based authentication is working. Ready for automated deployment."

---

## 🚀 STEP 4: AUTOMATED DEPLOYMENT

Once SSH keys are working, I will automatically:

1. Deploy Phase 23 Subtask 3 to production
2. Execute: git pull, npm install, npm run build, pm2 restart
3. Run all verification commands
4. Provide deployment summary

---

## 📚 DOCUMENTATION

- `SSH_KEY_SETUP_GUIDE.md` - Complete setup guide
- `automated_deployment.sh` - Automated deployment script

