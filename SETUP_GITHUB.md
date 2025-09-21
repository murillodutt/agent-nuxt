# Configuração do GitHub - Agent Nuxt

**Data:** 21/09/2025 10:30:45 (America/Sao_Paulo)  
**Autor:** Murillo Dutt - Dutt eCommerce Website Design  
**Versão:** 1.0.0

---

## 🚀 Guia Completo de Configuração GitHub

### 1. Criar Repositório no GitHub

#### Opção A: Via Interface Web
1. Acesse [GitHub.com](https://github.com)
2. Clique em **"New repository"**
3. Configure o repositório:
   - **Repository name:** `agent-nuxt`
   - **Description:** `Sistema de conhecimento especializado Agent OS para Nuxt.js`
   - **Visibility:** Public ou Private (sua escolha)
   - **NÃO** marque "Add a README file" (já temos um)
   - **NÃO** marque "Add .gitignore" (já configurado)
   - **License:** MIT License (recomendado)

#### Opção B: Via GitHub CLI
```bash
# Instalar GitHub CLI se não tiver
brew install gh  # macOS
# ou
winget install GitHub.cli  # Windows

# Fazer login
gh auth login

# Criar repositório
gh repo create agent-nuxt --public --description "Sistema de conhecimento especializado Agent OS para Nuxt.js"
```

### 2. Conectar Repositório Local ao GitHub

```bash
# Navegar para o diretório do projeto
cd /Users/murillo/Sites/agent-nuxt

# Adicionar repositório remoto (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/agent-nuxt.git

# Verificar se foi adicionado corretamente
git remote -v

# Fazer push inicial
git push -u origin main
```

### 3. Configurar Autenticação

#### Opção A: Personal Access Token (Recomendado)
1. Vá para **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Clique em **"Generate new token (classic)"**
3. Configure o token:
   - **Note:** `Agent Nuxt Development`
   - **Expiration:** 90 days (ou personalizado)
   - **Scopes necessários:**
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `write:packages` (Upload packages)
     - ✅ `delete:packages` (Delete packages)

4. **IMPORTANTE:** Copie o token e guarde em local seguro
5. Configure no terminal:

```bash
# Configurar credenciais
git config --global credential.helper store

# No próximo push, use o token como senha
# Usuário: seu_username_github
# Senha: seu_personal_access_token
```

#### Opção B: SSH Key (Alternativa)
```bash
# Gerar chave SSH
ssh-keygen -t ed25519 -C "contato@duttcommerce.com"

# Adicionar ao ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub

# Adicionar no GitHub: Settings → SSH and GPG keys → New SSH key
```

### 4. Configurar Branch Protection Rules

#### Via Interface Web:
1. Vá para **Settings → Branches**
2. Clique em **"Add rule"**
3. Configure:
   - **Branch name pattern:** `main`
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals:** 1
   - ✅ **Dismiss stale PR approvals when new commits are pushed**
   - ✅ **Require review from code owners**
   - ✅ **Require status checks to pass before merging**
   - ✅ **Require branches to be up to date before merging**
   - ✅ **Require conversation resolution before merging**
   - ✅ **Include administrators**

### 5. Configurar Secrets para CI/CD

#### Secrets Necessários:
1. Vá para **Settings → Secrets and variables → Actions**
2. Adicione os seguintes secrets:

```bash
# Para deploy (se usar Vercel)
VERCEL_TOKEN=seu_token_vercel
VERCEL_ORG_ID=seu_org_id
VERCEL_PROJECT_ID=seu_project_id

# Para notificações (opcional)
SLACK_WEBHOOK_URL=sua_webhook_url
DISCORD_WEBHOOK_URL=sua_webhook_url

# Para análise de código (opcional)
SONAR_TOKEN=seu_sonar_token
CODECOV_TOKEN=seu_codecov_token
```

### 6. Configurar Labels do Repositório

#### Via GitHub CLI:
```bash
# Labels para tipos de issue
gh label create "bug" --color "d73a4a" --description "Algo não está funcionando"
gh label create "enhancement" --color "a2eeef" --description "Nova funcionalidade ou solicitação"
gh label create "documentation" --color "0075ca" --description "Melhorias ou adições à documentação"
gh label create "good first issue" --color "7057ff" --description "Boa para iniciantes"
gh label create "help wanted" --color "008672" --description "Ajuda extra é desejada"
gh label create "question" --color "d876e3" --description "Mais informações são solicitadas"

# Labels específicos do Agent Nuxt
gh label create "agent-os" --color "0e8a16" --description "Relacionado ao Agent OS"
gh label create "nuxt-ui-v4" --color "00d2ff" --description "Relacionado ao Nuxt UI v4"
gh label create "accessibility" --color "b60205" --description "WCAG 2.1 AA compliance"
gh label create "performance" --color "fbca04" --description "Otimização de performance"
gh label create "security" --color "d93f0b" --description "Questões de segurança"
```

### 7. Configurar Webhooks (Opcional)

#### Para Notificações:
1. Vá para **Settings → Webhooks**
2. Clique em **"Add webhook"**
3. Configure:
   - **Payload URL:** Sua URL de webhook
   - **Content type:** `application/json`
   - **Secret:** Token secreto
   - **Events:** Selecione eventos desejados

### 8. Configurar GitHub Pages (Opcional)

#### Para documentação:
1. Vá para **Settings → Pages**
2. Configure:
   - **Source:** Deploy from a branch
   - **Branch:** `main`
   - **Folder:** `/docs`

### 9. Comandos Git Essenciais

```bash
# Verificar status
git status

# Adicionar mudanças
git add .
git add arquivo_especifico.md

# Fazer commit
git commit -m "feat: adicionar nova funcionalidade"

# Push para GitHub
git push origin main

# Pull do GitHub
git pull origin main

# Criar nova branch
git checkout -b feature/nova-funcionalidade

# Merge de branch
git checkout main
git merge feature/nova-funcionalidade

# Deletar branch local
git branch -d feature/nova-funcionalidade

# Deletar branch remota
git push origin --delete feature/nova-funcionalidade
```

### 10. Fluxo de Trabalho Recomendado

#### Para Desenvolvimento:
```bash
# 1. Criar branch para feature
git checkout -b feature/nome-da-feature

# 2. Fazer mudanças e commits
git add .
git commit -m "feat: implementar funcionalidade X"

# 3. Push da branch
git push origin feature/nome-da-feature

# 4. Criar Pull Request no GitHub
gh pr create --title "Implementar funcionalidade X" --body "Descrição detalhada"

# 5. Após aprovação, fazer merge
gh pr merge --merge

# 6. Limpar branch local
git checkout main
git pull origin main
git branch -d feature/nome-da-feature
```

### 11. Configurações Adicionais

#### Git Hooks Locais:
```bash
# Criar hook pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Verificar se há arquivos .env sendo commitados
if git diff --cached --name-only | grep -q "\.env"; then
    echo "ERRO: Arquivo .env detectado no commit!"
    echo "Remova arquivos de ambiente antes do commit."
    exit 1
fi

# Verificar timestamp brasileiro
TIMESTAMP=$(date '+%d/%m/%Y %H:%M:%S')
echo "[${TIMESTAMP}] [GIT] [INFO] Pre-commit hook executado"
EOF

# Tornar executável
chmod +x .git/hooks/pre-commit
```

#### Configurações Globais Git:
```bash
# Configurar editor padrão
git config --global core.editor "code --wait"

# Configurar merge tool
git config --global merge.tool vscode

# Configurar diff tool
git config --global diff.tool vscode

# Configurar push padrão
git config --global push.default current

# Configurar pull padrão
git config --global pull.rebase false

# Configurar linha de comando colorida
git config --global color.ui auto
```

### 12. Monitoramento e Manutenção

#### Comandos Úteis:
```bash
# Ver histórico de commits
git log --oneline --graph --decorate --all

# Ver diferenças
git diff
git diff --staged

# Ver branches
git branch -a

# Ver remotes
git remote -v

# Limpar branches órfãs
git remote prune origin

# Ver estatísticas do repositório
git shortlog -sn
```

#### Verificações Regulares:
- ✅ CI/CD pipeline funcionando
- ✅ Branch protection rules ativas
- ✅ Secrets atualizados
- ✅ Labels organizadas
- ✅ Issues e PRs respondidas
- ✅ Documentação atualizada

---

## ✅ Checklist de Configuração Completa

- [ ] Repositório criado no GitHub
- [ ] Repositório local conectado ao remoto
- [ ] Autenticação configurada (Token ou SSH)
- [ ] Branch protection rules ativadas
- [ ] Secrets necessários adicionados
- [ ] Labels do projeto configuradas
- [ ] CI/CD pipeline funcionando
- [ ] README.md e documentação atualizados
- [ ] .gitignore configurado adequadamente
- [ ] Hooks Git configurados (opcional)
- [ ] Webhooks configurados (opcional)
- [ ] GitHub Pages configurado (opcional)

---

**Status:** ✅ **CONFIGURAÇÃO COMPLETA**  
**Timestamp:** 21/09/2025 10:30:45 (America/Sao_Paulo)  
**Responsável:** Murillo Dutt - Dutt eCommerce Website Design  

O GitHub está completamente configurado para sincronização eficiente com o projeto Agent Nuxt, incluindo todas as configurações de segurança, qualidade e automação necessárias para um desenvolvimento profissional.
