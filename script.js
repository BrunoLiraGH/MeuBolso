// MeuBolso - Script principal
document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM
  const voiceButton = document.getElementById('voiceButton');
  const voiceStatus = document.getElementById('voiceStatus');
  const resultCard = document.getElementById('resultCard');
  const recognizedValue = document.getElementById('recognizedValue');
  const recognizedCategory = document.getElementById('recognizedCategory');
  const confirmBtn = document.getElementById('confirmBtn');
  const retryBtn = document.getElementById('retryBtn');
  const transactionsList = document.getElementById('transactionsList');
  const browserWarning = document.getElementById('browserWarning');
  const closeWarning = document.getElementById('closeWarning');
  const permissionNotice = document.getElementById('permissionNotice');
  const requestPermission = document.getElementById('requestPermission');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const addManualTransaction = document.getElementById('addManualTransaction');
  const transactionAmount = document.getElementById('transactionAmount');
  const transactionCategory = document.getElementById('transactionCategory');
  const transactionDesc = document.getElementById('transactionDesc');
  
  // Inicializar histórico de transações do localStorage
  let transactions = JSON.parse(localStorage.getItem('meuBolsoTransactions')) || [];
  
  // Categorias reconhecidas
  const categories = {
    'alimentação': '🍽️ Alimentação',
    'alimentacao': '🍽️ Alimentação',
    'comida': '🍽️ Alimentação',
    'restaurante': '🍽️ Alimentação',
    'lanche': '🍽️ Alimentação',
    'transporte': '⛽ Transporte',
    'uber': '⛽ Transporte',
    'taxi': '⛽ Transporte',
    'táxi': '⛽ Transporte',
    'combustível': '⛽ Transporte',
    'combustivel': '⛽ Transporte',
    'gasolina': '⛽ Transporte',
    'ônibus': '⛽ Transporte',
    'onibus': '⛽ Transporte',
    'lazer': '🎬 Lazer',
    'cinema': '🎬 Lazer',
    'teatro': '🎬 Lazer',
    'show': '🎬 Lazer',
    'supermercado': '🛒 Supermercado',
    'mercado': '🛒 Supermercado',
    'compras': '🛒 Supermercado',
    'moradia': '🏠 Moradia',
    'aluguel': '🏠 Moradia',
    'casa': '🏠 Moradia',
    'condomínio': '🏠 Moradia',
    'condominio': '🏠 Moradia',
    'saúde': '💊 Saúde',
    'saude': '💊 Saúde',
    'remédio': '💊 Saúde',
    'remedio': '💊 Saúde',
    'farmácia': '💊 Saúde',
    'farmacia': '💊 Saúde',
    'médico': '💊 Saúde',
    'medico': '💊 Saúde',
    'roupa': '👕 Vestuário',
    'roupas': '👕 Vestuário',
    'vestuário': '👕 Vestuário',
    'vestuario': '👕 Vestuário'
  };
  
  // Cores das categorias
  const categoryColors = {
    '🍽️ Alimentação': '#E91E63',
    '⛽ Transporte': '#673AB7',
    '🎬 Lazer': '#8BC34A',
    '🛒 Supermercado': '#FF9800',
    '🏠 Moradia': '#009688',
    '💊 Saúde': '#F44336',
    '👕 Vestuário': '#3F51B5',
    'Outros': '#607D8B'
  };
  
  // Sistema de abas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remover classe active de todas as abas
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Adicionar classe active à aba clicada
      button.classList.add('active');
      document.getElementById(`${button.dataset.tab}Tab`).classList.add('active');
    });
  });
  
  // Verificar se está em HTTPS (necessário para reconhecimento de voz em produção)
  const isSecure = window.location.protocol === 'https:';
  
  // Verificar suporte a reconhecimento de voz
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  
  // Verificar navegador
  const isMobileSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent) && /Google Inc/i.test(navigator.vendor);
  const isCompatibleBrowser = isChrome || isMobileSafari;
  
  // Mostrar aviso de navegador se necessário
  if (!isCompatibleBrowser) {
    browserWarning.style.display = 'flex';
  } else {
    browserWarning.style.display = 'none';
  }
  
  closeWarning.addEventListener('click', () => {
    browserWarning.style.display = 'none';
  });
  
  // Verificar permissão de microfone
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
      if (permissionStatus.state === 'granted') {
        permissionNotice.style.display = 'none';
      } else {
        permissionNotice.style.display = 'flex';
      }
    });
  }
  
  requestPermission.addEventListener('click', () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          permissionNotice.style.display = 'none';
          alert('Permissão concedida! Você pode usar o reconhecimento de voz agora.');
        })
        .catch(err => {
          alert('Não foi possível obter permissão para o microfone: ' + err.message);
        });
    }
  });
  
  if (!SpeechRecognition || (!isSecure && !window.location.hostname.includes('localhost'))) {
    voiceStatus.textContent = "Reconhecimento de voz indisponível";
    voiceButton.classList.add('disabled');
    
    if (!isSecure) {
      alert("O reconhecimento de voz requer uma conexão segura (HTTPS). Algumas funcionalidades podem não estar disponíveis.");
    }
  } else {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    let isListening = false;
    
    // Iniciar/parar reconhecimento
    voiceButton.addEventListener('click', () => {
      if (isListening) {
        stopListening();
      } else {
        startListening();
      }
    });
    
    function startListening() {
      resultCard.classList.add('hidden');
      try {
        recognition.start();
        voiceButton.classList.add('listening');
        voiceStatus.textContent = 'Ouvindo...';
        isListening = true;
      } catch (error) {
        console.error('Erro ao iniciar reconhecimento:', error);
        voiceStatus.textContent = 'Erro ao iniciar. Tente novamente.';
        alert("Erro ao iniciar o reconhecimento de voz: " + error.message);
      }
    }
    
    function stopListening() {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Erro ao parar reconhecimento:', e);
      }
      voiceButton.classList.remove('listening');
      voiceStatus.textContent = 'Toque para falar';
      isListening = false;
    }
    
    // Processar resultado
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      console.log('Fala reconhecida:', speechResult);
      
      // Processar o texto reconhecido
      const processedResult = processVoiceInput(speechResult);
      
      // Exibir resultado
      recognizedValue.textContent = `R$ ${processedResult.formattedAmount}`;
      recognizedCategory.textContent = processedResult.category;
      resultCard.classList.remove('hidden');
      
      // Resetar estado
      stopListening();
    };
    
    // Tratamento de erros
    recognition.onerror = (event) => {
      console.error('Erro de reconhecimento:', event.error);
      voiceButton.classList.remove('listening');
      voiceStatus.textContent = 'Erro. Tente novamente';
      isListening = false;
      
      if (event.error === 'not-allowed') {
        alert("Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do seu navegador.");
        permissionNotice.style.display = 'flex';
      }
    };
    
    // Fim do reconhecimento
    recognition.onend = () => {
      if (isListening) {
        stopListening();
      }
    };
  }
  
  // Botões de confirmação e nova tentativa
  confirmBtn.addEventListener('click', () => {
    const value = recognizedValue.textContent.replace('R$ ', '');
    const category = recognizedCategory.textContent;
    
    // Criar nova transação
    addTransaction(parseFloat(value.replace(',', '.')), category);
    
    // Feedback
    resultCard.classList.add('hidden');
  });
  
  retryBtn.addEventListener('click', () => {
    resultCard.classList.add('hidden');
    if (recognition) {
      startListening();
    }
  });
  
  // Adicionar transação manual
  addManualTransaction.addEventListener('click', () => {
    const amount = parseFloat(transactionAmount.value);
    const category = transactionCategory.value;
    const description = transactionDesc.value;
    
    if (isNaN(amount) || amount === 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    
    // Adicionar transação
    addTransaction(amount, category, description);
    
    // Limpar campos
    transactionAmount.value = '';
    transactionDesc.value = '';
    
    // Feedback
    alert('Transação registrada com sucesso!');
  });
  
  // Função para adicionar transação
  function addTransaction(amount, category, description = '') {
    // Criar nova transação
    const newTransaction = {
      id: Date.now(),
      amount: amount,
      category: category,
      date: new Date().toISOString(),
      description: description || category
    };
    
    // Adicionar ao histórico
    transactions.unshift(newTransaction);
    
    // Limitar a 10 transações para simplificar
    if (transactions.length > 10) {
      transactions = transactions.slice(0, 10);
    }
    
    // Salvar no localStorage
    localStorage.setItem('meuBolsoTransactions', JSON.stringify(transactions));
    
    // Atualizar a interface
    updateTransactionsList();
    
    // Mudar para a aba de histórico
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="history"]').classList.add('active');
    document.getElementById('historyTab').classList.add('active');
  }
  
  // Função para processar texto de entrada por voz
  function processVoiceInput(voiceText) {
    console.log('Processando entrada de voz:', voiceText);
    
    // Padrões de valores a serem reconhecidos:
    // 1. Números seguidos por "reais" ou "real" - ex: "50 reais"
    // 2. Números com "e" para centavos - ex: "32 e 50"
    // 3. Números com vírgula ou ponto - ex: "45,90" ou "45.90"
    // 4. Apenas números - ex: "100"
    
    // Tentar padrão "X reais/real"
    let valueMatch = voiceText.match(/(\d+)[.,]?(\d*)\s*(reais|real)/i);
    
    // Se não encontrou, tentar padrão "X e Y" (para reais e centavos)
    if (!valueMatch) {
      valueMatch = voiceText.match(/(\d+)\s+e\s+(\d+)/i);
      if (valueMatch) {
        // Converter para formato decimal (X.Y)
        valueMatch[2] = valueMatch[2].padEnd(2, '0').substring(0, 2);
      }
    }
    
    // Se não encontrou, tentar padrão "X vírgula/ponto Y"
    if (!valueMatch) {
      valueMatch = voiceText.match(/(\d+)[,.](\d+)/i);
    }
    
    // Se não encontrou, procurar por qualquer número
    if (!valueMatch) {
      valueMatch = voiceText.match(/(\d+)/i);
      if (valueMatch) {
        valueMatch[2] = "00"; // Adicionar centavos zero
      }
    }
    
    let amount = 0;
    let formattedAmount = '0,00';
    let missingValue = false;
    
    if (valueMatch) {
      const integerPart = valueMatch[1];
      const decimalPart = valueMatch[2] || '00';
      formattedAmount = `${integerPart},${decimalPart.padEnd(2, '0').substring(0, 2)}`;
      amount = parseFloat(`${integerPart}.${decimalPart.padEnd(2, '0').substring(0, 2)}`);
    } else {
      missingValue = true;
    }
    
    // Extrair categoria
    let category = 'Outros';
    let missingCategory = true;
    let confidence = 0.5;
    
    for (const [key, displayName] of Object.entries(categories)) {
      if (voiceText.includes(key)) {
        category = displayName;
        missingCategory = false;
        confidence = 0.9;
        break;
      }
    }
    
    return {
      amount,
      formattedAmount,
      category,
      confidence,
      missingValue,
      missingCategory,
      isIncomplete: missingValue || missingCategory,
      rawText: voiceText
    };
  }
  
  // Função para atualizar a lista de transações
  function updateTransactionsList() {
    if (transactions.length === 0) {
      transactionsList.innerHTML = '<p class="empty-state">Suas transações aparecerão aqui</p>';
      return;
    }
    
    transactionsList.innerHTML = '';
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      const transactionItem = document.createElement('div');
      transactionItem.className = 'transaction-item';
      
      const isPositive = transaction.amount > 0;
      const amountClass = isPositive ? 'amount-positive' : 'amount-negative';
      const amountSign = isPositive ? '+' : '-';
      const amountValue = Math.abs(transaction.amount).toFixed(2).replace('.', ',');
      
      const categoryColor = categoryColors[transaction.category] || categoryColors['Outros'];
      
      transactionItem.innerHTML = `
        <div class="transaction-info">
          <div class="transaction-category" style="background-color: ${categoryColor}">
            ${transaction.category.split(' ')[0]}
          </div>
          <div class="transaction-details">
            <div class="transaction-name">${transaction.category.split(' ')[1] || 'Outros'}</div>
            <div class="transaction-date">${formattedDate}</div>
          </div>
        </div>
        <div class="transaction-amount ${amountClass}">${amountSign}R$ ${amountValue}</div>
      `;
      
      transactionsList.appendChild(transactionItem);
    });
  }
  
  // Inicializar a lista de transações
  updateTransactionsList();
});
