document.getElementById('playBtn').addEventListener('click', () => {
    const realm = document.getElementById('realmSelect').value;
    window.api.launchGame(realm);
    
    // Animação rústica de clique: apenas muda o texto temporariamente para dar feedback
    const btn = document.getElementById('playBtn');
    const originalText = btn.innerText;
    btn.innerText = "Loading...";
    setTimeout(() => {
        btn.innerText = originalText;
    }, 1000);
});

document.getElementById('closeBtn').addEventListener('click', () => {
    window.api.closeApp();
});

document.getElementById('exitBtn').addEventListener('click', () => {
    window.api.closeApp();
});
