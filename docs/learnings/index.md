# OpenTibia 7.4 - Visão Arquitetural e Memória do Projeto

## A Diretriz Mestra (O Mandato do Criador)
O objetivo supremo deste projeto é reescrever o servidor de C++ legado para o **C# moderno (.NET 10)**. O projeto DEVE respeitar os seguintes pilares, inegociáveis para qualquer agente de IA trabalhando neste código:

1. **A Alma (Retro 7.4):** A jogabilidade, o PvP, a dificuldade PvE e as mecânicas devem ser as raízes puras de 2004. O "feeling" do jogo não pode ser perdido.
2. **O Motor (Ultra-Moderno):** A engine C# deve ser o que há de mais avançado no mundo (System.IO.Pipelines, EF Core, Task-based Asynchronous Pattern). O jogo deve ser estupidamente leve e liso (sem lag).
3. **Segurança Militar (Blindado):** Zero tolerância a brechas. Proteções Anti-DDoS, Rate Limiting, Packet Throttling contra WPE Pro/Bots e arquitetura Server-Authoritative estrita. O servidor não confia no Client.
4. **Pronto para o Futuro (Integrações):** Tudo deve ser modular para permitir integração total com IA, Web Site (MyAAC suportado), Web Editor, e um Custom Client próprio com Launcher e 2FA.
5. **Ferramentas de Suporte:** Ferramentas revolucionárias (como o CamSystem via Event Sourcing) devem ser nativas para auditar bugs e manter a integridade do jogo sem pesar a máquina.

## Histórico de Implementação C# (Fases 1, 2 e 4 em andamento)
- Servidor Híbrido (Web API + Game TCP) estabelecido.
- EF Core mapeando banco MySQL antigo para garantir que o Site MyAAC continue funcionando.
- Leitores de XML (Items, Monsters) e estrutura binária de Mapa (OTBM) consolidados.
- Game Loop (Dispatcher a 50ms) e física de Tile/Mapa iniciadas.
- Defesas Anti-Bot e API de Login 2FA implantadas.
