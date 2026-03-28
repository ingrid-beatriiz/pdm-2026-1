import axios from "axios";

const urlBase = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "RZJuJKW1OTLoNCRfd0v4jDBMYcA0JMMoNiGneXET",
  "X-Parse-JavaScript-Key": "xd3ochpDp7DNtPeHB0hDS5nXD3m53qBZJPgOIIj8",
};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

export async function getTarefas() {
  const response = await axios.get(urlBase, {
    headers: headers,
  });
  return response.data.results;
}

export async function adicionarTarefa(novaTarefa) {
  const response = await axios.post(urlBase, novaTarefa, {
    headers: headersJson,
  });
  return response.data;
}

export async function atualizarTarefa(id, concluida) {
  const response = await axios.put(`${urlBase}/${id}`, { concluida }, {
    headers: headersJson,
  });
  return response.data;
}

export async function removerTarefa(id) {
  const response = await axios.delete(`${urlBase}/${id}`, {
    headers: headers,
  });
  return response.data;
}