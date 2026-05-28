# Teresa — Análise de UI/UX

> Documento gerado em 2026-05-28 com base na leitura completa do código-fonte frontend (`/src`).

---

## 1. Visão Geral e Posicionamento Visual

Teresa se posiciona como uma **plataforma de inteligência criativa para criadores de conteúdo**. A linguagem visual reflete isso: limpa, profissional e com toques de calor (âmbar como cor de destaque primário). O estilo geral é um **minimalismo editorial** — muito espaço em branco, hierarquia tipográfica clara, cards com bordas sutis e sombras leves. Não é um SaaS genérico; tem personalidade própria.

A paleta é neutra na maior parte do tempo, com cores semânticas (verde, vermelho, âmbar) reservadas exclusivamente para estados e ações. Isso cria um ambiente de trabalho focado onde o conteúdo do usuário é o protagonista.

---

## 2. Design Tokens e Sistema de Estilo

### 2.1 Paleta de Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-background` | `#ffffff` | Fundo de superfícies elevadas (cards, modals) |
| `--color-surface` | `#fafafa` | Fundo geral da aplicação |
| `--color-input` | `#e6e6e6` | Background de campos de texto |
| `--color-border` | `rgba(0,0,0,0.1)` | Bordas de cards, divisores |
| `--color-muted` | `#666666` | Texto secundário, descrições |
| `--color-primary-foreground` | `#141414` | Títulos, texto de alta prioridade |
| `--color-success-bg/border/text` | `#f0fdf4 / #bbf7d0 / #15803d` | Feedbacks positivos |
| `--color-danger-bg/border/text` | `#fef2f2 / #fecaca / #dc2626` | Erros e ações destrutivas |

**Cores de marca não tokenizadas (hardcoded nos componentes):**

- Âmbar: `bg-amber-100 / text-amber-600` — ação "Criar novo tópico" / "Tenho uma ideia"
- Verde: `bg-[#edf7f1] / text-[#1d9a52]` — ação "Gerar tópicos" / contas conectadas
- Escuro botão: `#242424` → hover `#181818` — botão primário

### 2.2 Tipografia

Três famílias com funções bem delimitadas:

| Família | Token | Uso |
|---|---|---|
| **DM Sans** | `font-heading` | Títulos de página e seção (600–700) |
| **Rubik** | `font-body` (padrão global) | Corpo, labels, descrições, botões (400–700) |
| **JetBrains Mono** | `font-mono` | Username (`@usuario`), scripts/código |

**Escala de tamanhos aplicada:**
- `text-3xl font-bold` — Nome do usuário na home (h1)
- `text-2xl font-semibold` — Títulos de seção (h2)
- `text-lg font-semibold` — Títulos de card (h3)
- `text-base` — Corpo principal
- `text-sm` — Descrições, labels, badges
- `text-xs font-medium` — Badges pequenos, metadados

### 2.3 Bordas e Raios

O projeto usa um sistema de border-radius progressivo — não há um único raio padrão; o raio aumenta com o tamanho do elemento, criando consistência visual:

| Contexto | Raio |
|---|---|
| Botões pequenos, badges | `rounded-full` |
| Ícones interativos | `rounded-[8px]–[10px]` |
| Nav items sidebar | `rounded-[12px]` |
| Cards padrão | `rounded-[16px]` (via `--radius-card`) |
| Cards de ação | `rounded-[20px]` |
| Seções de conteúdo | `rounded-[18px]` |
| Modals / Dialogs | `rounded-[24px]–[26px]` |
| Cards destaque (news) | `rounded-[28px]–[32px]` |

### 2.4 Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-elevation-1` | `0 1px 2px -1px rgba(0,0,0,0.08), 0 10px 24px -18px rgba(0,0,0,0.24)` | Painéis principais, botão primário |
| Hover cards | `0 18px 48px -34px rgba(0,0,0,0.55)` | Cards de topic no hover |
| Featured news | `0 24px 60px -44px rgba(0,0,0,0.4)` | Card em destaque |

