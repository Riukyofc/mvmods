# MV Mods - Guia de Deploy (Pronto para Produção) 🚀

Este projeto foi estruturado para ser colocado "no ar" rapidamente. Siga os passos abaixo.

## 1. Preparação do Banco (Firebase)
Certifique-se de que no console do Firebase:
- O **Firestore** está habilitado.
- O **Storage** está habilitado e configurado para acesso CORS (se necessário).
- **Authentication** (Email/Senha) está ativado.

## 2. Deploy do Backend (API)
Recomendado: **Render.com**, **Railway.app** ou **Heroku**.
1. Suba a pasta `backend` para o serviço escolhido.
2. Configure as Variáveis de Ambiente (Environment Variables) no painel do host:
   - `PORT`: 4000 (ou o que o host prover)
   - `FIREBASE_STORAGE_BUCKET`: seu-bucket.appspot.com
   - `FRONTEND_URL`: https://seu-site-frontend.vercel.app
   - `FIREBASE_SERVICE_ACCOUNT_PATH`: (Caminho para sua chave JSON ou cole o conteúdo se o host permitir variáveis de objeto).

## 3. Deploy do Frontend (Site)
Recomendado: **Vercel** ou **Netlify**.
1. Conecte seu repositório GitHub.
2. Defina o diretório base como `frontend`.
3. Defina as Variáveis de Ambiente:
   - `VITE_API_URL`: https://sua-api-backend.com/api
4. O comando de build será `npm run build` e a pasta de saída `dist`.

## 4. Localhost
Para rodar tudo localmente de uma vez:
1. Na raiz do projeto: `npm install`
2. `npm run dev`

---
**MV Mods Graphics Studio** - Desenvolvido com foco em alta performance e estética premium.
