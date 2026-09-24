"""
╔══════════════════════════════════════════════════════════════════════╗
║         RANK ANNOUNCER — NOSLEIRA OT DISCORD                        ║
║         Script: rank_announcer.py                                   ║
║         Requer: pip install discord.py                              ║
║         Compatível com: MEE6, Carl-bot, sistema próprio             ║
╚══════════════════════════════════════════════════════════════════════╝

COMO FUNCIONA:
  - Intercepta mensagens de level-up do MEE6 (ou outro bot de level).
  - Posta embed temático bonito no canal de Ranks do servidor.
  - Também tem comando manual: !rank @user <nivel> <titulo> <horas>
  - Pode rodar junto com faxina_servidor.py (bots separados ou mesmo bot).
"""

import discord
from discord.ext import commands
import re
from datetime import datetime

# ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
BOT_TOKEN        = "SEU_TOKEN_AQUI"
GUILD_ID         = 000000000000000000

# Nome ou ID do canal onde os anúncios de rank vão aparecer
RANK_CHANNEL_NAME = "ranks"         # nome do canal (sem #, minúsculo)
# RANK_CHANNEL_ID = 000000000000    # alternativa: usar ID direto

# ID do MEE6 (para interceptar level-ups automáticos)
MEE6_ID = 159985870458322944        # ID oficial do MEE6

# Se True, o bot também intercepta mensagens de level-up do MEE6
INTERCEPTAR_MEE6 = True

# Cor principal do embed (hex) — dourado Nosleira
COR_RANK = 0xFFD700

# ─── TABELA DE RANKS (nível → título + emoji) ─────────────────────────────────
# Personalize com os títulos do seu servidor.
RANK_TABLE = {
    1:  ("Aventureiro",         "🗡️"),
    2:  ("Explorador",          "🧭"),
    3:  ("Guerreiro",           "⚔️"),
    4:  ("Caçador",             "🏹"),
    5:  ("Veterano",            "🛡️"),
    6:  ("Herói",               "✨"),
    7:  ("Lendário",            "🌟"),
    8:  ("Elite de Nosleira",   "💎"),
    9:  ("Guardião",            "🔱"),
    10: ("Imortal de Nosleira", "◆"),
    15: ("Mestre Antigo",       "👑"),
    20: ("Transcendente",       "🌌"),
}

def get_rank_info(nivel: int):
    """Retorna (título, emoji) para o nível dado, usando o mais próximo abaixo."""
    titulo, emoji = "Aventureiro", "🗡️"
    for lvl in sorted(RANK_TABLE.keys()):
        if nivel >= lvl:
            titulo, emoji = RANK_TABLE[lvl]
    return titulo, emoji

# ─── SETUP ────────────────────────────────────────────────────────────────────
intents = discord.Intents.default()
intents.members = True
intents.message_content = True
intents.guilds = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ─── EMBED DE RANK-UP ─────────────────────────────────────────────────────────
def build_rank_embed(
    membro: discord.Member,
    nivel: int,
    titulo: str,
    emoji_rank: str,
    horas: str = None,
) -> discord.Embed:
    """
    Constrói o embed de anúncio de rank-up no estilo Nosleira OT.
    Retorna um discord.Embed pronto para enviar.
    """
    titulo_embed = f"◆ {nivel} · {titulo}"
    descricao = (
        f"### 🎉  {membro.mention}  subiu de rank!\n\n"
        f"> {emoji_rank}  **{titulo_embed}**\n"
    )
    if horas:
        descricao += f"> ⏱️  `{horas}` de atividade no servidor\n"
    descricao += "\n> *Dedicação recompensada. Parabéns!*  🏆"

    embed = discord.Embed(
        description=descricao,
        color=COR_RANK,
        timestamp=datetime.utcnow(),
    )
    embed.set_author(
        name="Nosleira OT — Sistema de Ranks",
        icon_url="https://i.imgur.com/HX3oI2a.png",  # troque pela logo do servidor
    )
    embed.set_thumbnail(url=membro.display_avatar.url)
    embed.add_field(
        name="◆ Novo Rank",
        value=f"```{titulo_embed}```",
        inline=True,
    )
    embed.add_field(
        name="📈 Nível",
        value=f"```{nivel}```",
        inline=True,
    )
    if horas:
        embed.add_field(
            name="⏱️ Atividade",
            value=f"```{horas}```",
            inline=True,
        )
    embed.set_footer(
        text=f"Nosleira OT 7.4  •  #{membro.name}",
        icon_url="https://i.imgur.com/HX3oI2a.png",
    )
    return embed


