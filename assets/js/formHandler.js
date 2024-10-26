// Função para buscar cidades brasileiras usando a API do IBGE
async function fetchBrazilianCities() {
    try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
        const cities = await response.json();

        // Cria uma lista de cidades com estados
        return cities.map(city => ({
            name: city.nome,
            state: city.microrregiao.mesorregiao.UF.nome // Extrai o nome do estado
        }));
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const cityNameInput = document.getElementById('cityName');
    const stateNameInput = document.getElementById('stateName');

    // Busca a lista de cidades e inicializa o autocompletar
    const cities = await fetchBrazilianCities();
    if (cities) {
        const cityNames = cities.map(city => city.name);

        // Inicializa o autocompletar
        new Awesomplete(cityNameInput, {
            list: cityNames,
            minChars: 2,
            maxItems: 10
        });

        // Função para preencher o estado com base na cidade
        function fillState() {
            const selectedCity = cityNameInput.value;
            const city = cities.find(city => city.name === selectedCity);

            // Exibe o estado correspondente se a cidade for encontrada
            if (city) {
                stateNameInput.value = city.state;
            } else {
                stateNameInput.value = ""; // Limpa o campo de estado se a cidade não for válida
            }
        }

        // Evento ao selecionar uma cidade através do autocompletar
        cityNameInput.addEventListener('awesomplete-selectcomplete', fillState);

        // Evento 'focus' para verificar o preenchimento automático
        cityNameInput.addEventListener('focus', function() {
            setTimeout(fillState, 100);
        });

        // Evento 'input' para preencher o estado ao digitar
        cityNameInput.addEventListener('input', fillState);
    }

    // Torna o campo de cidade obrigatório com mensagem personalizada
    cityNameInput.setAttribute('required', true);
    cityNameInput.oninvalid = function() {
        this.setCustomValidity("Por favor, selecione uma cidade válida.");
    };
    cityNameInput.oninput = function() {
        this.setCustomValidity("");
    };
});

document.addEventListener('DOMContentLoaded', function () {
    const subjectSelect = document.getElementById('subject');
    const urlInputs = document.getElementById('urlInputs');
    const cityUrl1 = document.getElementById('cityUrl1');
    const cityUrl2 = document.getElementById('cityUrl2');

    // Definir mensagens de erro personalizadas
    function setCustomValidation() {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');

        nameInput.oninvalid = function () {
            this.setCustomValidity("Por favor, preencha seu nome.");
        };
        nameInput.oninput = function () {
            this.setCustomValidity("");
        };

        emailInput.oninvalid = function () {
            this.setCustomValidity("Por favor, insira um e-mail válido.");
        };
        emailInput.oninput = function () {
            this.setCustomValidity("");
        };

        messageInput.oninvalid = function () {
            this.setCustomValidity("Por favor, insira sua mensagem.");
        };
        messageInput.oninput = function () {
            this.setCustomValidity("");
        };

        cityUrl1.oninvalid = function () {
            this.setCustomValidity("Por favor, insira uma URL válida para a Página de Sugestão 1.");
        };
        cityUrl1.oninput = function () {
            this.setCustomValidity("");
        };

        cityUrl2.oninvalid = function () {
            this.setCustomValidity("Por favor, insira uma URL válida para a Página de Sugestão 2.");
        };
        cityUrl2.oninput = function () {
            this.setCustomValidity("");
        };
    }

    // Chama a função de validação personalizada ao carregar a página
    setCustomValidation();

    // Função para atualizar a visibilidade e obrigatoriedade dos inputs de URL
    function toggleUrlInputs() {
        if (subjectSelect.value === "Adicionar sua cidade") {
            urlInputs.classList.remove('hidden'); // Exibe os inputs
            cityUrl1.setAttribute('required', true); // Torna obrigatório
            cityUrl2.setAttribute('required', true);
        } else {
            urlInputs.classList.add('hidden'); // Oculta os inputs
            cityUrl1.removeAttribute('required'); // Remove obrigatoriedade
            cityUrl2.removeAttribute('required');
            cityUrl1.value = ''; // Limpa o valor para evitar envio com dados ocultos
            cityUrl2.value = '';
        }
    }

    // Evento 'change' para detectar quando o assunto é alterado
    subjectSelect.addEventListener('change', toggleUrlInputs);

    // Chama a função ao carregar a página para exibir os inputs se "Adicionar sua cidade" estiver pré-selecionado
    toggleUrlInputs();

    // Função para capturar os valores do formulário e enviar ao backend
    document.getElementById('contactForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        // Captura os valores dos campos do formulário
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        const cityName = document.getElementById('cityName').value.trim();
        const stateName = document.getElementById('stateName').value.trim();
        const url1 = cityUrl1.value.trim();
        const url2 = cityUrl2.value.trim();

        // Verifica se os campos obrigatórios estão preenchidos
        if (!name || !email || !subject || !message) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        // Monta a mensagem completa
        const fullMessage = `
            Nome: ${name}
            E-mail: ${email}
            Cidade: ${cityName}
            Estado: ${stateName}
            Mensagem: ${message}
            Página de Sugestão 1: ${url1}
            Página de Sugestão 2: ${url2}
        `;

        // Envia os dados ao servidor Flask para envio de e-mail
        fetch("http://localhost:5000/api/send_email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                subject: subject,
                message: fullMessage,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert(data.success);
                } else {
                    alert("Erro ao enviar o e-mail: " + data.error);
                }
            })
            .catch((error) => console.error("Erro:", error));
    });
});
