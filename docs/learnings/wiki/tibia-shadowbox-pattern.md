# Padr√£o Tibia ShadowBox (Tibia ShadowBox Pattern)

## O Problema
Muitas p√°ginas customizadas ou editadas (como `characters`, `donate`, `serverinfo`, `rules`) estavam perdendo o estilo visual "aut√™ntico" do Tibia (as sombras na borda direita e inferior). Frequentemente, as bordas ficavam cortadas, retas (apenas CSS `border`), ou completamente ausentes.

## A Solu√ß√£o (O Padr√£o)
Criamos um padr√£o unificado no MyAAC, onde abstra√≠mos a inje√ß√£o das imagens `table-shadow-*.gif` usando um arquivo Twig centralizado. O padr√£o consiste em **dois "wrappers"** (dois includes do Twig).

1. O conte√∫do real da tabela (tr/td/th) √© guardado numa vari√°vel (ex: `info_content`).
2. Essa vari√°vel √© envelopada pelas sombras usando `tables.shadowbox.html.twig`.
3. O resultado √© passado para `tables.headline.html.twig` para renderizar o t√≠tulo superior escuro da caixa.

### Como usar o padr√£o em arquivos Twig
Sempre que for criar ou refatorar uma aba, script ou tabela, utilize a estrutura abaixo:

```twig
{# 1. Crie o conte√∫do puro da tabela #}
{% set meu_conteudo %}
    <tbody>
        <tr><th>Nome</th><th>Valor</th></tr>
        <tr class="row-even"><td>XP</td><td>10x</td></tr>
    </tbody>
{% endset %}

{# 2. Aplique o padr√£o de sombreamento Tibia ShadowBox #}
{% set meu_shadowbox %}
    {% include 'tables.shadowbox.html.twig' with {'content': meu_conteudo} %}
{% endset %}

{# 3. Renderize o box completo com o t√≠tulo #}
{% include 'tables.headline.html.twig' with {'title': 'T√≠tulo da Caixa', 'content': meu_shadowbox} %}
```

### Por que usar este padr√£o?
- Garante 100% de consist√™ncia visual com o Tibia real.
- As sombras da direita e de baixo se ajustam dinamicamente ao tamanho da tabela.
- O c√≥digo fica muito mais limpo (n√£o √© necess√°rio repetir aquelas `divs` monstruosas com `background-image` em toda tabela).

### Ajuste Global de Bordas (TableContainer e InnerTableContainer)
Originalmente o MyAAC usa bordas cinzas/azuladas grossas (2px solid #55636c nas tabelas do layout 1 ao 5) e #5F4D41 no container interno.
Para manter o **"Padr„o Tibia ShadowBox Preto"** exigido (o risquinho preto puro de 1px), o arquivo asic.css global do template 	ibiacom foi alterado. 
**Nunca use bordas grossas cinzas ou azuis** nas caixas de conte˙do. Todas as tabelas herdam order: 1px solid #000; por padr„o das classes Table1 a Table5 e .TableContentContainer. A borda superior externa (order-top: none;) foi removida propositalmente para que a tabela junte perfeitamente com o *CaptionContainer* acima dela (que j· tem a linha inferior decorativa).

### Gatilho de Comando (Como o usu·rio pede)
**ATEN«√O AGENTE:** O usu·rio frequentemente ir· mandar um *print/screenshot* de uma tabela defeituosa (com bordas cinzas, sem sombra, ou sem o cabeÁalho) junto com o print de uma tabela correta, e dir· frases como: 
* *"Coloca esse detalhe em tal lugar que eu quero"*
* *"Deixe esse detalhe igual a esse daqui em tal lugar"*
* *"FaÁa esse daÌ para todos os lugares que est„o com esse erro, substitui"*

Sempre que o usu·rio falar isso apontando para as bordas/sombras de caixas do site, **ele est· pedindo para aplicar o Padr„o Tibia Headline + Tibia ShadowBox** na p·gina em quest„o (ou em todas as p·ginas com o defeito). Identifique a p·gina e refatore o cÛdigo Twig/PHP para usar os includes 	ables.headline.html.twig e 	ables.shadowbox.html.twig.