A escala é intencional: sombras de uma camada (elevation-1) para o painel principal, sombras mais dramáticas apenas para hover states em cards de lista.

---

## 3. Layout e Estrutura Global

### 3.1 App Shell

```
┌─────────────────────────────────────────────┐
│  HEADER  (sticky, h=80px, bg white/95 blur) │
├──────┬──────────────────────────────────────┤
│      │                                      │
│ SIDE │           MAIN CONTENT               │
│ BAR  │      (max-w-[1200px], px-6/px-10)    │
│ 64px │                                      │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

- **Header**: Fixo no topo, `z-30`, `h-[80px]`, `bg-white/95` com `backdrop-blur-sm`. Conteúdo centralizado em `max-w-[1128px]`. Contém Logo (esquerda) e Profile Menu (direita).
- **Sidebar Desktop**: Fixo à esquerda, `top-[80px]`, `w-[64px]` collapsed / `w-[224px]` expanded no hover, `z-20`. Animação de largura via Framer Motion (200ms, cubic-bezier `[0.4,0,0.2,1]`).
- **Sidebar Mobile**: Barra horizontal fixa abaixo do header, `h-12`, ícones centralizados com `justify-around`. Substitui completamente a sidebar vertical.
- **Main Content**: `pt-12 md:pt-0 md:pl-16` — compensação para mobile nav e sidebar desktop.
- **Transição de página**: `opacity: 0 → 1` via AnimatePresence (0.15s easeOut) em cada mudança de rota.

### 3.2 Grid de Conteúdo

- Largura máxima geral: `max-w-[1200px]`
- Padding lateral: `px-6` (mobile) → `px-10` (desktop)
- Padding vertical: `py-12`
- Grid de cards (home action cards): `grid-cols-1` → `sm:grid-cols-2`
- Grid de news: `md:grid-cols-2 lg:grid-cols-3`
- Grid de settings: `lg:grid-cols-[206px_780px]`

---

## 4. Fluxo de Autenticação (Rotas Públicas)

### 4.1 AuthLayout — Dois Modos

**Modo `card`**: Form centralizado em coluna única. Usado em páginas simples.

**Modo `split`**: Layout em duas colunas.
- Coluna esquerda: form de autenticação
- Coluna direita: `AuthProductShowcase` — preview 3D do produto, cards de features com ícones âmbar

### 4.2 Login (`/login`)

Fluxo em **2 etapas** (progressive disclosure):

```
Step 1: "Identifier" (email ou @usuario)
  → [Continuar]
  ↓
Step 2: Campo de senha aparece abaixo
  → [Entrar]
```

- Erro de API: card `rounded-[24px] bg-red-50 border-red-200`, texto `text-red-600`
- Erro de campo: texto vermelho abaixo do input
- Link "Esqueceu a senha?" abaixo do botão
- Footer: "Ainda não tem uma conta? [Criar conta]"
- Auto-focus no campo senha ao avançar step

### 4.3 Signup (`/signup`)

Fluxo em **2 etapas**:

```
Step 1: Código secreto de acesso
  ↓
