document.getElementById('scrollToTop').addEventListener('click', (event) => {
    event.preventDefault(); // Impede o comportamento padrão do link
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Rolagem suave até o topo absoluto
    });
});
