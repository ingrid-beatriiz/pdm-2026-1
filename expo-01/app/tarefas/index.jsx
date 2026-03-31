import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Switch,
  TouchableOpacity,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "expo-router";

import { adicionarTarefa, getTarefas, atualizarTarefa, removerTarefa } from "../../back4app";

export default function TarefasPage() {
  const queryClient = useQueryClient();
  const { data, isFetching } = useQuery({
    queryKey: ["tarefas"],
    queryFn: getTarefas,
  });

  const mutationAdd = useMutation({
    mutationFn: adicionarTarefa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: ({ id, concluida }) => atualizarTarefa(id, concluida),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const mutationDelete = useMutation({
    mutationFn: (id) => removerTarefa(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tarefas"] });
    },
  });

  const [descricao, setDescricao] = useState("");

  async function handleAdicionarTarefaPress() {
    if (descricao.trim() === "") {
      Alert.alert("Descrição inválida", "Preencha a descrição da tarefa", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    mutationAdd.mutate({ descricao, concluida: false });
    setDescricao("");
  }

  const carregando = isFetching || mutationAdd.isPending || mutationUpdate.isPending || mutationDelete.isPending;

  return (
    <View style={styles.container}>
      {carregando && <ActivityIndicator size="large" color="#0000ff" />}
      
      <TextInput
        style={styles.input}
        placeholder="Descrição da nova tarefa"
        value={descricao}
        onChangeText={setDescricao}
      />
      
      <Button
        title="Adicionar Tarefa"
        onPress={handleAdicionarTarefaPress}
        disabled={mutationAdd.isPending}
      />
      
      <View style={styles.hr} />
      
      <View style={styles.tasksContainer}>
        {data?.map((t) => (
          <View key={t.objectId} style={styles.taskRow}>
            <Switch
              value={t.concluida}
              onValueChange={(novoValor) => 
                mutationUpdate.mutate({ id: t.objectId, concluida: novoValor })
              }
            />
            
            <Link 
              href={{
                pathname: "/tarefas/[id]",
                params: { id: t.objectId, descricao: t.descricao }
              }} 
              asChild
            >
              <TouchableOpacity style={styles.linkContainer}>
                <Text style={[styles.taskText, t.concluida && styles.strikethroughText]}>
                  {t.descricao}
                </Text>
              </TouchableOpacity>
            </Link>

            <Button 
              title="Excluir" 
              color="red" 
              onPress={() => mutationDelete.mutate(t.objectId)} 
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: '#fff'
  },
  tasksContainer: {
    width: "100%",
    paddingTop: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    padding: 10,
    fontSize: 16,
  },
  hr: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 15,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  linkContainer: {
    flex: 1,
  },
  taskText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  strikethroughText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});