"""
╔══════════════════════════════════════════════════════════════════════╗
║         FAXINA AUTOMATIZADA — NOSLEIRA OT DISCORD SERVER            ║
║         Script: faxina_servidor.py                                  ║
║         Requer: pip install discord.py                              ║
║         Uso:    python faxina_servidor.py                           ║
╚══════════════════════════════════════════════════════════════════════╝

ATENÇÃO:
  - Preencha BOT_TOKEN e GUILD_ID antes de executar.
  - O bot precisa ter permissões: Manage Channels, Manage Roles, Admin.
  - Rode em modo DRY_RUN = True primeiro para visualizar sem alterar.
  - Depois mude para DRY_RUN = False para aplicar de verdade.
"""

import asyncio
import discord
from discord.ext import commands

# ─── CONFIGURAÇÕES — PREENCHA ANTES DE RODAR ──────────────────────────────────
BOT_TOKEN  = "SEU_TOKEN_AQUI"          # Token do bot (Discord Developer Portal)
GUILD_ID   = 000000000000000000        # ID numérico do seu servidor (clic-dir → Copiar ID)
DRY_RUN    = True                      # True = só loga, False = executa de verdade
# ──────────────────────────────────────────────────────────────────────────────

# ─── CANAIS A DELETAR (nomes exatos ou parciais) ──────────────────────────────
# Adicione ou remova nomes conforme necessário.
CANAIS_PARA_DELETAR = [
    # Contadores duplicados soltos no topo
    "membros",           # duplicatas de counter
    "staff voice",
    "geral 1",
    "geral 2",
    "jogando",
    "boss",
    "afk",
    # Separadores com hífens mal formatados (canais texto de separação)
    "- 🔴 --",
    "- 🤖 --",
    "-- 🔴 --",
    "-- 🤖 --",
]

# ─── MAPA DE RENOMEAÇÃO: nome_atual → [ emoji ] Novo-Nome ─────────────────────
# Chave: parte do nome atual (case-insensitive).
# Valor: nome final no padrão visual obrigatório.
RENOMEAR = {
    # ── MEMBER COUNT ──────────────────────────────────────────────
    "total membros"        : "[ 👥 ] Total-Membros",
    "membros online"       : "[ 🟢 ] Online-Agora",
    "bots"                 : "[ 🤖 ] Bots",

    # ── INFORMAÇÕES ───────────────────────────────────────────────
    "regras"               : "[ 📜 ] Regras",
    "anúncios"             : "[ 📢 ] Anúncios",
    "anunciados"           : "[ 📢 ] Anúncios",
    "novidades"            : "[ 🆕 ] Novidades",
    "changelog"            : "[ 📋 ] Changelog",
    "roadmap"              : "[ 🗺️ ] Roadmap",
    "apresentações"        : "[ 🙋 ] Apresentações",
    "apresentacao"         : "[ 🙋 ] Apresentações",
    "links"                : "[ 🔗 ] Links-Úteis",

    # ── SUPORTE ───────────────────────────────────────────────────
    "tickets"              : "[ 🎫 ] Abrir-Ticket",
    "suporte"              : "[ 🛠️ ] Suporte",
    "dúvidas"              : "[ ❓ ] Dúvidas",
    "duvidas"              : "[ ❓ ] Dúvidas",
    "reportar bug"         : "[ 🐛 ] Reportar-Bug",
    "bugs"                 : "[ 🐛 ] Reportar-Bug",

    # ── CHATS ─────────────────────────────────────────────────────
    "geral"                : "[ 💬 ] Geral",
    "off-topic"            : "[ 🎲 ] Off-Topic",
    "off topic"            : "[ 🎲 ] Off-Topic",
    "memes"                : "[ 😂 ] Memes",
    "mídia"                : "[ 🖼️ ] Mídia",
    "midia"                : "[ 🖼️ ] Mídia",
    "clips"                : "[ 🎬 ] Clips",
    "sugestões"            : "[ 💡 ] Sugestões",
    "sugestoes"            : "[ 💡 ] Sugestões",

    # ── VOICE ─────────────────────────────────────────────────────
    "lobby"                : "[ 🔊 ] Lobby",
    "pve"                  : "[ ⚔️ ] PvE",
    "pvp"                  : "[ 🏆 ] PvP",
    "event"                : "[ 🎉 ] Eventos",
    "evento"               : "[ 🎉 ] Eventos",
    "staff"                : "[ 👑 ] Staff",
    "reunião"              : "[ 📞 ] Reunião",
    "reuniao"              : "[ 📞 ] Reunião",

    # ── ADVERTISING ───────────────────────────────────────────────
    "parceiros"            : "[ 🤝 ] Parceiros",
    "publicidade"          : "[ 📣 ] Publicidade",
    "propaganda"           : "[ 📣 ] Publicidade",
}

