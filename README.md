<div align="center">


# 💩 cocoladora

### Descubra quanto do seu salário está sendo investido em momentos de reflexão.

Uma calculadora divertida para estimar o valor financeiro das suas pausas remuneradas — porque produtividade também é saber a hora de ir ao banheiro. 🚽💸

![cocoladora](og-image.png)

A imagem `og-image.png` tem 1200 × 630 pixels. Antes de publicar, substitua **todas** as ocorrências de `https://cocoladora.example` em `index.html` pelo domínio HTTPS público definitivo. O domínio é um marcador reservado, não um endereço de produção. As URLs absolutas de Open Graph e Twitter devem estar presentes no HTML, sem depender de JavaScript. Hospede os arquivos estáticos com acesso público, incluindo a imagem e os ícones. O servidor local não é destinado à produção.

</div>

---

## ✨ O que o cocoladora faz?

- Calcula quanto vale cada minuto do seu trabalho.
- Estima o valor de uma pausa remunerada.
- Mantém um cronômetro da sessão atual.
- Mostra projeções mensais e anuais.
- Registra suas últimas sessões no navegador.
- Desbloqueia conquistas absurdamente importantes.
- Funciona com temas claro e escuro.
- Não envia seus dados para nenhum servidor.

## 🚀 Como executar

Você só precisa ter o [Node.js](https://nodejs.org/) instalado:

```bash
node server.cjs
```

Depois, abra no navegador:

```text
http://localhost:4173
```

Não é necessário instalar dependências ou executar uma etapa de build.

## 🧮 Como os cálculos funcionam?

O cocoladora usa:

- Salário mensal;
- Dias trabalhados;
- Horas por dia;
- Tempo estimado da pausa.

As projeções consideram 12 meses, sem férias, feriados ou 13º salário.

Os valores são estimativas recreativas — não representam renda adicional, consultoria financeira ou autorização oficial para passar o dia no banheiro.

## 🔒 Privacidade

Seus dados ficam somente no `localStorage` do navegador.

O projeto:

- Não possui backend;
- Não usa analytics;
- Não envia dados dos formulários;
- Não cria uma conta para controlar suas pausas;
- Não conta para ninguém que você demorou 47 minutos.

## 🛠️ Tecnologias

- HTML semântico;
- CSS puro;
- JavaScript puro;
- Node.js para um servidor local mínimo;
- `localStorage` para persistência no navegador.

## 📁 Estrutura do projeto

```text
├── index.html              # Interface principal
├── style.css               # Estilos, temas e responsividade
├── script.js               # Cálculos e interações
├── server.cjs              # Servidor local
├── og-image.png            # Imagem para compartilhamento
├── favicon.svg             # Ícone do projeto
└── README.md               # Este documento importantíssimo
```

## 🎯 Por que este projeto existe?

Porque alguém precisava responder, com dados, à pergunta:

> “Quanto vale exatamente essa pausa que eu acabei de fazer?”

O cocoladora transforma uma dúvida existencial em gráficos, números e uma quantidade questionável de orgulho.

## ⚠️ Antes de publicar

As URLs `https://cocoladora.example` presentes no HTML são apenas marcadores. Substitua-as pelo domínio público definitivo para que os previews de compartilhamento funcionem corretamente.

## 🤝 Contribuições

Encontrou um bug? Teve uma ideia? Descobriu que sua pausa vale mais que seu salário?

Abra uma issue ou envie um pull request. Toda contribuição é bem-vinda — especialmente as que melhoram os cálculos e pioram a seriedade do projeto.

---

<div align="center">

Feito com JavaScript, CSS e muitas pausas estratégicas. 💩

</div>
