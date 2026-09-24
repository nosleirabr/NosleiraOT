"""
╔══════════════════════════════════════════════════════════════════════╗
║      SETUP DE ESTRUTURA — NOSLEIRA OT DISCORD                       ║
║      Script: setup_estrutura.py                                     ║
║      Requer: pip install discord.py                                 ║
║                                                                      ║
║  Cria/reorganiza categorias e canais conforme estrutura oficial.    ║
║  Rode sempre com DRY_RUN = True primeiro!                           ║
╚══════════════════════════════════════════════════════════════════════╝
"""

import asyncio
import discord
from discord.ext import commands

# ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
BOT_TOKEN = "SEU_TOKEN_AQUI"   # ← você já colou o token aqui?
GUILD_ID  = 1550946849223868477
DRY_RUN   = True          # True = só loga. False = aplica de verdade.
# ──────────────────────────────────────────────────────────────────────────────

# ─── ESTRUTURA OFICIAL COMPLETA ───────────────────────────────────────────────
#
#  Formato de cada canal:
#    {
#      "nome"      : str   → nome final exato no Discord
#      "tipo"      : "text" | "voice" | "stage"
#      "privado"   : bool  → True = bloqueia @everyone
#      "somente_ver": bool → True = @everyone vê mas não escreve (anúncios)
#      "posicao"   : int   → ordem dentro da categoria (menor = mais acima)
#    }
#
ESTRUTURA = [
    # ══════════════════════════════════════════════════════════════
    # 1. INFORMAÇÕES E COMANDOS
    # ══════════════════════════════════════════════════════════════
    {
        "categoria": "[ 📢 ] INFORMAÇÕES E COMANDOS",
        "privada"  : False,   # categoria visível a todos
        "canais": [
            {"nome": "[ 🤖 ] Comandos-Geral",  "tipo": "text",  "privado": False, "somente_ver": False, "posicao": 0},
            {"nome": "[ 📢 ] Comunicados",      "tipo": "text",  "privado": False, "somente_ver": True,  "posicao": 1},
            {"nome": "[ ✍🏻 ] Atualizacoes",    "tipo": "text",  "privado": False, "somente_ver": True,  "posicao": 2},
            {"nome": "[ 🔱 ] Links",             "tipo": "text",  "privado": False, "somente_ver": True,  "posicao": 3},
            {"nome": "[ ⛔ ] Regras",            "tipo": "text",  "privado": False, "somente_ver": True,  "posicao": 4},
        ],
    },

    # ══════════════════════════════════════════════════════════════
    # 2. ATENDIMENTO E SUPORTE
    # ══════════════════════════════════════════════════════════════
    {
        "categoria": "[ 🎫 ] ATENDIMENTO E SUPORTE",
        "privada"  : False,   # painel visível a todos; logs são privados
        "canais": [
            # Canal principal — todos veem e clicam no botão de ticket
            {"nome": "[ 🔴 ] Ticket-BR",      "tipo": "text",  "privado": False, "somente_ver": False, "posicao": 0},
            # Log interno — só staff vê
            {"nome": "[ 📋 ] Log-Tickets",    "tipo": "text",  "privado": True,  "somente_ver": False, "posicao": 1},
            # Tickets ativos são criados pelo bot ABAIXO desta categoria automaticamente
        ],
    },

    # ══════════════════════════════════════════════════════════════
    # 3. COMUNIDADE E MÍDIA
    # ══════════════════════════════════════════════════════════════
    {
        "categoria": "[ 🎮 ] COMUNIDADE E MÍDIA",
        "privada"  : False,
        "canais": [
            {"nome": "[ 🎥 ] Streamers",     "tipo": "text",  "privado": False, "somente_ver": False, "posicao": 0},
            {"nome": "[ 📷 ] Screenshots",   "tipo": "text",  "privado": False, "somente_ver": False, "posicao": 1},
            {"nome": "[ 📺 ] Clips",         "tipo": "text",  "privado": False, "somente_ver": False, "posicao": 2},
        ],
    },

    # ══════════════════════════════════════════════════════════════
    # 4. CANAIS DE VOZ
    # ══════════════════════════════════════════════════════════════
    {
        "categoria": "[ 🔊 ] CANAIS DE VOZ",
        "privada"  : False,
        "canais": [
            # [ 👥 ] Membros é contador — deve ser criado como voice com limite 0
            {"nome": "[ 👥 ] Membros",        "tipo": "voice", "privado": True,  "somente_ver": True,  "posicao": 0},
            {"nome": "[ 🔊 ] Staff Voice",    "tipo": "voice", "privado": True,  "somente_ver": False, "posicao": 1},
            {"nome": "[ 🔊 ] Geral 1",        "tipo": "voice", "privado": False, "somente_ver": False, "posicao": 2},
            {"nome": "[ 🔊 ] Geral 2",        "tipo": "voice", "privado": False, "somente_ver": False, "posicao": 3},
            {"nome": "[ 🎮 ] Jogando",        "tipo": "voice", "privado": False, "somente_ver": False, "posicao": 4},
            {"nome": "[ 🐉 ] Boss",           "tipo": "voice", "privado": False, "somente_ver": False, "posicao": 5},
            {"nome": "[ 💤 ] AFK",            "tipo": "voice", "privado": False, "somente_ver": False, "posicao": 6},
        ],
    },
]

