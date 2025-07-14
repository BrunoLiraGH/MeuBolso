// MeuBolso - Script principal
document.addEventListener('DOMContentLoaded', function() {
  // Elementos DOM - Geral
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const browserWarning = document.getElementById('browserWarning');
  const closeWarning = document.getElementById('closeWarning');
  const permissionNotice = document.getElementById('permissionNotice');
  const requestPermission = document.getElementById('requestPermission');
  
  // Elementos DOM - Dashboard
  const totalBalance = document.getElementById('totalBalance');
  const totalIncome = document.getElementById('totalIncome');
  const totalExpenses = document.getElementById('totalExpenses');
  const categoryChart = document.getElementById('categoryChart');
  const scanBtn = document.getElementById('scanBtn');
  const voiceBtn = document.getElementById('voiceBtn');
  const manualBtn = document.getElementById('manualBtn');
  const historyBtn = document.getElementById('historyBtn');
  
  // Elementos DOM - Reconhecimento de Voz
  const voiceButton = document.getElementById('voiceButton');
  const voiceStatus = document.getElementById('voiceStatus');
  
  // Elementos DOM - Entrada Manual
  const transactionType = document.getElementById('transactionType');
  const transactionAmount = document.getElementById('transactionAmount');
  const transactionCategory = document.getElementById('transactionCategory');
  const transactionDesc = document.getElementById('transactionDesc');
  const addManualTransaction = document.getElementById('addManualTransaction');
  
  // Elementos DOM - Histórico
  const transactionsList = document.getElementById('transactionsList');
  const clearTransactions = document.getElementById('clearTransactions');
  
  // Elementos DOM - Escaneamento
  const scanScreen = document.getElementById('scanScreen');
  const closeScan = document.getElementById('closeScan');
  const captureScan = document.getElementById('captureScan');
  
  // Elementos DOM - Modal de Resultado
  const recognitionModal = document.getElementById('recognitionResult');
  const recognizedValue = document.getElementById('recognizedValue');
  const recognizedCategory = document.getElementById('recognizedCategory');
  const confirmBtn = document.getElementById('confirmBtn');
  const retryBtn = document.getElementById('retryBtn');
  const debugText = document.getElementById('debugText');
  
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
    'vestuario': '👕 Vestuário',
    'salário': '💼 Salário',
    'salario': '💼 Salário',
    'pagamento': '💼 Salário'
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
    '💼 Salário': '#4CAF50',
    '💸 Outros': '#607D8B'
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
      
      // Atualizar dashboard se for a aba selecionada
      if (button.dataset.tab === 'dashboard') {
        updateDashboard();
      }
    });
  });
  
  // Botões de ação rápida no dashboard
  if (scanBtn) {
    scanBtn.addEventListener('click', () => {
      openScanScreen();
    });
  }
  
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      // Mudar para a aba de voz
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      document.querySelector('[data-tab="voice"]').classList.add('active');
      document.getElementById('voiceTab').classList.add('active');
    });
  }
  
  if (manualBtn) {
    manualBtn.addEventListener('click', () => {
      // Mudar para a aba manual
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      document.querySelector('[data-tab="manual"]').classList.add('active');
      document.getElementById('manualTab').classList.add('active');
    });
  }
  
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      // Mudar para a aba de histórico
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      document.querySelector('[data-tab="history"]').classList.add('active');
      document.getElementById('historyTab').classList.add('active');
    });
  }
  
  // Verificar se está em HTTPS (necessário para reconhecimento de voz em produção)
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Verificar suporte a reconhecimento de voz
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  
  // Verificar navegador
  const isMobileSafari = /iP(ad|hone|od).+Version\/[\d\.]+.*Safari/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent) && /Google Inc/i.test(navigator.vendor);
  const isCompatibleBrowser = isChrome || isMobileSafari;
  
  // Mostrar aviso de navegador se necessário
  if (!isCompatibleBrowser && SpeechRecognition) {
    browserWarning.style.display = 'flex';
  }
  
  closeWarning.addEventListener('click', () => {
    browserWarning.style.display = 'none';
  });
  
  // Verificar permissão de microfone
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.permissions.query({ name: 'microphone' })
      .then(permissionStatus => {
        if (permissionStatus.state === 'granted') {
          permissionNotice.style.display = 'none';
        } else {
          permissionNotice.style.display = 'flex';
        }
      })
      .catch(error => {
        // Alguns navegadores não suportam a API de permissões
        console.log('Não foi possível verificar permissões:', error);
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
  
  // Configurar reconhecimento de voz
  if (!SpeechRecognition || !isSecure) {
    if (voiceStatus) {
      voiceStatus.textContent = "Reconhecimento de voz indisponível";
    }
    if (voiceButton) {
      voiceButton.classList.add('disabled');
    }
    
    if (!isSecure) {
      console.log("O reconhecimento de voz requer uma conexão segura (HTTPS).");
    }
  } else {
    // Configurar reconhecimento de voz
    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      let isListening = false;
      
      // Iniciar/parar reconhecimento
      if (voiceButton) {
        voiceButton.addEventListener('click', () => {
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        });
      }
      
      function startListening() {
        try {
          recognition.start();
          voiceButton.classList.add('listening');
          voiceStatus.textContent = 'Ouvindo...';
          isListening = true;
        } catch (error) {
          console.error('Erro ao iniciar reconhecimento:', error);
          voiceStatus.textContent = 'Erro ao iniciar. Tente novamente.';
          alert("Erro ao iniciar o reconhecimento de voz. Tente usar a entrada manual.");
          
          // Mudar para a aba manual
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          document.querySelector('[data-tab="manual"]').classList.add('active');
          document.getElementById('manualTab').classList.add('active');
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
        
        // Para fins de debug
        if (debugText) {
          debugText.textContent = `Texto reconhecido: "${speechResult}"`;
        }
        
        // Processar o texto reconhecido
        const processedResult = processVoiceInput(speechResult);
        
        // Exibir resultado
        recognizedValue.textContent = `R$ ${processedResult.formattedAmount}`;
        recognizedCategory.textContent = processedResult.category;
        recognitionModal.style.display = 'flex';
        
        // Resetar estado
        stopListening();
      };
      
      // Tratamento de erros
      recognition.onerror = (event) => {
        console.error('Erro de reconhecimento:', event.error);
        if (voiceButton) {
          voiceButton.classList.remove('listening');
        }
        if (voiceStatus) {
          voiceStatus.textContent = 'Erro. Tente novamente';
        }
        isListening = false;
        
        if (event.error === 'not-allowed') {
          alert("Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do seu navegador.");
          permissionNotice.style.display = 'flex';
        } else {
          alert("Erro no reconhecimento de voz. Tente usar a entrada manual.");
          
          // Mudar para a aba manual
          tabButtons.forEach(btn => btn.classList.remove('active'));
          tabContents.forEach(content => content.classList.remove('active'));
          document.querySelector('[data-tab="manual"]').classList.add('active');
          document.getElementById('manualTab').classList.add('active');
        }
      };
      
      // Fim do reconhecimento
      recognition.onend = () => {
        if (isListening) {
          stopListening();
        }
      };
    } catch (error) {
      console.error('Erro ao configurar reconhecimento de voz:', error);
      if (voiceStatus) {
        voiceStatus.textContent = "Reconhecimento de voz indisponível";
      }
      if (voiceButton) {
        voiceButton.classList.add('disabled');
      }
    }
  }
  
  // Botões de confirmação e nova tentativa no modal
  confirmBtn.addEventListener('click', () => {
    const value = recognizedValue.textContent.replace('R$ ', '');
    const category = recognizedCategory.textContent;
    
    // Criar nova transação (valor negativo para despesas)
    addTransaction(parseFloat('-' + value.replace(',', '.')), category);
    
    // Fechar modal
    recognitionModal.style.display = 'none';
  });
  
  retryBtn.addEventListener('click', () => {
    recognitionModal.style.display = 'none';
    if (recognition) {
      try {
        startListening();
      } catch (error) {
        console.error('Erro ao reiniciar reconhecimento:', error);
        alert("Não foi possível reiniciar o reconhecimento de voz. Tente usar a entrada manual.");
        
        // Mudar para a aba manual
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        document.querySelector('[data-tab="manual"]').classList.add('active');
        document.getElementById('manualTab').classList.add('active');
      }
    }
  });
  
  // Fechar modal ao clicar fora
  recognitionModal.addEventListener('click', (event) => {
    if (event.target === recognitionModal) {
      recognitionModal.style.display = 'none';
    }
  });
  
  // Adicionar transação manual
  addManualTransaction.addEventListener('click', () => {
    let amount = parseFloat(transactionAmount.value.replace(',', '.'));
    const category = transactionCategory.value;
    const description = transactionDesc.value;
    const type = transactionType.value;
    
    if (isNaN(amount) || amount === 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    
    // Se for despesa, transformar em valor negativo
    if (type === 'expense') {
      amount = -Math.abs(amount);
    } else {
      amount = Math.abs(amount);
    }
    
    // Adicionar transação
    addTransaction(amount, category, description);
    
    // Limpar campos
    transactionAmount.value = '';
    transactionDesc.value = '';
    
    // Feedback
    alert('Transação registrada com sucesso!');
    
    // Mudar para a aba de dashboard
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    document.querySelector('[data-tab="dashboard"]').classList.add('active');
    document.getElementById('dashboardTab').classList.add('active');
    
    // Atualizar dashboard
    updateDashboard();
  });
  
  // Limpar histórico de transações
  clearTransactions.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todo o histórico de transações?')) {
      transactions = [];
      localStorage.setItem('meuBolsoTransactions', JSON.stringify(transactions));
      updateTransactionsList();
      updateDashboard();
      alert('Histórico limpo com sucesso!');
    }
  });
  
  // Controles da tela de escaneamento
  if (scanBtn) {
    scanBtn.addEventListener('click', openScanScreen);
  }
  
  if (closeScan) {
    closeScan.addEventListener('click', closeScanScreen);
  }
  
  if (captureScan) {
    captureScan.addEventListener('click', () => {
      // Simulação de captura de nota fiscal
      setTimeout(() => {
        closeScanScreen();
        
        // Simular reconhecimento de uma nota fiscal
        recognizedValue.textContent = 'R$ 156,30';
        recognizedCategory.textContent = '🛒 Supermercado';
        if (debugText) {
          debugText.textContent = 'Nota fiscal escaneada: Supermercado Extra';
        }
        recognitionModal.style.display = 'flex';
      }, 1000);
    });
  }
  
  function openScanScreen() {
    scanScreen.style.display = 'flex';
  }
  
  function closeScanScreen() {
    scanScreen.style.display = 'none';
  }
  
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
    
    // Limitar a 20 transações para simplificar
    if (transactions.length > 20) {
      transactions = transactions.slice(0, 20);
    }
    
    // Salvar no localStorage
    localStorage.setItem('meuBolsoTransactions', JSON.stringify(transactions));
    
    // Atualizar a interface
    updateTransactionsList();
    updateDashboard();
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
    let category = '💸 Outros';
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
    if (!transactionsList) return;
    
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
      
      const categoryColor = categoryColors[transaction.category] || categoryColors['💸 Outros'];
      
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
  
  // Função para atualizar o dashboard
  function updateDashboard() {
    if (!totalBalance || !totalIncome || !totalExpenses || !categoryChart) return;
    
    // Calcular saldos
    let income = 0;
    let expenses = 0;
    
    // Contadores de categoria para despesas
    const categoryTotals = {};
    let totalCategoryExpenses = 0;
    
    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
        
        // Adicionar à categoria correspondente
        const category = transaction.category;
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += Math.abs(transaction.amount);
        totalCategoryExpenses += Math.abs(transaction.amount);
      }
    });
    
    const balance = income - expenses;
    
    // Atualizar valores no dashboard
    totalBalance.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
    totalIncome.textContent = `R$ ${income.toFixed(2).replace('.', ',')}`;
    totalExpenses.textContent = `R$ ${expenses.toFixed(2).replace('.', ',')}`;
    
    // Gerar gráfico de categorias
    categoryChart.innerHTML = '';
    
    if (totalCategoryExpenses > 0) {
      // Ordenar categorias por valor (decrescente)
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Mostrar apenas as 5 principais categorias
      
      sortedCategories.forEach(([category, amount]) => {
        const percentage = Math.round((amount / totalCategoryExpenses) * 100);
        const color = categoryColors[category] || categoryColors['💸 Outros'];
        
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';
        chartBar.innerHTML = `
          <div class="chart-bar-icon" style="background-color: ${color}">
            ${category.split(' ')[0]}
          </div>
          <div class="chart-bar-content">
            <div class="chart-bar-label">
              <span class="chart-bar-name">${category.split(' ')[1] || 'Outros'}</span>
              <span class="chart-bar-value">${percentage}%</span>
            </div>
            <div class="chart-bar-progress">
              <div class="chart-bar-fill" style="width: ${percentage}%; background-color: ${color}"></div>
            </div>
          </div>
        `;
        
        categoryChart.appendChild(chartBar);
      });
    } else {
      categoryChart.innerHTML = '<p class="empty-state">Sem dados de despesas para exibir</p>';
    }
  }
  
  // Inicializar a lista de transações e o dashboard
  updateTransactionsList();
  updateDashboard();
  
  // Adicionar algumas transações de exemplo se não houver nenhuma
  if (transactions.length === 0) {
    // Adicionar transações de exemplo
    const exampleTransactions = [
      { amount: 3500.00, category: '💼 Salário', description: 'Salário mensal' },
      { amount: -156.30, category: '🛒 Supermercado', description: 'Compras da semana' },
      { amount: -45.90, category: '🍽️ Alimentação', description: 'Almoço' },
      { amount: -100.00, category: '⛽ Transporte', description: 'Gasolina' },
      { amount: -32.50, category: '💊 Saúde', description: 'Farmácia' }
    ];
    
    exampleTransactions.forEach(transaction => {
      addTransaction(transaction.amount, transaction.category, transaction.description);
    });
  }
});

