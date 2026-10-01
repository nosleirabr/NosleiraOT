# Padrão Tibia ShadowBox (Tibia ShadowBox Pattern)

## O Problema
Muitas páginas customizadas ou editadas (como `characters`, `donate`, `serverinfo`, `rules`) estavam perdendo o estilo visual "autêntico" do Tibia (as sombras na borda direita e inferior). Frequentemente, as bordas ficavam cortadas, retas (apenas CSS `border`), ou completamente ausentes.

## A Solução (O Padrão)
Criamos um padrão unificado no MyAAC, onde abstraímos a injeção das imagens `table-shadow-*.gif` usando um arquivo Twig centralizado. O padrão consiste em **dois "wrappers"** (dois includes do Twig).

1. O conteúdo real da tabela (tr/td/th) é guardado numa variável (ex: `info_content`).
2. Essa variável é envelopada pelas sombras usando `tables.shadowbox.html.twig`.
3. O resultado é passado para `tables.headline.html.twig` para renderizar o título superior escuro da caixa.

### Como usar o padrão em arquivos Twig
Sempre que for criar ou refatorar uma aba, script ou tabela, utilize a estrutura abaixo:

```twig
{# 1. Crie o conteúdo puro da tabela #}
{% set meu_conteudo %}
    <tbody>
        <tr><th>Nome</th><th>Valor</th></tr>
        <tr class="row-even"><td>XP</td><td>10x</td></tr>
    </tbody>
{% endset %}

{# 2. Aplique o padrão de sombreamento Tibia ShadowBox #}
{% set meu_shadowbox %}
    {% include 'tables.shadowbox.html.twig' with {'content': meu_conteudo} %}
{% endset %}

{# 3. Renderize o box completo com o título #}
{% include 'tables.headline.html.twig' with {'title': 'Título da Caixa', 'content': meu_shadowbox} %}
```

### Por que usar este padrão?
- Garante 100% de consistência visual com o Tibia real.
- As sombras da direita e de baixo se ajustam dinamicamente ao tamanho da tabela.
- O código fica muito mais limpo (não é necessário repetir aquelas `divs` monstruosas com `background-image` em toda tabela).

### Ajuste Global de Bordas (TableContainer e InnerTableContainer)
Originalmente o MyAAC usa bordas cinzas/azuladas grossas (2px solid #55636c nas tabelas do layout 1 ao 5) e #5F4D41 no container interno.
Para manter o **"Padr�o Tibia ShadowBox Preto"** exigido (o risquinho preto puro de 1px), o arquivo asic.css global do template 	ibiacom foi alterado. 
**Nunca use bordas grossas cinzas ou azuis** nas caixas de conte�do. Todas as tabelas herdam order: 1px solid #000; por padr�o das classes Table1 a Table5 e .TableContentContainer. A borda superior externa (order-top: none;) foi removida propositalmente para que a tabela junte perfeitamente com o *CaptionContainer* acima dela (que j� tem a linha inferior decorativa).
