document.getElementById('playBtn').addEventListener('click', () => {
    const realm = document.getElementById('realmSelect').value;
    const btn = document.getElementById('playBtn');
    const container = document.getElementById('progressContainer');
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');

    // Desativa botões durante o update
    btn.disabled = true;
    document.getElementById('realmSelect').disabled = true;
    btn.style.color = "#7b7b7b"; // Texto apagado
    
    // Mostra a barra
    container.style.display = "block";
    
    // Simulação de download
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5; // incrementa de 5 a 20%
        if (progress > 100) progress = 100;
        
        fill.style.width = progress + '%';
        text.innerText = `Downloading updates... ${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            text.innerText = "Client is up to date! Launching...";
            
            // Lança o jogo após 1 segundo
            setTimeout(() => {
                window.api.launchGame(realm);
                // Reseta a UI caso o app continue aberto
                btn.disabled = false;
                document.getElementById('realmSelect').disabled = false;
                btn.style.color = "#dfdfdf";
                container.style.display = "none";
                fill.style.width = '0%';
            }, 1000);
        }
    }, 300); // atualiza a cada 300ms
});

document.getElementById('closeBtn').addEventListener('click', () => {
    window.api.closeApp();
});

document.getElementById('exitBtn').addEventListener('click', () => {
    window.api.closeApp();
});
