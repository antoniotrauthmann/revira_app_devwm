import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Bem-vindo(a)! 👋</Text>
          <Text style={styles.subtitle}>O que deseja fazer hoje?</Text>
        </View>

        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <MaterialCommunityIcons name="store" size={40} color="#2E7D32" />
            <Text style={styles.cardTitle}>Anúncios</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <MaterialCommunityIcons name="truck-delivery" size={40} color="#2E7D32" />
            <Text style={styles.cardTitle}>Coletas</Text>
          </TouchableOpacity>

          {/* Novo botão de Mensagens conectando com a rota /chat */}
          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/chat')}>
            <MaterialCommunityIcons name="message-text" size={40} color="#2E7D32" />
            <Text style={styles.cardTitle}>Mensagens</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => router.push('/profile')}>
            <MaterialCommunityIcons name="account" size={40} color="#2E7D32" />
            <Text style={styles.cardTitle}>Meu Perfil</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F9F4' },
  scrollContainer: { padding: 24 },
  header: { marginBottom: 28, marginTop: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1B5E20' },
  subtitle: { fontSize: 15, color: '#666', marginTop: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  card: {
    backgroundColor: '#FFF',
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8F5E9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTitle: { marginTop: 10, fontSize: 16, fontWeight: '600', color: '#2E7D32' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
    gap: 8,
  },
  logoutText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 16 },
});