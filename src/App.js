import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import { API, graphqlOperation } from "aws-amplify";
import { createTodo } from "./graphql/mutations";
import { listTodos } from "./graphql/queries";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react-v1";

const styles = {
  container: {
    width: 400,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 20,
  },
  todo: { marginBottom: 15 },
  input: {
    border: "none",
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  todoDescription: { marginBottom: 0 },
  button: {
    backgroundColor: "black",
    color: "white",
    outline: "none",
    fontSize: 18,
    padding: "12px 0px",
  },
};

const initialState = { name: "", description: "" };

function App() {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const setInput = (key, value) => {
    setFormState({ ...formState, [key]: value });
  };

  const fetchTodos = async () => {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error creating todo: ", err);
    }
  };

  const addTodo = async () => {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await API.graphql(graphqlOperation(createTodo, { input: todo }));
    } catch (err) {
      console.log("error creating todo: ", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Amplify Todos</h2>
      <input
        onChange={(e) => setInput("name", e.target.value)}
        style={styles.input}
        value={formState.name}
        placeholder="Name"
      />
      <input
        onChange={(e) => setInput("description", e.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="Description"
      />
      <button style={styles.button} onClick={addTodo}>
        Create Todo
      </button>
      {todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))}
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
