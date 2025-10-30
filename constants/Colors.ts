// constants/Colors.ts (VERSÃO COM AS NOVAS CORES)

// Cores exatas do seu design
const primaryOrange = '#FBAF26';      // Amarelo mais escurin
const categoryYellow = '#FFCF60';     // Amarelo mais claro (fundo do botão)
const darkBrown = '#6B3E1E';          // Marrom (texto e ícones)
const searchGrey = '#D9D9D9';         // Cinza da barra de busca
const lightCream = '#FDF8E1';         // Fundo do app (do protótipo)

export default {
  // Cores principais
  primary: primaryOrange,
  background: lightCream,
  text: darkBrown,

  // Cores Específicas
  categoryBackground: categoryYellow, // Fundo do botão da categoria
  searchBar: searchGrey,              // Fundo da barra de busca
  
  // Cores de UI (baseadas nas principais)
  tint: primaryOrange,
  tabIconDefault: '#ccc',
  tabIconSelected: primaryOrange,
  
  // Neutras
  white: '#fff',
  black: '#000',
  grey: '#ccc', // Cinza mais escuro para bordas/texto
  lightGrey: '#f0f0f0', // Cinza bem claro
};