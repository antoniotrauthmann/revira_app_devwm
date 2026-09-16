import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

interface Endereco {
  id_endereco: number;
  id_usuario: number;
  logradouro: string | null;
  cidade: string;
  estado: string;
  cep: string | null;
}

interface ToastState {
  visible: boolean;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'alerta';
}

export default function EnderecosScreen() {
  const router = useRouter();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [loading, setLoading] = useState(true);
  const [idUsuario, setIdUsuario] = useState<number | null>(null);

  // Estados do Formulário / Modal de Cadastro
  const [modalVisible, setModalVisible] = useState(false);
  const [logradouro, setLogradouro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Estado para exclusão (Modal Customizado)
  const [enderecoParaDeletar, setEnderecoParaDeletar] = useState<number | null>(null);

  // Estado do Toast de Notificação
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    mensagem: '',
    tipo: 'sucesso',
  });

  useEffect(() => {
    carregarEnderecos();
  }, []);

  // Exibe o Toast customizado por 3.5 segundos
  const exibirNotificacao = (mensagem: string, tipo: 'sucesso' | 'erro' | 'alerta' = 'sucesso') => {
    setToast({ visible: true, mensagem, tipo });
    setTimeout(() => {
      setToast({ visible: false, mensagem: '', tipo: 'sucesso' });
    }, 3500);
  };

  const carregarEnderecos = async () => {
    try {
      const dadosSalvos = await AsyncStorage.getItem('@usuario_logado');
      if (!dadosSalvos) {
        router.replace('/');
        return;
      }

      const user = JSON.parse(dadosSalvos);
      setIdUsuario(user.id_usuario);

      const response = await fetch(`${API_BASE_URL}/endereco/usuario/${user.id_usuario}`);
      if (response.ok) {
        const data = await response.json();
        setEnderecos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
      exibirNotificacao('Falha ao conectar com o servidor.', 'erro');
    } finally {
      setLoading(false);
    }
  };

  const handleCadastrar = async () => {
    if (!cidade.trim() || !estado.trim()) {
      exibirNotificacao('Por favor, preencha a Cidade e o Estado (UF).', 'alerta');
      return;
    }

    if (!idUsuario) return;

    setSalvando(true);

    try {
      const response = await fetch(`${API_BASE_URL}/endereco`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: idUsuario,
          logradouro: logradouro.trim(),
          cidade: cidade.trim(),
          estado: estado.trim().toUpperCase(),
          cep: cep.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Limpa formulário e fecha modal de cadastro
        setLogradouro('');
        setCidade('');
        setEstado('');
        setCep('');
        setModalVisible(false);

        // Exibe o Toast nativo customizado do app
        exibirNotificacao('Endereço cadastrado com sucesso', 'sucesso');

        // Recarrega lista
        carregarEnderecos();
      } else {
        exibirNotificacao(data.mensagem || 'Erro ao cadastrar endereço.', 'erro');
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
      exibirNotificacao('Não foi possível conectar ao servidor.', 'erro');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExclusao = async () => {
    if (!enderecoParaDeletar) return;

    try {
      const response = await fetch(`${API_BASE_URL}/endereco/${enderecoParaDeletar}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEnderecos((prev) => prev.filter((e) => e.id_endereco !== enderecoParaDeletar));
        exibirNotificacao('Endereço removido com sucesso.', 'sucesso');
      } else {
        exibirNotificacao('Erro ao excluir o endereço.', 'erro');
      }
    } catch (error) {
      console.error('Erro ao deletar:', error);
      exibirNotificacao('Erro de conexão ao remover.', 'erro');
    } finally {
      setEnderecoParaDeletar(null);
    }
  };

  const renderEnderecoItem = ({ item }: { item: Endereco }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressHeader}>
        <View style={styles.addressIconCircle}>
          <MaterialCommunityIcons name="map-marker-radius" size={24} color="#2E7D32" />
        </View>
        <View style={styles.addressInfo}>
          <Text style={styles.logradouroText}>
            {item.logradouro || 'Endereço sem logradouro'}
          </Text>
          <Text style={styles.cidadeEstadoText}>
            {item.cidade} - {item.estado}
          </Text>
          {item.cep && <Text style={styles.cepText}>CEP: {item.cep}</Text>}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setEnderecoParaDeletar(item.id_endereco)}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Toast Customizado Nativo do App */}
      {toast.visible && (
        <View
          style={[
            styles.toastContainer,
            toast.tipo === 'sucesso' && styles.toastSucesso,
            toast.tipo === 'erro' && styles.toastErro,
            toast.tipo === 'alerta' && styles.toastAlerta,
          ]}
        >
          <MaterialCommunityIcons
            name={
              toast.tipo === 'sucesso'
                ? 'check-circle-outline'
                : toast.tipo === 'erro'
                ? 'alert-circle-outline'
                : 'alert-outline'
            }
            size={22}
            color="#FFF"
          />
          <Text style={styles.toastText}>{toast.mensagem}</Text>
          <TouchableOpacity onPress={() => setToast({ ...toast, visible: false })}>
            <MaterialCommunityIcons name="close" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* TopBar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Meus Endereços</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButtonHeader}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Conteúdo Principal */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Carregando endereços...</Text>
        </View>
      ) : (
        <FlatList
          data={enderecos}
          keyExtractor={(item) => item.id_endereco.toString()}
          renderItem={renderEnderecoItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <MaterialCommunityIcons name="map-marker-off" size={48} color="#A5D6A7" />
              </View>
              <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
              <Text style={styles.emptySubtitle}>
                Cadastre seus endereços de coleta para facilitar seus pedidos.
              </Text>
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={() => setModalVisible(true)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
                <Text style={styles.addFirstButtonText}>Adicionar Endereço</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Modal de Cadastro de Endereço */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={styles.modalIconCircle}>
                  <MaterialCommunityIcons name="map-marker-plus" size={22} color="#2E7D32" />
                </View>
                <Text style={styles.modalTitle}>Novo Endereço</Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Text style={styles.label}>Logradouro (Rua, Número, Bairro)</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="home-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  value={logradouro}
                  onChangeText={setLogradouro}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputFlex, { flex: 2 }]}>
                  <Text style={styles.label}>Cidade *</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons name="city" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: São Paulo"
                      value={cidade}
                      onChangeText={setCidade}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                <View style={[styles.inputFlex, { flex: 1, marginLeft: 10 }]}>
                  <Text style={styles.label}>Estado *</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="UF"
                      value={estado}
                      onChangeText={setEstado}
                      maxLength={2}
                      autoCapitalize="characters"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.label}>CEP</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="mailbox-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 80000-000"
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>

              {/* Botões do Modal */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelModalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelModalText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveModalButton}
                  onPress={handleCadastrar}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.saveModalText}>Salvar Endereço</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        visible={!!enderecoParaDeletar}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setEnderecoParaDeletar(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <View style={styles.deleteIconCircle}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#D32F2F" />
            </View>
            <Text style={styles.confirmTitle}>Remover Endereço?</Text>
            <Text style={styles.confirmSubtitle}>
              Esta ação não pode ser desfeita. O endereço será excluído da sua conta.
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.cancelConfirmButton}
                onPress={() => setEnderecoParaDeletar(null)}
              >
                <Text style={styles.cancelConfirmText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteConfirmButton}
                onPress={confirmarExclusao}
              >
                <Text style={styles.deleteConfirmText}>Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F4' },
  
  // Toast Notificação Customizada
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 45 : 20,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  toastSucesso: { backgroundColor: '#2E7D32' },
  toastErro: { backgroundColor: '#D32F2F' },
  toastAlerta: { backgroundColor: '#E65100' },
  toastText: { flex: 1, color: '#FFF', fontWeight: '600', fontSize: 14 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 12,
    paddingBottom: 12,
    backgroundColor: '#F4F9F4',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 15, color: '#666' },

  listContent: { padding: 20 },

  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  addressHeader: { flexDirection: 'row', alignItems: 'center' },
  addressIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addressInfo: { flex: 1 },
  logradouroText: { fontSize: 15, fontWeight: 'bold', color: '#1B5E20' },
  cidadeEstadoText: { fontSize: 13, color: '#558B2F', marginTop: 2 },
  cepText: { fontSize: 12, color: '#90A4AE', marginTop: 2 },
  deleteButton: { padding: 8 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60, paddingHorizontal: 30 },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#78909C', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  addFirstButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addFirstButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  // Modal Cadastro
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1B5E20' },
  form: { gap: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#37474F', marginBottom: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FBF9',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#263238' },
  rowInputs: { flexDirection: 'row' },
  inputFlex: { flex: 1 },

  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  cancelModalText: { color: '#607D8B', fontWeight: 'bold', fontSize: 15 },
  saveModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveModalText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  // Modal Confirmação de Exclusão
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  confirmCard: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  deleteIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmTitle: { fontSize: 18, fontWeight: 'bold', color: '#263238', marginBottom: 8 },
  confirmSubtitle: { fontSize: 14, color: '#78909C', textAlign: 'center', marginBottom: 20, lineHeight: 20 },
  confirmButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  cancelConfirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CFD8DC',
  },
  cancelConfirmText: { color: '#607D8B', fontWeight: 'bold', fontSize: 14 },
  deleteConfirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteConfirmText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});
