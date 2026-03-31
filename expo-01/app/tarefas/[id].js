import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';

export default function DetalheTarefa() {
  const { id, descricao: initialDescricao } = useLocalSearchParams();
  const navigation = useNavigation();

  const [descricao, setDescricao] = useState(initialDescricao || '');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(descricao);

  const headers = {
    "X-Parse-Application-Id": "RZJuJKW1OTLoNCRfd0v4jDBMYcA0JMMoNiGneXET",
    "X-Parse-JavaScript-Key": "xd3ochpDp7DNtPeHB0hDS5nXD3m53qBZJPgOIIj8",
    "Content-Type": "application/json"
  };

  useEffect(() => {
    navigation.setOptions({ title: descricao });
  }, [descricao, navigation]);

  const handleUpdate = async () => {
    if (!editValue.trim()) {
      Alert.alert('Erro', 'A descrição não pode ficar vazia.');
      return;
    }

    try {
      const response = await fetch(`https://parseapi.back4app.com/classes/Tarefa/${id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify({ descricao: editValue })
      });

      if (response.ok) {
        setDescricao(editValue);
        setIsEditing(false);
        Alert.alert('Sucesso', 'Tarefa atualizada!');
      } else {
        Alert.alert('Erro', 'Não foi possível atualizar a tarefa.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na conexão com o servidor.');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirmar Exclusão', 'Deseja realmente remover esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`https://parseapi.back4app.com/classes/Tarefa/${id}`, {
              method: 'DELETE',
              headers: headers
            });

            if (response.ok) {
              Alert.alert('Sucesso', 'Tarefa removida!');
              router.back();
            } else {
              Alert.alert('Erro', 'Não foi possível remover a tarefa.');
            }
          } catch (error) {
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID: {id}</Text>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={editValue}
            onChangeText={setEditValue}
            autoFocus
          />
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.btn, styles.btnSave]} onPress={handleUpdate}>
              <Text style={styles.btnText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnCancel]} onPress={() => setIsEditing(false)}>
              <Text style={styles.btnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.titulo}>{descricao}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={() => setIsEditing(true)}>
              <Text style={styles.btnText}>Editar Tarefa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={handleDelete}>
              <Text style={styles.btnText}>Remover Tarefa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  editContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 15,
  },
  btn: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  btnEdit: {
    backgroundColor: '#2196F3',
  },
  btnDelete: {
    backgroundColor: '#F44336',
  },
  btnSave: {
    backgroundColor: '#4CAF50',
  },
  btnCancel: {
    backgroundColor: '#9e9e9e',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});