# ─── CARGOS COM ACESSO TOTAL AOS CANAIS PRIVADOS ─────────────────────────────
CARGOS_STAFF = ["dono", "owner", "administrador", "admin", "staff", "moderador", "mod"]

# ──────────────────────────────────────────────────────────────────────────────

intents = discord.Intents.default()
intents.guilds = True
intents.members = True

bot = commands.Bot(command_prefix="!", intents=intents)


def log(msg: str):
    prefixo = "[DRY-RUN]  " if DRY_RUN else "[EXECUTADO]"
    print(f"{prefixo} {msg}")


def achar_categoria(guild: discord.Guild, nome: str) -> discord.CategoryChannel | None:
    """Busca categoria por nome exato ou parcial (case-insensitive)."""
    nome_limpo = nome.strip().lower()
    for cat in guild.categories:
        if cat.name.strip().lower() == nome_limpo:
            return cat
    # Tentativa parcial (pelo conteúdo sem emoji)
    chave = nome_limpo.replace("[", "").replace("]", "").strip()
    for cat in guild.categories:
        if chave in cat.name.strip().lower():
            return cat
    return None


def achar_canal(guild: discord.Guild, nome: str) -> discord.abc.GuildChannel | None:
    """Busca canal por nome exato (case-insensitive)."""
    nome_limpo = nome.strip().lower()
    for ch in guild.channels:
        if ch.name.strip().lower() == nome_limpo:
            return ch
    return None


async def build_overwrites(
    guild: discord.Guild,
    privado: bool,
    somente_ver: bool,
) -> dict:
    """
    Monta dicionário de permissões (overwrites) para o canal.

    - privado=True      → @everyone não vê; staff vê e escreve
    - somente_ver=True  → @everyone vê mas não escreve (canal de anúncio)
    - ambos False       → @everyone vê e escreve normalmente
    """
    everyone = guild.default_role
    overwrites = {}

    if privado:
        overwrites[everyone] = discord.PermissionOverwrite(view_channel=False)
    elif somente_ver:
        overwrites[everyone] = discord.PermissionOverwrite(
            view_channel=True,
            send_messages=False,
            add_reactions=False,
        )
    # Libera cargos de staff em qualquer canal privado ou somente-ver
    if privado or somente_ver:
        for role in guild.roles:
            if any(s in role.name.lower() for s in CARGOS_STAFF):
                overwrites[role] = discord.PermissionOverwrite(
                    view_channel=True,
                    send_messages=True,
                    manage_messages=True,
                )
    return overwrites


async def garantir_categoria(
    guild: discord.Guild,
    nome: str,
    posicao: int,
) -> discord.CategoryChannel | None:
    """Cria a categoria se não existir; retorna o objeto."""
    cat = achar_categoria(guild, nome)
    if cat:
        log(f"  ✓ Categoria já existe: '{cat.name}'")
        return cat
    log(f"  CRIAR CATEGORIA: '{nome}' (posição {posicao})")
    if DRY_RUN:
        return None
    try:
        cat = await guild.create_category(nome, position=posicao, reason="Setup estrutura Nosleira OT")
        await asyncio.sleep(0.8)
        return cat
    except discord.Forbidden:
        print(f"    ⚠ Sem permissão para criar categoria: {nome}")
        return None
    except discord.HTTPException as e:
        print(f"    ⚠ Erro ao criar categoria {nome}: {e}")
        return None


