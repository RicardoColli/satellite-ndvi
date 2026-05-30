# 🌱 Satellite NDVI

Sistema web para análise de vegetação utilizando imagens de satélite Sentinel-2 e cálculo de NDVI (Normalized Difference Vegetation Index).

O usuário pode selecionar uma área diretamente no mapa e visualizar uma análise da condição da vegetação baseada em imagens de satélite recentes.

---

## 🚀 Funcionalidades

✅ Seleção de áreas por polígono ou retângulo

✅ Visualização de mapa e satélite

✅ Sobreposição NDVI na área selecionada

✅ Cálculo da área em hectares

✅ Estatísticas NDVI:
- NDVI Médio
- NDVI Mínimo
- NDVI Máximo

✅ Data da imagem utilizada

✅ Legenda visual das classes NDVI

✅ Integração com Sentinel Hub

---

## 🛰️ Tecnologias Utilizadas

### Frontend

- Next.js
- React
- TypeScript
- React Leaflet
- React Leaflet Draw
- Turf.js
- Axios

### Backend

- Node.js
- Express
- TypeScript
- Axios

### Dados de Satélite

- Sentinel Hub API
- Sentinel-2 L2A

---

## 📸 Funcionalidades do Mapa

### Modo Satélite

Permite visualizar:

- Lavouras
- Estradas
- Casas
- Corpos d'água
- Áreas de vegetação

### Modo Mapa

Visualização tradicional com:

- Ruas
- Rodovias
- Municípios
- Limites geográficos

---

## 🌿 Escala NDVI

| Cor | Interpretação |
|------|------|
| 🟫 Marrom | Solo exposto |
| 🟥 Vermelho | Vegetação muito baixa |
| 🟧 Laranja | Vegetação baixa |
| 🟨 Amarelo | Vegetação média |
| 🟩 Verde Claro | Vegetação boa |
| 🟢 Verde Escuro | Vegetação excelente |

---

## 📂 Estrutura do Projeto

```text
satellite-ndvi/
│
├── backend/
│   ├── services/
│   ├── src/
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── components/
│
├── README.md
└── .gitignore
```

---

## ⚙️ Instalação

### Clonar repositório

```bash
git clone https://github.com/RicardoColli/satellite-ndvi.git
```

### Backend

```bash
cd backend

npm install

npm run dev
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## 🔐 Variáveis de Ambiente

Backend (.env)

```env
SENTINEL_CLIENT_ID=SEU_CLIENT_ID
SENTINEL_CLIENT_SECRET=SEU_CLIENT_SECRET
```

As credenciais podem ser obtidas através do Sentinel Hub.

---

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para auxiliar na análise agrícola através de imagens de satélite, permitindo:

- Monitoramento de lavouras
- Identificação de falhas de plantio
- Avaliação da sanidade vegetal
- Comparação de áreas produtivas
- Apoio à tomada de decisão no campo

---

## 🔮 Próximas Funcionalidades

- [ ] NDVI real calculado pela API Statistics
- [ ] Histórico temporal
- [ ] Comparação entre datas
- [ ] Exportação PDF
- [ ] Exportação GeoJSON
- [ ] Múltiplos índices (NDRE, EVI, SAVI)
- [ ] Login de usuários
- [ ] Cadastro de propriedades
- [ ] Dashboard gerencial
- [ ] Deploy em produção

---

## 👨‍💻 Autor

Ricardo Colli

Projeto desenvolvido para estudos e aplicação de sensoriamento remoto voltado ao agronegócio.
