Crie uma aplicação web de dashboard analítico de vendas, com visual corporativo e layout inspirado em painéis executivos como o da imagem de referência, permitindo que o usuário faça upload de bases de dados e visualize automaticamente indicadores, filtros e gráficos.

### Objetivo do projeto
Desenvolver um dashboard interativo para análise de vendas, onde o usuário possa importar arquivos de dados (.xlsx, .csv e futuramente .json), e a aplicação processe essas informações para gerar KPIs, gráficos e rankings em uma interface moderna, organizada e responsiva.

### Stack obrigatória
- React
- Vite
- Tailwind CSS
- JavaScript
- Recharts para gráficos
- SheetJS (xlsx) para leitura de arquivos Excel
- Lucide React para ícones

### Requisitos gerais
A aplicação deve funcionar inicialmente sem backend, processando tudo no front-end.
Os dados carregados devem ser mantidos em memória local da aplicação.
A estrutura do projeto deve ser didática, limpa e organizada, pensando em manutenção futura e uso em aula.

### Funcionalidades principais
1. Área de upload de arquivo
   - Permitir upload de arquivos .xlsx e .csv
   - Exibir nome do arquivo carregado
   - Validar extensão do arquivo
   - Exibir mensagem amigável em caso de arquivo inválido
   - Ler a primeira planilha do Excel automaticamente
   - Converter os dados para JSON interno

2. Tratamento e padronização dos dados
   - Normalizar nomes de colunas
   - Ignorar diferenças simples de maiúsculas/minúsculas
   - Tentar mapear automaticamente colunas com nomes como:
     - ano
     - país
     - fabricante
     - categoria
     - produto
     - valor vendido
     - lucro
     - quantidade
   - Caso alguma coluna essencial não exista, exibir aviso claro ao usuário

3. Filtros globais
   Criar filtros no topo do dashboard para:
   - Ano
   - País
   - Fabricante
   - Categoria
   - Produto

   Os filtros devem:
   - funcionar em conjunto
   - atualizar todos os gráficos e cards
   - ter opção "Todos"
   - ser populados dinamicamente a partir da base carregada

4. Cards de indicadores
   Exibir cards com os seguintes KPIs:
   - Total vendido
   - Quantidade de vendas realizadas
   - Lucro total
   - Margem de lucro percentual

   Os cards devem ter:
   - destaque visual
   - formatação monetária em Real brasileiro
   - boa hierarquia tipográfica
   - aparência semelhante a dashboards corporativos

5. Gráficos obrigatórios
   Criar os seguintes gráficos:
   - Total vendido por país
   - Total vendido por fabricante
   - Total vendido por categoria
   - Total vendido por ano
   - Total vendido por produto
   - Gráfico de colunas por país ou categoria
   - Ranking em barras horizontais para produtos mais vendidos

   Preferência visual:
   - gráficos de rosca para distribuições
   - gráfico de área ou linha para série temporal
   - gráfico de colunas para comparações
   - gráfico de barras horizontais para ranking

6. Layout da interface
   O layout deve lembrar um dashboard executivo:
   - topo com título “Relatório de Vendas”
   - área de filtros logo abaixo do cabeçalho
   - coluna lateral com cards de indicadores
   - área central com gráficos principais
   - painel lateral ou superior com ranking por produto
   - interface limpa, com sombras suaves, bordas arredondadas e boa distribuição visual

7. Responsividade
   - Desktop: layout completo em múltiplas colunas
   - Tablet: reorganizar blocos sem quebrar a leitura
   - Mobile: empilhar cards, filtros e gráficos
   - Os gráficos devem se adaptar bem a telas menores

8. Experiência do usuário
   - Exibir estado inicial vazio antes do upload
   - Mostrar instrução como “Envie uma planilha para visualizar o dashboard”
   - Exibir loading curto durante o processamento do arquivo
   - Tratar erros de leitura de forma amigável
   - Exibir mensagem quando não houver dados após aplicar filtros

### Requisitos visuais
Criar uma identidade visual corporativa moderna inspirada em dashboards de BI:
- fundo cinza muito claro
- cards brancos
- destaques em azul
- tipografia limpa
- ícones discretos
- espaçamento consistente
- aparência elegante e profissional
- não exagerar nas cores
- priorizar legibilidade

### Estrutura esperada de pastas
Organize o projeto em uma estrutura parecida com esta:

src/
  components/
    Header.jsx
    UploadPanel.jsx
    FilterBar.jsx
    KPIAside.jsx
    KPIcard.jsx
    ChartCard.jsx
    EmptyState.jsx
  charts/
    SalesByCountryChart.jsx
    SalesByManufacturerChart.jsx
    SalesByCategoryChart.jsx
    SalesByYearChart.jsx
    TopProductsChart.jsx
    SalesColumnsChart.jsx
  utils/
    parseFile.js
    normalizeColumns.js
    formatters.js
    dataAggregations.js
    filterData.js
  data/
    mockData.js
  App.jsx
  main.jsx

### Regras de implementação
- Criar componentes reutilizáveis
- Separar lógica de tratamento de dados da interface
- Evitar código gigante dentro do App.jsx
- Comentar trechos importantes para fins didáticos
- Gerar código funcional e consistente
- Não usar dados fictícios fixos como solução final, mas incluir um mock opcional para testes
- Incluir um exemplo de estrutura esperada da planilha no projeto

### Exemplo de colunas esperadas
A aplicação deve funcionar melhor quando a base possuir colunas equivalentes a:
- Ano
- País
- Fabricante
- Categoria
- Produto
- Valor Vendido
- Lucro
- Quantidade

### Formatações
- Valores monetários em pt-BR, ex: R$ 473.680,00
- Percentuais com duas casas decimais
- Quantidades com separador de milhar

### Entregáveis esperados
Quero que você gere:
1. a estrutura completa do projeto
2. todos os componentes necessários
3. a lógica de upload e leitura do arquivo
4. as funções utilitárias de agregação e filtros
5. o layout do dashboard pronto para rodar
6. um exemplo de planilha simulada para testes
7. instruções finais de execução do projeto

### Resultado esperado
Quero uma aplicação que, após o upload da base de dados, monte automaticamente um dashboard de vendas com aparência profissional, filtros funcionais, cards de indicadores e gráficos semelhantes a um painel executivo de BI.