Step 2: Formulário completo (email, @usuario, senha)
```

Acesso por convite/código indica produto em fase fechada.

### 4.4 Forgot Password (`/forgot`)

Flow padrão de recuperação por e-mail.

---

## 5. Layout Privado — Navegação

### 5.1 Header Privado

- Logo Teresa (imagem + texto com `tracking-[0.16em]`, uppercase), link para `/`
- Profile Menu (direita): avatar circular + popover com nome real, @usuario, logout e link para settings

**Profile Menu** (`PrivateProfileMenu`): Popover com:
- Avatar 40px
- Nome real (`font-semibold text-[#141414]`)
- Username (`font-mono text-[#666]`)
- Badges de contas sociais conectadas
- Links: "Configurações" e "Sair"

### 5.2 Sidebar de Navegação (Desktop)

3 itens de navegação:

| Item | Ícone | Cor especial | Destino |
|---|---|---|---|
| "Criar novo tópico" | `Lightbulb` | Âmbar (bg-amber-100) | Abre IdeaDialog |
| "Tópicos" | `Grid3X3` | — | `/` |
| "Explore" | `Compass` | — | `/explore` |

**Estados visuais:**
- **Ativo**: `bg-[#141414] text-white` (dark pill)
- **Hover**: `bg-[#f4f4f2]` com texto `#141414`
- **Inativo**: texto `#666`
- **Âmbar**: sempre âmbar no ícone, hover `#f4f4f2`

A sidebar não tem labels no estado collapsed — usa apenas ícones. Ao expandir (hover), os labels aparecem com fade-in (opacity 0→1, 100ms). Boa escolha para economia de espaço sem perda de discoverability total.

### 5.3 Sidebar Mobile

Barra horizontal com os mesmos 3 ícones. Sem labels visíveis. Estado ativo: `text-[#141414]`, inativo: `text-[#999]`.

---

## 6. Página Home (`/`)

A página mais complexa e central da aplicação. Dividida em 4 seções principais:

### 6.1 Seção de Perfil do Usuário

```
[Avatar 96px]  Nome Real (h1, 3xl bold, DM Sans)
               @usuario (JetBrains Mono, lg, #666)
               [Badge: contas conectadas]
```

- Avatar: Circular, editável (click → file picker). Mostra iniciais com `linear-gradient(135deg, #f0f2f1, #dfe4e1)` se sem foto.
- Badge de conta social: 3 estados
  - Loading: `animate-pulse` spinner
  - Nenhuma conta: `bg-red-50 border-red-200 text-red-700` com ponto vermelho — **link para `/settings/social`**
  - Conta conectada: `bg-white border-black/10 text-[#666]` com ponto verde `#1d9a52` + ícone da rede

### 6.2 Cards de Ação (2 colunas)

**"Tenho uma ideia"** (Âmbar)
- Ícone `Lightbulb` em `bg-amber-100 rounded-2xl`
- Título DM Sans, descrição Rubik
- Botão "Começar agora" com `ArrowRight`, `rounded-full`
- Abre `IdeaDialog`

**"Gerar tópicos"** (Verde)
- Ícone `Sparkles` em `bg-[#edf7f1] rounded-2xl`
- `GenerateTopicsButton` com estados: disponível / processando / cooldown / sem conta conectada

### 6.3 Banner de Onboarding (condicional)

Exibido quando `connectedAccountsCount === 0`:

```
┌─ dashed border, bg-[#fbfbfa] ──────────────────────┐
│  "Vincule uma rede social"                          │
│  Conecte Twitter/X ou TikTok...        [Configurar] │
└─────────────────────────────────────────────────────┘
```

`border-dashed border-black/15` — visual de "incompleto", direciona para ação.

### 6.4 Painel Principal (`.app-panel`)

`rounded-[18px]` com `shadow-elevation-1`. Contém:

**Aba Creator (Tópicos):**
- Header com título "Tópicos" + botão de Grupos + botão de Filtros
- `ActiveFilters` — chips de filtros ativos com botão "×" para remover
- `TopicList` — grid de `TopicCard`s com infinite scroll

**Aba Explore:**
- `ExploreListPanel` — lista de análises salvas

### 6.5 Tabs implícitas (sem componente Tab visível)

A navegação entre "Tópicos" (rota `/`) e "Explore" (rota `/explore`) é feita via roteamento, não via componente de tabs. O estado ativo é derivado de `location.pathname`. Design decision: a "tab" é a própria URL — mais compartilhável, melhor para back/forward do browser.

---

## 7. TopicCard

O card de tópico é o componente de conteúdo central da aplicação.

### Anatomia visual:

```
┌────────────────────────────────────────────────────┐
│  [Provider Badge]          [Status Badge]          │
│                                                    │
│  Título do Tópico                                  │
│  (font-heading, semibold, 2 linhas max)            │
│                                                    │
│  Resumo / descrição                                │
│  (text-sm, text-[#666], 3 linhas max)              │
│                                                    │
│  [tag1] [tag2] [tag3] [tag4] [+N]                  │
│  [grupo1] [grupo2] [+N]                            │
│                                                    │
│ ─────────────────────────────────────────────────  │
│  📅 DD/MM/AAAA    [Marcar como feito / pendente]   │
└────────────────────────────────────────────────────┘
```

**Provider Badge** (origem do tópico):
- TikTok: ícone Music2
- Twitter/X: ícone AtSign
- Ideia manual: ícone Lightbulb âmbar
- Cor: `bg-[#f4f4f2] text-[#666]`, arredondado

**Status Badge:**
- Pendente: âmbar
- Concluído: verde
- Deletado: vermelho

**Tags**: máximo 4 exibidas + badge `+N mais`
**Grupos**: máximo 3 exibidos + badge `+N mais`

**Hover state**: elevação de sombra. Click no card → navega para `/topics/:id`.

---

## 8. Página de Detalhe do Tópico (`/topics/:id`)

### Layout de 2 colunas (desktop):

```
┌──────────────────────────────┬──────────────────┐
│  TopicOverview               │  TopicTagsCard   │
│  (título, resumo, meta)      │  TopicGroupsCard │
│                              │                  │
│  TopicScriptEditor           │                  │
│  (strategic + simplified)    │                  │
│                              │                  │
│  TopicReferenceCards         │                  │
└──────────────────────────────┴──────────────────┘
```

### TopicOverview Card:
- Título editável (inline edit via `TopicEditFieldDialog`)
- Resumo editável
- Provider Badge + Status Badge
- Data de criação
- Ações: "Marcar como feito", "Deletar"

### TopicScriptEditor:
- 2 tipos de script: **Estratégico** e **Simplificado**
- 2 modos por script: **Original** e **Refinado** (IA)
- Tabs para alternar entre os tipos/modos
- Textarea com Save + botão "Refinar com IA"
- `TopicAiRefineDialog`: modal para configurar o prompt de refinamento

### Sidebar direita:
- **Tags Card**: lista de tags com `×` para remover + input para adicionar novas
- **Groups Card**: grupos vinculados com botão para gerenciar

---

## 9. Explore — Análise de Conteúdo

### 9.1 Criar Análise (`/explore/new`)

- Input de nome (80 chars max)
- Input de URL com validação e normalização
- Lista de URLs adicionadas (host + path, máximo 25)
- Botão "Finalizar e analisar"

### 9.2 Detalhe da Análise (`/explore/:id`)

**Status da análise** com badge colorido:
- Pendente / Analisando / Completo / Falhou

Enquanto analisando: progress bar escura sobre fundo claro.

**3 abas de conteúdo:**

1. **Overview**: Resumo da IA, formatos dominantes, tom, hooks, posicionamentos, padrões
2. **Contents**: Lista de conteúdos analisados (cada um com preview e metadados)
3. **Oportunidades & Tendências**: Insights estratégicos, recomendações

**InsightBarList**: Barras horizontais proporcionais para métricas como "formatos dominantes" e "distribuição de tom". Simples e eficaz.

---

## 10. Settings (`/settings/:section`)

### Layout de 2 colunas:

```
┌──────────────┬──────────────────────────────────────┐
│  Sidebar     │  Conteúdo da Seção                   │
│  (206px)     │  (780px)                             │
│              │                                      │
│  • Perfil    │  (formulário ou lista)               │
│  • Segurança │                                      │
│  • Redes     │                                      │
│  • Sessões   │                                      │
│  • Desenv.   │                                      │
│  • Perigo    │                                      │
└──────────────┴──────────────────────────────────────┘
```

Cada seção usa `AccountSettingsField` (campo com label + input + feedback inline) e `AccountSettingsFeedback` (mensagens de sucesso/erro).

**Seção Perigo**: Card com `variant="danger"` (borda/bg vermelho), confirmação com senha antes de deletar conta.

---

## 11. News / Novidades (Rotas Públicas)

### 11.1 Lista (`/news`)

- Featured post: card hero `rounded-[28px]` com sombra dramática
- Grid 3 colunas em desktop, 2 em tablet, 1 em mobile
- Category badges coloridos:

| Categoria | Background | Texto |
|---|---|---|
| Lançamento | `#181818` | branco |
| Produto | `#eef2ff` | `#3730a3` |
| Melhoria | `#ecfdf5` | `#047857` |
| Correção | `#fef3c7` | `#92400e` |
| Bastidores | `#fdf2f8` | `#9d174d` |
| Workflow | `#f4f4f2` | `#444` |

### 11.2 Detalhe (`/news/:slug`)

Artigo individual com metadados (data, categoria, autor) e corpo do conteúdo.

---

## 12. Sistema de Componentes UI

### Button

Variantes × Tamanhos:

| Variante | Aparência |
|---|---|
| `primary` (default) | `bg-[#242424] text-[#f4f4f4]`, hover `#181818`, active `translateY(1px)` |
| `secondary` | `bg-white border border-black/10 text-[#666]`, hover `#f4f4f4` |
| `outline` | Similar ao secondary |
| `danger` | Vermelho |
| `ghost` | Sem fundo nem borda, hover sutil |

| Tamanho | Altura |
|---|---|
| `xs` | `h-8` |
| `sm` | `h-9` |
| `md` (default) | `h-11` |
| `lg` | `h-14` |

Transição: `160ms ease` em background e border-color. Active state: `translateY(1px)` dá feedback físico de "pressionar".

### Card

| Variante | Aparência |
|---|---|
| `default` | `bg-white border border-black/10` |
| `panel` | Elevated com sombra |
| `muted` | `bg-[#fafafa]` |
| `danger` | Borda/bg vermelha |

### Input

- Background: `bg-[#e6e6e6]`
- Focus: `border border-[#c7c7c7] bg-[#ececec]`
- Nenhuma borda no estado rest (só o fundo cinza distingue o campo)

### Dialog / ConfirmDialog

Radix UI Dialog com overlay backdrop. `ConfirmDialog` tem modo `danger` (tonal vermelho).

---

## 13. Padrões de Interação

### 13.1 Estados de Loading

- **Skeleton**: `animate-pulse rounded-full bg-[#ececec]` — usado no profile menu enquanto carrega user
- **Disabled + spinner**: botões ficam `disabled` durante mutations
- **Inline feedback**: texto "Entrando...", "Salvando...", etc. substituem o label do botão

### 13.2 Infinite Scroll (TopicList)

Baseado em `scroll` event do `window`. Dispara load de mais 6 items quando `distanceToBottom < 260px`. Simples e performático (listener passivo).

### 13.3 Filtros (TopicFilters)

Filtros ficam num Popover. Quando aplicados, `ActiveFilters` exibe chips removíveis acima da lista. Padrão familiar de filtros ativos visíveis.

### 13.4 Confirmações Destrutivas

Ações destrutivas (deletar tópico, deletar conta) passam por `ConfirmDialog` com tom danger. Deletar conta exige re-entrada de senha.

### 13.5 Formulários

- Validação no submit (não on-change)
- Erros por campo exibidos abaixo do input
- Erros globais (API) exibidos em card vermelho acima do form
- Mutation errors são limpos ao resetar o form ou alterar campos

### 13.6 Dialogs de Edição Inline

Campos como título e resumo do tópico são editados via `TopicEditFieldDialog` — modal com textarea e botões salvar/cancelar, em vez de edição inline direta. Mantém o layout estável.

---

## 14. Responsividade

| Breakpoint | Mudanças principais |
|---|---|
| Mobile (< 640px) | Sidebar → barra horizontal; single column; padding reduzido |
| sm (640px+) | 2 colunas nos action cards; social badges em linha |
| md (768px+) | Sidebar vertical ativa; padding aumenta; sem padding-top (compensação mobile nav) |
| lg (1024px+) | Layout 2 colunas em profile + topics list; settings 2 colunas |
| xl (1280px+) | Margem automática nos containers |

---

## 15. Acessibilidade

**Pontos positivos:**
- `aria-label` em todos os botões de navegação da sidebar (que não têm texto visível)
- HTML semântico: `<main>`, `<section>`, `<aside>`, `<nav>`, `<article>`, `<header>`
- `aria-label="Navegação principal"` nas duas versões da sidebar
- Auto-focus no campo de senha ao avançar step do login
- Radix UI garante acessibilidade de Dialog, Tabs, Popover e Tooltip
- Contraste: texto `#141414` sobre `#ffffff` (16.7:1), `#666` sobre `#fff` (5.7:1)

**Pontos de atenção:**
- Sidebar collapsed usa apenas ícones sem tooltip — usuários de screen reader podem ter dificuldade (mitigado pelo `aria-label` nos botões)
- Status badges de tópico comunicam status apenas por cor + texto (OK para acessibilidade)
- `tabIndex` nos topic cards para navegação por teclado — presente mas pode ser verificado

---

## 16. Animações (Framer Motion)

| Elemento | Animação | Duração |
|---|---|---|
| Sidebar desktop | Largura 64px ↔ 224px | 200ms cubic-bezier `[0.4,0,0.2,1]` |
| Labels da sidebar | Opacity 0 → 1 / 1 → 0 | 100ms |
| Transição de página | Opacity 0 → 1 | 150ms easeOut |
| Profile menu (Radix) | Fade + scale | Padrão Radix |
| Dialogs (Radix) | Fade + scale | Padrão Radix |
| Skeleton loaders | `animate-pulse` (CSS) | Loop |

As animações são discretas e funcionais — feedback visual sem distração. Nenhuma animação desnecessária.

---

## 17. Estado Global

### Redux Toolkit
- `authSlice`: estado da sessão autenticada (user data, token)
- Usado via `useAuthSession()` hook em toda a árvore privada

### React Query (TanStack)
Cache server-side por query key:
- `useContentTopics` — lista de tópicos com filtros
- `useTopicGroups` — grupos do usuário
- `useExploreAnalyses` — análises de explore
- `useSocialAccounts` — contas sociais conectadas
- `useUserSocialJobs` — status de jobs em background
- `useAccountSettings` — dados das seções de settings
- `useCreatorProfile` — perfil público

### Context API
- `IdeaDialogContext` — controle centralizado da abertura do IdeaDialog; permite que a sidebar acione o dialog sem prop drilling

---

## 18. Resumo do Posicionamento Visual

**Linguagem de design**: Minimalismo editorial com calor

**Paleta**: Quase monocromática (pretos/cinzas) com âmbar como único destaque de marca. Verde e vermelho reservados para semântica de estado.

**Tipografia**: DM Sans (moderna, geométrica) para títulos + Rubik (humanista, amigável) para corpo. Combinação que equilibra profissionalismo com acessibilidade.

**Sensação geral**: Uma ferramenta de trabalho séria, mas não fria. O âmbar da ideia, o verde do crescimento e a iconografia (bússola para Explore, lâmpada para ideia) reforçam a metáfora criativa.

**Gaps e oportunidades identificados:**
1. Sem dark mode (tokens preparados na estrutura, mas não implementado)
2. Toasts/notificações: não há sistema global de notificações — feedbacks são inline. Pode criar problemas em ações fora do fluxo visual atual
3. Empty states: verificar se todas as listas têm estado vazio ilustrado
4. `tabIndex` nos cards de tópico: clicar com Enter/Space deveria funcionar consistentemente
5. Sidebar labels mobile: sem labels visíveis, discoverability depende de intuição dos ícones
6. Loading da análise de Explore: a progress bar poderia ter estimativa de tempo para reduzir ansiedade
