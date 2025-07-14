/* Estilos gerais */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

/* Cabeçalho */
.app-header {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

.app-header h1 {
  color: #1E88E5;
  font-size: 28px;
  margin-bottom: 5px;
  font-weight: 700;
}

.subtitle {
  color: #757575;
  font-size: 16px;
  font-weight: 400;
}

/* Card de entrada de voz */
.voice-input-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Container do ícone de voz */
.voice-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

/* Ícone de voz (botão circular) */
.voice-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #1E88E5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  box-shadow: 0 4px 8px rgba(30, 136, 229, 0.3);
}

.voice-icon:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
}

.voice-icon.listening {
  animation: pulse 1.5s infinite;
  background-color: #F44336;
}

.voice-icon.disabled {
  background-color: #BDBDBD;
  cursor: not-allowed;
  box-shadow: none;
}

.voice-icon-inner {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
}

.voice-icon.listening .voice-icon-inner {
  animation: pulse-inner 1.5s infinite;
}

/* Ícone de microfone estilizado */
.mic-icon {
  width: 24px;
  height: 36px;
  background-color: #1E88E5;
  border-radius: 12px;
  position: relative;
}

.mic-icon:before {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: white;
  top: 6px;
  left: 6px;
}

.mic-icon:after {
  content: "";
  position: absolute;
  width: 2px;
  height: 8px;
  background-color: #1E88E5;
  bottom: -4px;
  left: 11px;
}

.voice-icon.listening .mic-icon {
  background-color: #F44336;
}

.voice-icon.listening .mic-icon:after {
  background-color: #F44336;
}

/* Status do reconhecimento de voz */
.voice-status {
  color: #616161;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
}

/* Instruções de uso */
.voice-instructions {
  text-align: center;
  margin-bottom: 24px;
  width: 100%;
}

.voice-instructions h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #424242;
  font-weight: 500;
}

.voice-instructions p {
  color: #616161;
  margin-bottom: 8px;
}

.example {
  color: #757575;
  font-size: 15px;
  margin-top: 12px;
  font-weight: 500;
}

/* Lista de exemplos */
.examples-list {
  list-style-type: none;
  padding-left: 0;
  margin-top: 8px;
  text-align: left;
  display: inline-block;
}

.examples-list li {
  font-style: italic;
  color: #9E9E9E;
  font-size: 14px;
  margin-bottom: 6px;
  position: relative;
  padding-left: 16px;
}

.examples-list li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #1E88E5;
}

/* Área de resultado do reconhecimento */
.recognition-result {
  width: 100%;
  margin-top: 16px;
}

.result-card {
  background-color: #E3F2FD;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1E88E5;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.result-card.hidden {
  display: none;
}

.result-header {
  font-weight: 500;
  margin-bottom: 12px;
  color: #1E88E5;
  font-size: 16px;
}

.result-content {
  margin-bottom: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(30, 136, 229, 0.2);
}

.result-item:last-of-type {
  border-bottom: none;
}

.result-label {
  font-weight: 500;
  color: #424242;
}

.result-value {
  font-weight: 700;
}

#recognizedValue {
  font-weight: 700;
  color: #1E88E5;
  font-size: 18px;
}

#recognizedCategory {
  font-weight: 500;
  color: #424242;
}

/* Área de debug */
.result-debug {
  margin-top: 12px;
  border-top: 1px dashed #E0E0E0;
  padding-top: 8px;
}

.debug-text {
  font-size: 12px;
  color: #9E9E9E;
  font-family: monospace;
  word-break: break-all;
}

/* Botões de ação */
.result-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 12px 16px;
  border-radius: 8px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  min-width: 120px;
  text-align: center;
}

.btn-confirm {
  background-color: #1E88E5;
  color: white;
  flex-grow: 2;
  margin-right: 8px;
}

.btn-confirm:hover {
  background-color: #1976D2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

.btn-confirm:active {
  transform: translateY(1px);
}

.btn-retry {
  background-color: #EEEEEE;
  color: #424242;
  flex-grow: 1;
}

.btn-retry:hover {
  background-color: #E0E0E0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-retry:active {
  transform: translateY(1px);
}

/* Card de dicas */
.voice-tips {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.voice-tips h4 {
  margin-bottom: 12px;
  color: #424242;
  font-size: 16px;
  font-weight: 500;
}

.voice-tips ul {
  list-style-type: none;
  color: #616161;
}

.voice-tips li {
  margin-bottom: 8px;
  font-size: 14px;
  position: relative;
  padding-left: 24px;
  line-height: 1.5;
}

.voice-tips li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #1E88E5;
  font-weight: bold;
}

.browser-support-note {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #E0E0E0;
  font-size: 13px;
  color: #757575;
}

/* Seção de transações */
.transactions-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  margin-bottom: 20px;
}

.transactions-section h3 {
  margin-bottom: 16px;
  color: #424242;
  font-size: 18px;
  font-weight: 500;
}

.transactions-list {
  max-height: 300px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #E0E0E0;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  align-items: center;
}

.transaction-category {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
}

.transaction-details {
  display: flex;
  flex-direction: column;
}

.transaction-name {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.transaction-date {
  font-size: 12px;
  color: #757575;
}

.transaction-amount {
  font-size: 16px;
  font-weight: 600;
}

.amount-positive {
  color: #4CAF50;
}

.amount-negative {
  color: #F44336;
}

.empty-state {
  text-align: center;
  color: #9E9E9E;
  font-style: italic;
  padding: 20px 0;
}

/* Rodapé */
.app-footer {
  margin-top: 20px;
  text-align: center;
  color: #757575;
  font-size: 14px;
  width: 100%;
}

/* Animações */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
  }
  
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

@keyframes pulse-inner {
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
}

/* Responsividade */
@media (max-width: 480px) {
  .container {
    padding: 16px;
  }
  
  .voice-input-card {
    padding: 16px;
  }
  
  .voice-icon {
    width: 70px;
    height: 70px;
  }
  
  .voice-icon-inner {
    width: 50px;
    height: 50px;
  }
  
  .btn {
    padding: 10px 14px;
    font-size: 14px;
    min-width: 100px;
  }
}
