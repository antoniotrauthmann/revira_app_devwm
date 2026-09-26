import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, Alert, Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  imageUrl?: string | null;
  time?: string;
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  
  const API_URL = `${API_BASE_URL}/mensagens`;

  useEffect(() => {
    carregarUsuarioLogado();
    fetchMessages();
  }, []);

  const carregarUsuarioLogado = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@usuario_logado');
      if (dadosSalvos) {
        const usuario = JSON.parse(dadosSalvos);
        setUserId(usuario.id_usuario);
      } else {
        // Fallback se não encontrar sessão
        setUserId(1);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário logado:', error);
      setUserId(1);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (response.ok) {
        const dadosSalvos = await AsyncStorage.getItem('@usuario_logado');
        const currentUserId = dadosSalvos ? JSON.parse(dadosSalvos).id_usuario : 3;

        const formattedMessages = data.map((msg: any) => ({
          id: msg.id_mensagem.toString(),
          text: msg.conteudo,
          isUser: Number(msg.id_remetente) === Number(currentUserId),
          imageUrl: msg.url_imagem ? msg.url_imagem : null,
          time: formatTime(msg.enviado_em), // 👈 Ajustado de 'enviada_em' para 'enviado_em'
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      enviarMensagemParaServidor('', base64Image);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    enviarMensagemParaServidor(inputText, null);
    setInputText('');
  };

  const enviarMensagemParaServidor = async (texto: string, imagemUrl: string | null) => {
    const remetenteId = userId || 3; // Usa o ID atual (3) ou 1 como segurança
    const destinatarioId = remetenteId; // Envia para si mesmo para evitar erro de destinatário inexistente

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conteudo: texto,
          id_remetente: remetenteId,     
          id_destinatario: destinatarioId,  
          url_imagem: imagemUrl,
        }),
      });

      if (response.ok) {
        fetchMessages(); // Atualiza o chat puxando direto do banco
      } else {
        const errorData = await response.json();
        console.error('Erro do servidor:', errorData);
        Alert.alert('Erro', 'O servidor recusou a mensagem.');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
      Alert.alert('Erro', 'Não foi possível salvar no banco de dados.');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.receiverBubble]}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
      )}
      {item.text ? (
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.receiverText]}>
          {item.text}
        </Text>
      ) : null}
      <Text style={[styles.timeText, item.isUser ? styles.userTime : styles.receiverTime]}>
        {item.time || ''}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.adHeader}>
        <View>
          <Text style={styles.adTitle}>Caixas de Papelão Usadas</Text>
          <Text style={styles.adPrice}>R$ 0,50 / kg</Text>
        </View>
        <TouchableOpacity style={styles.adButton}>
          <Text style={styles.adButtonText}>Ver Anúncio</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
        />

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <MaterialCommunityIcons name="paperclip" size={24} color="#558B2F" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <MaterialCommunityIcons name="send" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F9F4' },
  container: { flex: 1 },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#E0E8E1',
    elevation: 2,
  },
  adTitle: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  adPrice: { fontSize: 14, color: '#558B2F', marginTop: 2 },
  adButton: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  adButtonText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 12 },
  chatList: { padding: 16, flexGrow: 1, justifyContent: 'flex-end' },
  messageBubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 10,
    minWidth: 80,
  },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2E7D32', borderBottomRightRadius: 4 },
  receiverBubble: { alignSelf: 'flex-start', backgroundColor: '#E8F5E9', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#C8E6C9' },
  messageText: { fontSize: 15, marginBottom: 4 },
  userText: { color: '#FFF' },
  receiverText: { color: '#1B5E20' },
  timeText: { fontSize: 11, alignSelf: 'flex-end', marginTop: 2 },
  userTime: { color: '#A5D6A7' },
  receiverTime: { color: '#7CB342' },
  messageImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 6 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E0E8E1' },
  attachButton: { padding: 8 },
  input: { flex: 1, minHeight: 40, maxHeight: 100, backgroundColor: '#F9FBF9', borderWidth: 1, borderColor: '#E0E8E1', borderRadius: 20, paddingHorizontal: 16, paddingTop: 10, marginHorizontal: 8, fontSize: 15 },
  sendButton: { backgroundColor: '#2E7D32', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});