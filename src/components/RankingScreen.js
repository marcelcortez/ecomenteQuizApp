// RankingScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemedButton } from "react-native-really-awesome-button";
import axios from 'axios';

const RankingScreen = ({route, navigation}) => {
  const { playerName, score } = route.params;
  const [rankingData, setRankingData] = useState([]);
  const [rankingUpdated, setRankingUpdated] = useState(false);

  // Atualiza o ranking automaticamente ao carregar a tela
  useEffect(() => {
    const saveAndFetchRanking = async () => {
      try {
        // Salva o jogador atual no ranking
        if(!rankingUpdated) {
          await axios.post('http://192.168.16.1:8000/api/ranking', {
            nome: playerName,
            pontuacao: score,
          });
        }
  
        // Obtém os dados mais recentes do ranking e ordena pela pontuação
        const response = await axios.get('http://192.168.16.1:8000/api/ranking');
        const sortedRanking = response.data.sort((a, b) => b.pontuacao - a.pontuacao);
  
        // Adiciona a propriedade 'colocacao' de acordo com a posição na lista
        const rankingComColocacao = sortedRanking.map((jogador, index) => ({
          ...jogador,
          colocacao: index + 1,
        }));
  
        setRankingData(rankingComColocacao);
        setRankingUpdated(true);
      } catch (error) {
        console.error('Erro ao salvar ou obter dados do ranking:', error);
      }
    };
  
    saveAndFetchRanking();
  }, [playerName, score]);

  // Função para renderizar cada item do ranking
  const renderItem = ({ item }) => (

    <View>
      <View style={styles.cardPlayer}>
        <Text style={styles.textCardPlayer}>
          {`${item.colocacao} - ${item.nome} - ${item.pontuacao} pts`} 
        </Text>
      </View>
    </View>
  );

  
  return (
    <View style={styles.container}>
      <View style={styles.titlePage}>
        <Text style={styles.textTitlePage}>RANKING</Text>
      </View>
      <FlatList
        data={rankingData.slice(0, 5)}
        keyExtractor={(item) => item.colocacao.toString()}
        renderItem={renderItem}
      />

      {/* Renderizar o jogador atual */}
      {rankingData.find((item) => item.nome === playerName) && (
        <View style={styles.cardCurrentPlayer}>
          <View style={styles.cardPlayer}>
            <Text style={styles.textCardPlayer}>
              {`${rankingData.find((item) => item.nome === playerName).colocacao} - ${playerName} - ${score} pts`}
            </Text>
        </View>
        </View>
      )}

      <ThemedButton name="bruce" type="secondary"
        style={styles.btnAnima} onPress={() => navigation.navigate('StartScreen')}
        >VOLTAR
      </ThemedButton>
    </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: '',
    alignItems: 'center',
    backgroundColor: '#1785eb',
    alignItems: 'center',
    marginTop: 0
  },
  titlePage: {
    backgroundColor: '#337a42',    
    marginVertical: 12,
    marginTop: 65,
    marginBottom: 40,
    borderRadius: 14,
    height: 50,
    width: 150,
    position: 'relative'
  },
  textTitlePage: {
    backgroundColor: 'white',
    color: '#699348',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 50,
    width: 150,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5    
  },
  cardPlayer: {
    backgroundColor: '#fed71a',    
    marginVertical: 12,
    borderRadius: 20,
    height: 40,
    width: 300,
    position: 'relative'    
  },
  textCardPlayer: {
    backgroundColor: '#FFF',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: 40,
    width: 300,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5
  },
  cardCurrentPlayer: {
    marginBottom: 50,
  },
  btnAnima:{
    marginBottom: 20
  }

});

export default RankingScreen;