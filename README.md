# Cagômetro

HTML, CSS e JavaScript puro, sem dependências de execução ou etapa de build.

Execute `node server.cjs` e abra http://localhost:4173.

## Compartilhamento em produção

A imagem `og-image.png` tem 1200 × 630 pixels. Antes de publicar, substitua **todas** as ocorrências de `https://cagometro.example` em `index.html` pelo domínio HTTPS público definitivo. O domínio é um marcador reservado, não um endereço de produção. As URLs absolutas de Open Graph e Twitter devem estar presentes no HTML, sem depender de JavaScript. Hospede os arquivos estáticos com acesso público, incluindo a imagem e os ícones. O servidor local não é destinado à produção.

WhatsApp e outras plataformas precisam acessar o site pela internet para gerar o preview. A visualização local não valida o cache nem a renderização nessas plataformas. A imagem melhora a apresentação do compartilhamento; não garante cliques ou posicionamento no Google.

## Funcionamento

O cálculo considera salário mensal / dias / horas e o tempo de pausa informado. A projeção usa 12 meses, sem férias, feriados ou 13º. Papel: 20 folhas por dia, 200 folhas por rolo. Valores são estimativas recreativas de parte do salário, não renda adicional. O cronômetro mantém a tarifa do início da sessão, mesmo que outro cálculo seja feito depois. Salário, tema, conquistas e as últimas 10 sessões encerradas ficam no localStorage. Uma sessão em andamento não sobrevive ao recarregamento da página.

A interface usa fontes do Google Fonts, com alternativas locais. Nenhum dado dos formulários é enviado a um servidor. Não há analytics.

## Imagem

Gerada com a ferramenta integrada de imagens e redimensionada para 1200 × 630. O prompt está em `og-image-prompt.txt`.
