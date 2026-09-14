import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 Import da navegação do Expo Router
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // 👈 Hook para controlar a navegação

  const API_URL = `${API_BASE_URL}/usuario`;

const handleLogin = async () => {
  console.log('Iniciando tentativa de login...'); // Exibido no Console do Navegador (F12)

  if (!email.trim() || !senha.trim()) {
    const mensagem = 'Por favor, preencha o e-mail e a senha.';
    if (Platform.OS === 'web') {
      alert(mensagem);
    } else {
      Alert.alert('Atenção', mensagem);
    }
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim(),
        senha: senha.trim(),
      }),
    });

    const data = await response.json();
    console.log('Resposta do servidor:', data);

    if (response.ok) {
      const usuarioNome = data.usuario?.usuario_nome || 'Usuário';

      // Salva os dados do usuário no AsyncStorage para persistência da sessão
      await AsyncStorage.setItem('@usuario_logado', JSON.stringify(data.usuario));

      if (Platform.OS === 'web') {
        alert(`Olá, ${usuarioNome}! Login realizado com sucesso.`);
        router.replace('/home'); // Navegação direta para Web
      } else {
        Alert.alert(
          'Bem-vindo(a)!',
          `Olá, ${usuarioNome}! Login realizado com sucesso.`,
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/home'),
            },
          ]
        );
      }
    } else {
      const erroMsg = data.mensagem || 'E-mail ou senha incorretos.';
      if (Platform.OS === 'web') alert(erroMsg);
      else Alert.alert('Erro ao entrar', erroMsg);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    const conexaoMsg = 'Não foi possível conectar ao servidor. Verifique se o Node.js está rodando.';
    if (Platform.OS === 'web') alert(conexaoMsg);
    else Alert.alert('Erro de Conexão', conexaoMsg);
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* Logo / Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="recycle" size={60} color="#2E7D32" />
          </View>
          <Text style={styles.title}>ReviraApp</Text>
          <Text style={styles.subtitle}>Transforme o futuro reciclando hoje</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Entrar</Text>
            )}
          </TouchableOpacity>

          {/* Rodapé / Cadastre-se */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Ainda não tem uma conta? </Text>
            <TouchableOpacity>
              <Text style={styles.registerBoldText}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F4',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 14,
    color: '#4CAF50',
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2E7D32',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerBoldText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 14,
  },
});