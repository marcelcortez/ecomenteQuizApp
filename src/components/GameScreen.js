// GameScreen.js
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

const GameScreen = ({ route, navigation }) => {
  const { playerName } = route.params;
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [incorrectOption, setIncorrectOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null);
  const [questions, setQuestions] = useState([]);

  //Obtem dados da API e Formata os dados para o formato da aplicação
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://192.168.16.1:8000/api/perguntas/listar');
        const data = response.data;
        const formattedQuestions = data.map((apiQuestion) => ({
          question: apiQuestion.pergunta,
          options: [
            apiQuestion.alternativa1,
            apiQuestion.alternativa2,
            apiQuestion.alternativa3,
            apiQuestion.alternativa4,
          ],
          correctAnswerIndex: (parseInt(apiQuestion.respostaCorreta) - 1),
          difficulty: apiQuestion.dificuldade
        }));

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Erro ao obter perguntas da API:', error);
      }
    };

    fetchQuestions();
  }, []);  

  const currentQuestion = questions[currentQuestionIndex];
  
  // TIMER
  useEffect(() => {
    // Reiniciar o timer quando a pergunta muda
    setTimer(30);
    // Iniciar o intervalo
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          // Se o tempo esgotar mostra a alternativa correta
          // Em seguida chama a próxima questão
          handleAnswer(null);
          handleNextQuestion();
          return 30;
        }
      });
    }, 1000);  
    // Limpar o intervalo ao desmontar o componente ou mudar de pergunta
    return () => clearInterval(interval);
  }, [currentQuestionIndex]);
  
  // Garante que a pontuação da última alternativa seja computada
  useEffect(() => {
    if (selectedOption !== null) {
      const delay = setTimeout(() => {
        handleNextQuestion();
        setSelectedOption(null);
      }, 1300);
      return () => {
        // Limpar o timeout ao desmontar o componente
        clearTimeout(delay);
      };
    }
  }, [selectedOption]);

  // Efeito para lidar com a transição para a próxima pergunta


  // Função principal
  //  Adiciona ou desconta pontuação e define os valores dos states
  const handleAnswer = (selectedAnswerIndex) => {
    const difficultyMultiplier = currentQuestion.difficulty || 1;
    const questionScore = 10 * difficultyMultiplier;
    
    // Verfica se a alternativa selecionada é a resposta correta
    if (selectedAnswerIndex === currentQuestion.correctAnswerIndex) {
      // Adiciona pontuação da pergunta
      setScore((prevScore) => prevScore + questionScore);
      // Registra a alternativa selecionada
      setSelectedOption(selectedAnswerIndex);
      // Informa a alternativa correta para aplicar o estilo correspondente
      setCorrectOption(currentQuestion.correctAnswerIndex);
    } else if(selectedAnswerIndex === null) {
      // Pontuação diminui por não ter respndido a tempo
      setScore((prevScore) => Math.max(0, prevScore - questionScore));
      setCorrectOption(currentQuestion.correctAnswerIndex);
    } else { 
      // Pontuação diminui ao escolher a alternativa errada
      setScore((prevScore) => Math.max(0, prevScore - questionScore)); 
      // Registra alternativa selecionada
      setSelectedOption(selectedAnswerIndex);
      // Define a alternativa marcada como incorreta
      setIncorrectOption(selectedAnswerIndex);
      // Iforma a alternativa correta
      setCorrectOption(currentQuestion.correctAnswerIndex);      
    }
  };

  const handleNextQuestion = () => {
    setTimeout(() => {
      setIncorrectOption(null);
      setCorrectOption(null);
  
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        navigation.navigate('RankingScreen', { playerName, score });
      }
    }, 1300);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.headerTextName}>{`${playerName}`}</Text>
        <Text style={styles.headerText}>{`${score} pts`}</Text>
        <View style={styles.timeCounter}>
          <Image style={styles.icon} source={require('../../assets/img/icons/relogio.png')} />
          <Text style={styles.timeCounterText}>{`${timer}s`}</Text>
        </View>
      </View>
      <View style={styles.questionView}>
        <Text style={styles.questionSty}>{`${currentQuestion ? currentQuestion.question : "Carregando..."}`}</Text>
      </View>
      {currentQuestion ? currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionBtn,
            selectedOption === index && styles.selectedOptionBtn,
            incorrectOption === index && styles.incorrectOptionBtn,
            correctOption === index && styles.selectedOptionBtn
          ]}
          onPress={() => handleAnswer(index)}
        >
          <Text
            style={[
              styles.optionBtnText,
              selectedOption === index && styles.selectedOptionText,
              incorrectOption === index && styles.incorrectOptionText,
              correctOption === index && styles.selectedOptionText
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      )) : <Text>Carregando...</Text>}
      <Image style={styles.brandLogo} source={require('../../assets/img/ecomente-brand-black.png')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: '',
    alignItems: 'center',
    backgroundColor: '#1785eb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 10,
    marginTop: 30, 
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'yellow'
  },
  headerTextName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  timeCounter: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'yellow',
    fontWeight: 'bold',
    fontSize: 20,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 15
  },
  timeCounterText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  questionView:{
    width: 300,
    minHeight: 160,
    borderRadius: 10,
    backgroundColor: '#2d9664',
    marginBottom: 80,
    marginTop: 80,
    marginVertical: 20,
    position: 'relative',
  },
  questionSty: {
    fontSize: 20,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
    minHeight: 160,
    paddingTop: 40,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  optionBtn: {
    backgroundColor: '#fed71a',    
    marginVertical: 12,
    borderRadius: 10,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    position: 'relative'
  },
  optionBtnText: {
    backgroundColor: 'white',
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 3
  },
  brandLogo: {
    width: 150,
    height: 50,
    position: 'absolute',
    top: 820
  },
  selectedOptionBtn: {
    backgroundColor: '#FFF',    
    marginVertical: 12,
    borderRadius: 10,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    position: 'relative'
  },
  
  selectedOptionText: {
    backgroundColor: '#34d142',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5
  },
  incorrectOptionBtn: {
    backgroundColor: '#FFF',    
    marginVertical: 12,
    borderRadius: 10,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    position: 'relative'
  },
  incorrectOptionText: {
    backgroundColor: '#ff3131',
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minHeight: 50,
    maxHeight: 90,
    width: 300,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 5,
    right: 5
  },
});

export default GameScreen;