# ─── CATEGORIAS CORRETAS — ordem e canais esperados ───────────────────────────
# Define a ordem visual das categorias e quais canais pertencem a cada uma.
# Canais listados aqui serão MOVIDOS para a categoria correspondente.
ESTRUTURA_CATEGORIAS = {
    "🏷️ MEMBER COUNT": [
        "[ 👥 ] Total-Membros",
        "[ 🟢 ] Online-Agora",
        "[ 🤖 ] Bots",
    ],
    "📋 INFORMAÇÕES": [
        "[ 📜 ] Regras",
        "[ 📢 ] Anúncios",
        "[ 🆕 ] Novidades",
        "[ 📋 ] Changelog",
        "[ 🗺️ ] Roadmap",
        "[ 🙋 ] Apresentações",
        "[ 🔗 ] Links-Úteis",
    ],
    "🛠️ SUPORTE": [
        "[ 🎫 ] Abrir-Ticket",
        "[ ❓ ] Dúvidas",
        "[ 🐛 ] Reportar-Bug",
    ],
    "💬 CHATS": [
        "[ 💬 ] Geral",
        "[ 🎲 ] Off-Topic",
        "[ 😂 ] Memes",
        "[ 🖼️ ] Mídia",
        "[ 💡 ] Sugestões",
    ],
    "🎬 MÍDIA & CLIPS": [
        "[ 🎬 ] Clips",
    ],
    "🔊 VOZ": [
        "[ 🔊 ] Lobby",
        "[ ⚔️ ] PvE",
        "[ 🏆 ] PvP",
        "[ 🎉 ] Eventos",
        "[ 👑 ] Staff",
        "[ 📞 ] Reunião",
    ],
    "📣 ADVERTISING": [],  # manter como está, sem mover canais específicos
}

# ─── CANAIS QUE DEVEM SER PRIVADOS (só Dono + Admin) ─────────────────────────
CANAIS_PRIVADOS = [
    "[ 👥 ] Total-Membros",
    "[ 🟢 ] Online-Agora",
    "[ 🤖 ] Bots",
    "[ 🎫 ] Abrir-Ticket",
    "[ 🐛 ] Reportar-Bug",
    "[ 👑 ] Staff",
    "[ 📞 ] Reunião",
]

# ─── CARGOS COM ACESSO AOS CANAIS PRIVADOS ───────────────────────────────────
# Nomes dos cargos (case-insensitive) que podem ver os canais privados.
CARGOS_PERMITIDOS_PRIVADO = ["dono", "owner", "administrador", "admin", "staff"]

# ──────────────────────────────────────────────────────────────────────────────

intents = discord.Intents.default()
intents.guilds = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)


def log(msg: str, dry: bool = False):
    """Loga mensagem com prefixo de modo."""
    prefixo = "[DRY-RUN] " if dry else "[EXECUTADO] "
    print(prefixo + msg)


def nome_bate(nome_canal: str, alvo: str) -> bool:
    """Verifica se o nome do canal contém o alvo (case-insensitive, strip)."""
    return alvo.strip().lower() in nome_canal.strip().lower()


async def deletar_canais_duplicados(guild: discord.Guild):
    """Etapa 1 — Apaga canais da lista CANAIS_PARA_DELETAR."""
    print("\n━━━ ETAPA 1: EXCLUSÃO DE DUPLICADOS ━━━")
    for canal in list(guild.channels):
        for alvo in CANAIS_PARA_DELETAR:
            if canal.name.strip().lower() == alvo.strip().lower():
                log(f"DELETAR canal: '{canal.name}' (id={canal.id})", DRY_RUN)
                if not DRY_RUN:
                    try:
                        await canal.delete(reason="Faxina automática — canal duplicado/mal posicionado")
                        await asyncio.sleep(0.7)  # respeita rate limit
                    except discord.Forbidden:
                        print(f"  ⚠ Sem permissão para deletar: {canal.name}")
                    except discord.HTTPException as e:
                        print(f"  ⚠ Erro ao deletar {canal.name}: {e}")
                break


async def renomear_canais(guild: discord.Guild):
    """Etapa 2 — Renomeia canais para o padrão [ emoji ] Nome."""
    print("\n━━━ ETAPA 2: RENOMEAÇÃO NO PADRÃO VISUAL ━━━")
    for canal in list(guild.channels):
        nome_atual = canal.name.strip().lower()
        for chave, novo_nome in RENOMEAR.items():
            if nome_bate(nome_atual, chave) and canal.name != novo_nome:
                log(f"RENOMEAR: '{canal.name}' → '{novo_nome}'", DRY_RUN)
                if not DRY_RUN:
                    try:
                        await canal.edit(name=novo_nome, reason="Faxina — padronização visual")
                        await asyncio.sleep(1.0)
                    except discord.Forbidden:
                        print(f"  ⚠ Sem permissão para renomear: {canal.name}")
                    except discord.HTTPException as e:
                        print(f"  ⚠ Erro ao renomear {canal.name}: {e}")
                break


