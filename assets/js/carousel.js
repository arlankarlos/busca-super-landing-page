// Seleciona todos os carrosséis e botões associados
const carousels = [
    {
        carousel: document.getElementById('carousel'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn')
    },
    {
        carousel: document.getElementById('installationCarousel'),
        prevBtn: document.getElementById('prevInstallationBtn'),
        nextBtn: document.getElementById('nextInstallationBtn')
    }
];

// Define o passo de rolagem para 1 imagem com espaço (250px + 16px = 266px)
const scrollStep = 250 + 16; // 266px

// Função para inicializar cada carrossel
carousels.forEach(({ carousel, prevBtn, nextBtn }) => {
    const totalImages = carousel.children.length; // Número total de imagens
    let currentPosition = 0; // Posição atual do carrossel

    // Avança o carrossel uma imagem por vez
    nextBtn.addEventListener('click', () => {
        if (currentPosition < totalImages - 3) { // Limite para exibir exatamente 3 imagens
            currentPosition++;
            carousel.style.transform = `translateX(-${scrollStep * currentPosition}px)`;
        }
    });

    // Retrocede o carrossel uma imagem por vez
    prevBtn.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            carousel.style.transform = `translateX(-${scrollStep * currentPosition}px)`;
        }
    });
});