async def garantir_canal(
    guild: discord.Guild,
    categoria: discord.CategoryChannel | None,
    cfg: dict,
) -> None:
    """Cria ou move/renomeia canal para a categoria correta com as permissões certas."""
    nome    = cfg["nome"]
    tipo    = cfg["tipo"]
    privado = cfg["privado"]
    sv      = cfg["somente_ver"]
    pos     = cfg["posicao"]

    canal_existente = achar_canal(guild, nome)
    overwrites = await build_overwrites(guild, privado, sv)

    if canal_existente:
        # Canal existe — verifica se precisa mover
        cat_nome = categoria.name if categoria else "(sem categoria)"
        if canal_existente.category == categoria:
            log(f"    ✓ '{nome}' já está em '{cat_nome}'")
        else:
            cat_atual = canal_existente.category.name if canal_existente.category else "raiz"
            log(f"    MOVER: '{nome}'  [{cat_atual}] → [{cat_nome}]")
            if not DRY_RUN and categoria:
                try:
                    await canal_existente.edit(
                        category=categoria,
                        position=pos,
                        overwrites=overwrites,
                        reason="Setup estrutura Nosleira OT",
                    )
                    await asyncio.sleep(0.7)
                except (discord.Forbidden, discord.HTTPException) as e:
                    print(f"    ⚠ Erro ao mover '{nome}': {e}")
        return

    # Canal não existe — criar
    tipo_str = {"text": "texto", "voice": "voz"}.get(tipo, tipo)
    priv_str = " [PRIVADO]" if privado else (" [SÓ VER]" if sv else "")
    log(f"    CRIAR canal {tipo_str}: '{nome}'{priv_str}")
    if DRY_RUN:
        return

    try:
        if tipo == "text":
            await guild.create_text_channel(
                nome,
                category=categoria,
                position=pos,
                overwrites=overwrites,
                reason="Setup estrutura Nosleira OT",
            )
        elif tipo == "voice":
            await guild.create_voice_channel(
                nome,
                category=categoria,
                position=pos,
                overwrites=overwrites,
                reason="Setup estrutura Nosleira OT",
            )
        await asyncio.sleep(0.8)
    except discord.Forbidden:
        print(f"    ⚠ Sem permissão para criar canal: {nome}")
    except discord.HTTPException as e:
        print(f"    ⚠ Erro ao criar canal {nome}: {e}")


@bot.event
async def on_ready():
    print(f"\n{'═'*62}")
    print(f"  Bot: {bot.user}")
    print(f"  Modo: {'DRY RUN — nada será alterado' if DRY_RUN else '⚡ EXECUÇÃO REAL'}")
    print(f"{'═'*62}\n")

    guild = bot.get_guild(GUILD_ID)
    if guild is None:
        print("❌ GUILD_ID inválido! Verifique o ID e se o bot está no servidor.")
        await bot.close()
        return

    print(f"Servidor : {guild.name}")
    print(f"Membros  : {guild.member_count}")
    print(f"Canais   : {len(guild.channels)}")
    print(f"Categorias: {len(guild.categories)}\n")

    # ── Itera as 4 categorias na ordem definida ──────────────────
    for i, bloco in enumerate(ESTRUTURA):
        nome_cat = bloco["categoria"]
        print(f"\n{'─'*60}")
        print(f"  📁 {nome_cat}")
        print(f"{'─'*60}")

        categoria = await garantir_categoria(guild, nome_cat, posicao=i * 10)

        for cfg_canal in bloco["canais"]:
            await garantir_canal(guild, categoria, cfg_canal)

    # ── Resumo ───────────────────────────────────────────────────
    print(f"\n{'═'*62}")
    print("  ✅ SETUP CONCLUÍDO!")
    if DRY_RUN:
        print("  ℹ  Nada foi alterado (DRY_RUN = True).")
        print("  →  Mude DRY_RUN = False para aplicar.")
    else:
        print("  🎉 Estrutura aplicada no servidor!")
    print(f"{'═'*62}\n")

    await bot.close()


if __name__ == "__main__":
    import sys
    if BOT_TOKEN == "SEU_TOKEN_AQUI":
        print("❌ Preencha BOT_TOKEN antes de executar!")
        sys.exit(1)
    if GUILD_ID == 0:
        print("❌ Preencha GUILD_ID antes de executar!")
        sys.exit(1)
    bot.run(BOT_TOKEN)
