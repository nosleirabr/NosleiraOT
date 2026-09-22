# UI/UX Minimalist - OTClient Project
# Based on project_skillz.md standards

## Feedback Instantâneo
- **pointer-down**: Response visual deve acontecer imediatamente (nunca wait click release)
- **Active state**: Elemento deve mostrar estado pressionado no mousedown, não no mouseup
- **Example**: Button com transform: scale(0.98) ao :active

## Manipulação Direta 1:1 Tracking
- Cursor deve seguir elemento milimetricamente durante drag
- Não deve haver "lag" ou "dead zone"
- **Exemplo**: `transform: translate(`(cursorX - elementWidth/2) `(`cursorY - elementHeight/2)``

## Design System Restrições
- **Cores**: Paleta restrita, hierarquia tipográfica rigorosa
- **Superfícies**: Sutil, respiros generosos (whitespace)
- **Borders**: Hairlines (1px), squircles em vez de sombras pesadas
- **Sombras**: Rejeitar sombras pesadas ou poluição visual

## Components Patterns
```
✅ CORRECT - Componente minimalista:
<button class="btn">
    CTA Text
</button>

❌ EVITAR - Excesso visual:
<div class="btn card shadow-lg rounded-xl hover:shadow-xl transition-all">
    CTA Text
</div>
```

## Responsive & Accessibility
- **whitespace**: Espaçamento consistente (8px base scale)
- **focus-visible**: Outline visível para navegação keyboard
- **prefers-reduced-motion**: Desabilitar animações que movem
- **hover only decoration**: Never make functionality depend on hover

## Game UI Specific
- HUD elements: Positions fixas, não animam desnecessariamente
- Tooltips: Aparecem on hover, desaparecem on mouse leave
- Modals: Focus trap, escape to close, backdrop blur