# ─── HELPER: acha canal de ranks ─────────────────────────────────────────────
def get_rank_channel(guild: discord.Guild) -> discord.TextChannel | None:
    """Busca o canal de ranks por nome (case-insensitive)."""
    for ch in guild.text_channels:
        if RANK_CHANNEL_NAME in ch.name.lower():
            return ch
    return None


# ─── INTERCEPTADOR MEE6 ───────────────────────────────────────────────────────
@bot.event
async def on_message(message: discord.Message):
    """
    Intercepta mensagens do MEE6 com level-up e reposta embed temático no canal de ranks.
    Formato MEE6 padrão: "GG @user, you just advanced to level X!"
    """
    if INTERCEPTAR_MEE6 and message.author.id == MEE6_ID:
        # Tenta capturar nível do embed do MEE6
        for embed in message.embeds:
            texto = (embed.description or "") + (embed.title or "")
            match = re.search(r"level[^\d]*(\d+)", texto, re.IGNORECASE)
            if match:
                nivel = int(match.group(1))
                # Tenta identificar o membro mencionado
                membro = None
                if message.mentions:
                    membro = message.mentions[0]
                elif embed.title and message.guild:
                    membro = discord.utils.find(
                        lambda m: m.name in (embed.title or ""),
                        message.guild.members,
                    )
                if membro:
                    titulo, emoji_rank = get_rank_info(nivel)
                    canal_rank = get_rank_channel(message.guild)
                    if canal_rank:
                        embed_anuncio = build_rank_embed(membro, nivel, titulo, emoji_rank)
                        await canal_rank.send(embed=embed_anuncio)

    await bot.process_commands(message)


# ─── COMANDO MANUAL: !rankup @user 10 "Imortal de Nosleira" "2500h" ──────────
@bot.command(name="rankup")
@commands.has_permissions(manage_roles=True)
async def rankup(
    ctx,
    membro: discord.Member,
    nivel: int,
    titulo: str = None,
    horas: str = None,
):
    """
    Posta anúncio de rank-up manualmente.
    Uso: !rankup @usuario <nivel> [titulo] [horas]
    Ex:  !rankup @Nosleira 10 "Imortal de Nosleira" "2500h"
    """
    if titulo is None:
        titulo_auto, emoji_auto = get_rank_info(nivel)
        titulo = titulo_auto
        emoji_r = emoji_auto
    else:
        _, emoji_r = get_rank_info(nivel)

    canal_rank = get_rank_channel(ctx.guild)
    if canal_rank is None:
        await ctx.send(f"❌ Canal `{RANK_CHANNEL_NAME}` não encontrado no servidor.", ephemeral=True)
        return

    embed = build_rank_embed(membro, nivel, titulo, emoji_r, horas)
    await canal_rank.send(embed=embed)

    if canal_rank != ctx.channel:
        await ctx.send(f"✅ Anúncio postado em {canal_rank.mention}!", ephemeral=True)


# ─── COMANDO RÁPIDO: !rank @user (mostra rank atual sem anunciar) ─────────────
@bot.command(name="rank")
async def rank(ctx, membro: discord.Member = None):
    """
    Mostra rank atual de um membro (requer que você registre os níveis manualmente ou use MEE6 API).
    Uso: !rank [@usuario]
    """
    if membro is None:
        membro = ctx.author
    # Placeholder: integre com seu sistema de levels aqui
    await ctx.send(
        f"ℹ️ {membro.mention} — use `!rankup @{membro.name} <nivel>` para anunciar um rank.",
        ephemeral=True,
    )


# ─── EXEMPLO: postar o anúncio específico do usuário mencionado ───────────────
# Para postar exatamente o exemplo dado na task:
# !rankup @"ミNosleira™ ×͜ ×" 10 "Imortal de Nosleira" "2500h de atividade"

@bot.event
async def on_ready():
    print(f"✅ Rank Announcer online como {bot.user}")
    print(f"   Canal de ranks: #{RANK_CHANNEL_NAME}")
    print(f"   Interceptar MEE6: {INTERCEPTAR_MEE6}")
    print(f"   Comando manual: !rankup @user <nivel> [titulo] [horas]")


# ─── EXECUÇÃO ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    if BOT_TOKEN == "SEU_TOKEN_AQUI":
        print("❌ Preencha BOT_TOKEN antes de executar!")
        sys.exit(1)
    bot.run(BOT_TOKEN)
