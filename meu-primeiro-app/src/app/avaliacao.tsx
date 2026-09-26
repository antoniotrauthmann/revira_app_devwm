import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { API_BASE_URL } from '../config/api';

export default function AvaliacaoScreen() {
  const router = useRouter();
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  // Nome fictício do vendedor/comprador para a interface
  const nomeUsuarioAvaliado = "João (Catador)"; 

  const handleAvaliar = async () => {
    if (nota === 0) {
      Alert.alert('Atenção', 'Por favor, selecione uma nota de 1 a 5 estrelas.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_transacao: 1, // Atenção: este ID deve existir na tabela 'transacao' do banco
          id_avaliador: 1, // Substituir pelo ID do usuário logado
          id_avaliado: 2,  // Substituir pelo ID do usuário que está sendo avaliado
          nota: nota,
          comentario: comentario,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Avaliação enviada com sucesso!', [
          { text: 'OK', onPress: () => router.back() } 
        ]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Falha ao enviar avaliação');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível enviar a avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Renderiza as 5 estrelas interativas
  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setNota(star)}>
            <MaterialCommunityIcons
              name={star <= nota ? "star" : "star-outline"}
              size={48}
              color={star <= nota ? "#FFD700" : "#C8E6C9"} // Dourado se preenchido, verde claro se vazio
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B5E20" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="account-star" size={50} color="#2E7D32" />
            </View>
            <Text style={styles.title}>Avaliar Transação</Text>
            <Text style={styles.subtitle}>Como foi sua experiência com {nomeUsuarioAvaliado}?</Text>
          </View>

          {renderStars()}
          <Text style={styles.ratingText}>
            {nota > 0 ? `${nota} estrela${nota > 1 ? 's' : ''}` : 'Toque para avaliar'}
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Deixe um comentário (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ótimo atendimento, material de qualidade..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={comentario}
              onChangeText={setComentario}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity 
            style={[styles.button, nota === 0 && styles.buttonDisabled]} 
            onPress={handleAvaliar}
            disabled={loading || nota === 0}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Enviar Avaliação</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9F4',
  },
  container: {
    flex: 1,
  },
  backButton: {
    padding: 20,
    marginTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 16,
    color: '#558B2F',
    marginTop: 8,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
    color: '#333',
  },
  button: {
    backgroundColor: '#2E7D32',
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
    elevation: 0,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});