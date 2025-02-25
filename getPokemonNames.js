const fs = require('fs');

// 📌 Tabela de caracteres do Game Boy (de GB bytes para string)
const gbCharMap = {
    0x80: 'A', 0x81: 'B', 0x82: 'C', 0x83: 'D', 0x84: 'E', 0x85: 'F', 0x86: 'G',
    0x87: 'H', 0x88: 'I', 0x89: 'J', 0x8A: 'K', 0x8B: 'L', 0x8C: 'M', 0x8D: 'N',
    0x8E: 'O', 0x8F: 'P', 0x90: 'Q', 0x91: 'R', 0x92: 'S', 0x93: 'T', 0x94: 'U',
    0x95: 'V', 0x96: 'W', 0x97: 'X', 0x98: 'Y', 0x99: 'Z',
    0xA0: 'a', 0xA1: 'b', 0xA2: 'c', 0xA3: 'd', 0xA4: 'e', 0xA5: 'f', 0xA6: 'g',
    0xA7: 'h', 0xA8: 'i', 0xA9: 'j', 0xAA: 'k', 0xAB: 'l', 0xAC: 'm', 0xAD: 'n',
    0xAE: 'o', 0xAF: 'p', 0xB0: 'q', 0xB1: 'r', 0xB2: 's', 0xB3: 't', 0xB4: 'u',
    0xB5: 'v', 0xB6: 'w', 0xB7: 'x', 0xB8: 'y', 0xB9: 'z',
    0xF6: '0', 0xF7: '1', 0xF8: '2', 0xF9: '3', 0xFA: '4', 0xFB: '5',
    0xFC: '6', 0xFD: '7', 0xFE: '8', 0xFF: '9',
    0x50: '' // Fim de string
};

// 📌 Função para carregar a ROM
function loadROM(filename) {
    try {
        const data = fs.readFileSync(filename);
        return new Uint8Array(data);
    } catch (error) {
        console.error('Erro ao carregar a ROM:', error);
        process.exit(1);
    }
}

// 📌 Função para extrair o nome do Pokémon, considerando que ele ocupa 10 bytes
function extractPokemonName(romData, offset) {
    let name = '';
    let byte = romData[offset];
    let count = 0;

    // Ler até completar os 10 bytes ou até encontrar o byte 0x50 (fim da string)
    while (count < 10 && byte !== 0x50) {
        // Se o byte corresponder a um caractere válido, adiciona ao nome
        if (gbCharMap[byte]) {
            name += gbCharMap[byte];
        }
        count++;
        byte = romData[offset + count];
    }
    return name; // Retornar o nome sem espaços extras
}

// 📌 Função para minerar nomes de Pokémon e seus respectivos offsets
function minePokemonNames(romData, startOffset, count) {
    let currentOffset = startOffset;
    const pokemonList = [];

    for (let i = 0; i < count; i++) {
        const pokemonName = extractPokemonName(romData, currentOffset);
        if (pokemonName) {
            pokemonList.push({ name: pokemonName, offset: currentOffset });
        }
        currentOffset += 10; // Cada nome ocupa 10 bytes
    }

    return pokemonList;
}

// 📌 Carregar a ROM
const romData = loadROM('pokemon_gold.gbc');

// 📌 Iniciar a mineração a partir do offset 0x1B0B74 (o primeiro Pokémon BULBASAUR)
const startOffset = 0x1B0B74 // Pode ser ajustado conforme a necessidade
const pokemonCount = 151; // Defina quantos Pokémon você quer buscar

// 📌 Minerar os nomes dos Pokémon
const pokemonList = minePokemonNames(romData, startOffset, pokemonCount);

// 📌 Exibir os nomes dos Pokémon e seus respectivos offsets
pokemonList.forEach((pokemon, index) => {
    console.log(`#${index + 1}: ${pokemon.name} encontrado no offset 0x${pokemon.offset.toString(16).toUpperCase()}`);
});