async def organizar_categorias(guild: discord.Guild):
    """Etapa 3 — Move canais para as categorias corretas."""
    print("\n━━━ ETAPA 3: ORGANIZAÇÃO DE CATEGORIAS ━━━")
    for nome_categoria, canais_esperados in ESTRUTURA_CATEGORIAS.items():
        # Busca categoria existente (ignora emoji/maiúscula)
        categoria = discord.utils.find(
            lambda c: nome_categoria.lower() in c.name.lower()
                      or c.name.lower() in nome_categoria.lower(),
            guild.categories
        )
        if categoria is None:
            log(f"CRIAR categoria: '{nome_categoria}'", DRY_RUN)
            if not DRY_RUN:
                try:
                    categoria = await guild.create_category(nome_categoria, reason="Faxina — nova categoria")
                    await asyncio.sleep(0.7)
                except discord.Forbidden:
                    print(f"  ⚠ Sem permissão para criar categoria: {nome_categoria}")
                    continue

        for nome_canal in canais_esperados:
            canal = discord.utils.find(
                lambda c: c.name == nome_canal, guild.channels
            )
            if canal is None:
                print(f"  ℹ Canal '{nome_canal}' não encontrado para mover.")
                continue
            if canal.category == categoria:
                print(f"  ✓ '{nome_canal}' já está em '{nome_categoria}'")
                continue
            log(f"MOVER: '{canal.name}' → categoria '{nome_categoria}'", DRY_RUN)
            if not DRY_RUN:
                try:
                    await canal.edit(category=categoria, reason="Faxina — reorganização")
                    await asyncio.sleep(0.7)
                except discord.Forbidden:
                    print(f"  ⚠ Sem permissão para mover: {canal.name}")
                except discord.HTTPException as e:
                    print(f"  ⚠ Erro ao mover {canal.name}: {e}")


async def configurar_privacidade(guild: discord.Guild):
    """Etapa 4 — Ativa cadeado nos canais privados (bloqueia @everyone, libera cargos staff)."""
    print("\n━━━ ETAPA 4: CONFIGURAÇÃO DE PRIVACIDADE ━━━")

    # Busca cargos permitidos
    cargos_permitidos = [
        r for r in guild.roles
        if any(p in r.name.lower() for p in CARGOS_PERMITIDOS_PRIVADO)
    ]
    everyone = guild.default_role

    for nome_canal in CANAIS_PRIVADOS:
        canal = discord.utils.find(lambda c: c.name == nome_canal, guild.channels)
        if canal is None:
            print(f"  ℹ Canal privado '{nome_canal}' não encontrado.")
            continue

        log(f"PRIVAR: '{canal.name}' — bloquear @everyone, liberar cargos staff", DRY_RUN)
        if not DRY_RUN:
            try:
                # Nega visualização para @everyone
                await canal.set_permissions(
                    everyone,
                    view_channel=False,
                    reason="Faxina — canal privado"
                )
                await asyncio.sleep(0.5)
                # Libera para cada cargo de staff
                for cargo in cargos_permitidos:
                    await canal.set_permissions(
                        cargo,
                        view_channel=True,
                        send_messages=True,
                        read_message_history=True,
                        reason="Faxina — acesso staff ao canal privado"
                    )
                    await asyncio.sleep(0.4)
            except discord.Forbidden:
                print(f"  ⚠ Sem permissão para alterar privacidade: {canal.name}")
            except discord.HTTPException as e:
                print(f"  ⚠ Erro ao privar {canal.name}: {e}")


@bot.event
async def on_ready():
    print(f"\n{'═'*60}")
    print(f"  Bot conectado como: {bot.user}")
    print(f"  Modo: {'DRY RUN (só loga, não altera)' if DRY_RUN else '⚡ EXECUÇÃO REAL'}")
    print(f"{'═'*60}\n")

    guild = bot.get_guild(GUILD_ID)
    if guild is None:
        print("❌ GUILD_ID inválido ou bot não está no servidor. Verifique!")
        await bot.close()
        return

    print(f"Servidor: {guild.name} | Membros: {guild.member_count}")
    print(f"Canais encontrados: {len(guild.channels)}")
    print(f"Categorias: {len(guild.categories)}\n")

    # Executa as 4 etapas em sequência
    await deletar_canais_duplicados(guild)
    await renomear_canais(guild)
    await organizar_categorias(guild)
    await configurar_privacidade(guild)

    print(f"\n{'═'*60}")
    print("  ✅ FAXINA CONCLUÍDA!")
    if DRY_RUN:
        print("  ℹ Nada foi alterado (DRY_RUN=True).")
        print("  → Mude DRY_RUN = False e rode novamente para aplicar.")
    else:
        print("  🎉 Alterações aplicadas no servidor.")
    print(f"{'═'*60}\n")

    await bot.close()


# ─── EXECUÇÃO ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    print("\nNosleira OT — Faxina Automatizada Discord")
    print(f"DRY_RUN = {DRY_RUN}")
    if BOT_TOKEN == "SEU_TOKEN_AQUI":
        print("\n❌ ERRO: Preencha o BOT_TOKEN antes de executar!")
        sys.exit(1)
    if GUILD_ID == 0:
        print("\n❌ ERRO: Preencha o GUILD_ID antes de executar!")
        sys.exit(1)
    bot.run(BOT_TOKEN)
