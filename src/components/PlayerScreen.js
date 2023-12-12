// PlayerScreen.js
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, TextInput, Text } from 'react-native';
import { ThemedButton } from "react-native-really-awesome-button";

const PlayerScreen = ({ navigation }) => {
  const [playerName, setPlayerName] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const startGame = () => {
    // Verifica se o nome do jogador foi inserido antes de navegar para a próxima tela
    if (playerName.trim() !== '') {
      navigation.navigate('GameScreen', { playerName });
    } else {
      // Lógica para lidar com o caso em que o nome não foi inserido
      alert('Por favor, insira um nome antes de começar o jogo.');
    }
  };

  const handleInputChange = (text) => {
    // Atualiza o estado do nome do jogador e habilita/desabilita o botão com base no comprimento do texto
    setPlayerName(text);
    setIsButtonDisabled(text.trim() === '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View>
        <Image style={styles.icon}
         source={require('../../assets/img/ecomente-icone-vazado-white.png')} />
      </View>
      <Text style={styles.nome}>Jogador</Text>
      <TextInput
        placeholder="Nome ou Apelido"
        style={styles.inputName}
        value={playerName}
        onChangeText={(text) => setPlayerName(text)}
      />
      <Image style={styles.folha}
         source={require('../../assets/img/icons/ecomente-folha-icon.png')} />
      <ThemedButton name="bruce" type="secondary"
        style={styles.btnAnima} onPress={startGame}
        >Vamos lá!</ThemedButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#1785eb',
    },
    inputName:{
      backgroundColor: '#1785eb',
      padding: 12,
      position: 'relative',
      top: 270,
      left: 50,
      width: 300,
      borderRadius: 28,
      fontSize: 22,
      borderColor: 'white',
      borderStyle: 'solid',
      borderWidth: 5,
      color: '#FFF',
      textAlign: 'center'
    },
    btnAnima:{
      position: 'relative',
      top: 400,
      left: 100
    },
    nome:{
      fontSize: 40,
      fontWeight: 'bold',
      position: 'relative',
      top: 260,
      left: 120,
    },
    icon:{
      width: 125,
      height: 125,
      position: 'relative',
      top: 100,
      left: 135

    },
    folha:{
      width: 45,
      height: 45,
      position: 'absolute',
      left: 335,
      top: 488
    }
});

export default PlayerScreen;