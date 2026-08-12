# 🚀 Guia Completo de Deploy: Git, Vercel & Railway

Este projeto foi construído em **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS** e **Prisma ORM**. 

---

## 1. Banco de Dados na Railway (PostgreSQL)

1. Acesse o [Railway.app](https://railway.app) e faça login.
2. Clique em **"New Project"** -> **"Provision PostgreSQL"**.
3. Assim que o banco for criado, vá na aba **Variables** ou **Connect**.
4. Copie a variável `DATABASE_URL` (ex: `postgresql://postgres:senha@containers-us-west-1.railway.app:5432/railway`).

---

## 2. Repositório no GitHub / Git

1. O repositório Git local já foi inicializado na pasta `D:\dev\AntiG\imoveis`.
2. Para vincular ao seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "feat: plataforma guarda-chuva de corretores de imoveis"
   git remote add origin git@github.com:seu-usuario/imoveis.git
   git push -u origin main
   ```

---

## 3. Deploy do Frontend no Vercel

1. Acesse o [Vercel.com](https://vercel.com) e clique em **"Add New"** -> **"Project"**.
2. Importe o repositório `imoveis` do seu GitHub.
3. Na seção **Environment Variables**, adicione:

| Nome da Variável | Valor Exemplo |
| :--- | :--- |
| `DATABASE_URL` | `postgresql://user:pass@railway.app:5432/railway` |
| `NEXTAUTH_SECRET` | `super-secret-luxury-imoveis-key-2026` |
| `JWT_SECRET` | `super-secret-luxury-imoveis-key-2026` |
| `NEXTAUTH_URL` | `https://seu-projeto.vercel.app` |

4. Na alteração do banco para PostgreSQL em produção, basta ajustar `provider = "postgresql"` no arquivo `prisma/schema.prisma` se utilizar PostgreSQL direto, ou manter SQLite em desenvolvimento local.
5. Clique em **Deploy**. O Vercel efetuará a compilação e disponibilizará o link do seu site guarda-chuva online!

---

## 4. Logins Prontos para Teste Local

- **Corretora Waleska**: `waleska@imoveis.com` | Senha: `123456`
- **Comprador (Cliente)**: `cliente@imoveis.com` | Senha: `123456`
- **Admin / Desenvolvedor**: `admin@imoveis.com` | Senha: `admin123`
