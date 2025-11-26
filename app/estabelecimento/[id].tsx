import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// --- 1. ADICIONAR IMPORT DO AXIOS ---
import axios from 'axios';

import AdicionarListaModal from '../../components/AdicionarListaModal';
import AvaliacaoModal from '../../components/AvaliacaoModal';
import Colors from '../../constants/Colors';
import { useAuth } from '../../src/context/AuthContext';
import api from '../../src/services/api';

const { width } = Dimensions.get('window'); 

interface Estabelecimento {
  id: string; 
  nome: string;
  images: string[];
  posicao?: string;
  media_notas?: number | string; 
  rating?: number | string;      
  endereco: string;
  telefone?: string;
  horario?: string;
}

interface Review {
  id: string | number;
  usuario_id: string; 
  usuario_nome: string;
  nota: number;
  comentario: string;
  data: string;
}

export default function EstabelecimentoDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { user } = useAuth(); 
  
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const [visitados, setVisitados] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListModalVisible, setListModalVisible] = useState(false);

  const carregarDados = async () => {
    try {
      const [estabRes, reviewsRes, favIdsRes, visitIdsRes] = await Promise.all([
        api.get(`/estabelecimentos/${id}`),
        api.get(`/reviews/${id}`),
        api.get('/favoritos/me/ids'),
        api.get('/visitados/me/ids')
      ]);

      setEstabelecimento(estabRes.data);
      setReviews(reviewsRes.data.data);
      setFavoritos(new Set(favIdsRes.data));
      setVisitados(new Set(visitIdsRes.data));

    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) carregarDados();
  }, [id]); 

  const handleDeleteReview = async (reviewId: string | number) => {
    Alert.alert("Excluir Avaliação", "Deseja remover sua avaliação?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: async () => {
            try {
                setIsLoading(true);
                await api.delete(`/reviews/${reviewId}`);
                await carregarDados(); 
                Alert.alert("Sucesso", "Avaliação removida.");
            } catch (error) {
                Alert.alert("Erro", "Não foi possível excluir.");
                setIsLoading(false);
            }
        }}
    ]);
  };

  const handleAvaliarSubmit = async (nota: number, comentario: string) => {
    if (!estabelecimento) return;
    setIsSubmitting(true);
    try {
      await api.post('/reviews', {
        estabelecimentoId: estabelecimento.id, 
        nota: nota,
        comentario: comentario,
      });
      Alert.alert('Sucesso!', 'Sua avaliação foi enviada.');
      setModalVisible(false);
      await carregarDados(); 
    } catch (error) {
      // --- 2. CORREÇÃO AQUI (Tratamento de erro Tipado) ---
      let msg = 'Não foi possível enviar sua avaliação.';
      
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 409) {
            msg = error.response.data.message; // Mensagem de duplicidade
        }
      }
      
      Alert.alert('Atenção', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToList = () => { setListModalVisible(true); };

  const handleToggleFavorito = async () => {
     if (!estabelecimento) return;
     const estabId = estabelecimento.id;
     const novosFavoritos = new Set(favoritos);
     if (novosFavoritos.has(estabId)) { novosFavoritos.delete(estabId); } else { novosFavoritos.add(estabId); }
     setFavoritos(novosFavoritos);
     try { await api.post(`/favoritos/${estabId}`); } catch (error) { setFavoritos(new Set(favoritos)); }
  };

  const handleToggleVisitado = async () => {
     if (!estabelecimento) return;
     const estabId = estabelecimento.id;
     const novosVisitados = new Set(visitados);
     if (novosVisitados.has(estabId)) { novosVisitados.delete(estabId); } else { novosVisitados.add(estabId); }
     setVisitados(novosVisitados);
     try { await api.post(`/visitados/${estabId}`); } catch (error) { setVisitados(new Set(visitados)); }
  };

  if (isLoading || !estabelecimento) {
    return ( <View style={styles.loadingContainer}><Stack.Screen options={{ title: 'Carregando...' }} /><ActivityIndicator size="large" color={Colors.primary} /></View> );
  }

  const minhaReview = reviews.find(r => user && String(r.usuario_id) === String(user.id));

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: estabelecimento.nome, headerStyle: { backgroundColor: Colors.background }, headerTitleStyle: { color: Colors.text }, headerTintColor: Colors.text, headerBackTitle: ' ', }} />
      
      <View style={styles.carouselContainer}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          {estabelecimento.images && estabelecimento.images.length > 0 ? (
            estabelecimento.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} style={styles.image} />
            ))
          ) : (
             <Image source={{ uri: 'https://placeholder.com/400x300.png?text=Sem+Imagem' }} style={styles.image} />
          )}
        </ScrollView>
        <View style={styles.dotIndicator} />
        <TouchableOpacity style={styles.overlayButtonRight}>
          <Ionicons name="bookmark-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
            <View style={{flex: 1, marginRight: 10}}> 
                <Text style={styles.title}>{estabelecimento.nome}</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={handleToggleVisitado} style={{marginRight: 15}}>
                     <Ionicons name={visitados.has(estabelecimento.id) ? "checkmark-circle" : "checkmark-circle-outline"} size={32} color={visitados.has(estabelecimento.id) ? Colors.primary : Colors.grey} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleToggleFavorito}>
                     <Ionicons name={favoritos.has(estabelecimento.id) ? "heart" : "heart-outline"} size={32} color={favoritos.has(estabelecimento.id) ? Colors.primary : Colors.grey} />
                </TouchableOpacity>
            </View>
        </View>
        
        <View style={styles.ratingRow}>
           <Text style={styles.rating}>
             {(parseFloat(String(estabelecimento.media_notas || 0))).toFixed(1)}
              <Ionicons name="star" size={16} color={Colors.primary} />
           </Text>
        </View>

        <View style={styles.actionsContainer}>
          {minhaReview ? (
            <View style={styles.myReviewContainer}>
                <Text style={styles.myReviewText}>Sua nota: {minhaReview.nota}</Text>
                <TouchableOpacity onPress={() => handleDeleteReview(minhaReview.id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
                style={styles.actionButtonAvaliar}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.actionButtonText}>Avaliar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButtonAdd} onPress={handleAddToList}>
            <Text style={styles.actionButtonText}>Adicionar à Lista</Text>
            <Ionicons name="add-circle-outline" size={24} color={Colors.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Endereço:</Text>
          <Text style={styles.infoText}>{estabelecimento.endereco || 'Não informado'}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Telefone:</Text>
          <Text style={styles.infoText}>{estabelecimento.telefone || 'Não informado'}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Horário de funcionamento:</Text>
          <Text style={styles.infoText}>{estabelecimento.horario || 'Não informado'}</Text>
        </View>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Avaliações Recentes</Text>
          
          {reviews.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma avaliação ainda. Seja o primeiro!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>
                    {user && String(review.usuario_id) === String(user.id) ? "Você" : review.usuario_nome}
                  </Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewRatingText}>{review.nota}</Text>
                    <FontAwesome name="star" size={12} color={Colors.primary} />
                  </View>
                </View>
                {review.comentario ? (<Text style={styles.reviewComment}>{review.comentario}</Text>) : (<Text style={styles.reviewCommentEmpty}>(Sem comentário)</Text>)}
                <Text style={styles.reviewDate}>{new Date(review.data).toLocaleDateString('pt-BR')}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <AvaliacaoModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAvaliarSubmit}
        isLoading={isSubmitting}
      />
      <AdicionarListaModal
        visible={isListModalVisible}
        onClose={() => setListModalVisible(false)}
        estabelecimentoId={estabelecimento.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  carouselContainer: { width: width, height: 300, backgroundColor: Colors.background },
  image: { width: width, height: 300, resizeMode: 'cover' },
  dotIndicator: { position: 'absolute', bottom: 10, alignSelf: 'center', width: 30, height: 8, borderRadius: 4, backgroundColor: Colors.background },
  overlayButtonRight: { position: 'absolute', top: 10, right: 20, backgroundColor: 'rgba(0,0,0,0.4)', padding: 8, borderRadius: 10 },
  infoContainer: { padding: 20, borderTopLeftRadius: -20, borderTopRightRadius: -20, marginTop: -20, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  title: { fontSize: 26, fontWeight: 'bold', color: Colors.text },
  ratingRow: { marginBottom: 20 },
  rating: { fontSize: 32, fontWeight: 'bold', color: Colors.text },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.lightGrey },
  actionButtonAvaliar: { backgroundColor: Colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  myReviewContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFEFEF', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, borderWidth: 1, borderColor: Colors.lightGrey },
  myReviewText: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginRight: 10 },
  actionButtonAdd: { backgroundColor: Colors.text, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  actionButtonText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },
  infoSection: { marginBottom: 15 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  infoText: { fontSize: 14, color: '#555', lineHeight: 20 },
  reviewsSection: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: Colors.lightGrey },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 15 },
  reviewCard: { backgroundColor: Colors.white, padding: 15, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: Colors.lightGrey },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  reviewUser: { fontWeight: 'bold', fontSize: 16, color: Colors.text },
  reviewRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${Colors.primary}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  reviewRatingText: { fontSize: 12, fontWeight: 'bold', color: Colors.text, marginRight: 4 },
  reviewComment: { fontSize: 14, color: '#555', marginBottom: 5 },
  reviewCommentEmpty: { fontSize: 14, color: Colors.grey, fontStyle: 'italic', marginBottom: 5 },
  reviewDate: { fontSize: 12, color: Colors.grey, textAlign: 'right' },
  emptyText: { fontSize: 14, color: Colors.grey, textAlign: 'center', fontStyle: 'italic' },
});