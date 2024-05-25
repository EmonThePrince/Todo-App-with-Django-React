// App.jsx
import { useState,useEffect } from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import Register from './components/Register';
function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [reload, setReload] = useState(0);
  const [userID, setUserID] = useState(undefined);

  useEffect(() => {
    const loginAndFetchTodos = async () => {
      try {
        await handleLogout()

        // Login and obtain session cookie
        await login(user, password);
        const getId = await fetch('http://localhost:8000/getUser',{
          credentials: 'include',
        })
        setUserID(await getId.json())
        
        // Fetch todos with session cookie
        const response = await fetch('http://localhost:8000', {
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    loginAndFetchTodos();
  }, [reload]);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include cookies in the request
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:8000/logout',{
          credentials: 'include'
        });
        if (response.ok) {
            setTodos([]);
        } else {
            // Handle error
        }
    } catch (error) {
        // Handle network error
    }
  };

  
  // console.log(userID);
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
  }
  // Function to add a new todo
  const addTodo = async (text) => {
    const newTodo = { text, completed: false };
    const csrfToken = getCookie('csrftoken');

    try {
        const response = await fetch('http://localhost:8000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,  // Correctly include the CSRF token
            },
            body: JSON.stringify({ text, user: userID.id, completed: false }),
            credentials: 'include',
        });

        // if (!response.ok) {
        //     throw new Error('Posting failed');
        // }

        const data = await response.json();
        setTodos([...todos, newTodo]);
    } catch (error) {
        console.error(error);
    }
};

// console.log(todos)
  // Function to toggle the completion status of a todo
  const toggleTodo = async(index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    const csrfToken = getCookie('csrftoken');
    try {
      const response = await fetch(`http://localhost:8000`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify(updatedTodos[index]),
          credentials: 'include',
      });

      if (!response.ok) {
          throw new Error('Updating failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setTodos(updatedTodos);
  };

  // Function to update a todo
  const updateTodo = async(index) => {
    const updatedTodo = todos.filter((todo, i) => i == index);
    const csrfToken = getCookie('csrftoken');
    const newText = prompt('Enter new text for the todo:', todos[index].text);
    updatedTodo[0].text = newText
    try {
      const response = await fetch(`http://localhost:8000`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
          },
          body: JSON.stringify(updatedTodo[0]),
          credentials: 'include',
      });

      if (!response.ok) {
          throw new Error('Updating failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    if (newText !== null && newText.trim() !== '') {
      const updatedTodos = [...todos];
      updatedTodos[index].text = newText;
      setTodos(updatedTodos);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (index) => {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    const deletedTodo = todos.filter((todo, i) => i == index);
    const deleteId = deletedTodo[0].id;
    const csrfToken = getCookie('csrftoken');
    try {
      const response = await fetch(`http://localhost:8000/delete/${deleteId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
      });

      if (!response.ok) {
          throw new Error('Deleting failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setTodos(updatedTodos);
  };


  return (
    <div className="container mx-auto mt-8">
      <Register
        user = {user}
        password={password}
        setPassword={setPassword}
        setUser={setUser}
        setReloaded={setReload}
        handleLogout={handleLogout}
      />
     <form 
        onSubmit={(e) => {
          e.preventDefault()
          setReload(prev => prev+1);
        }
      } className="mb-4">
      <input
        type="text"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        placeholder="username"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="border border-gray-300 rounded-lg px-4 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
      >
        login
      </button>
    </form>
      <h1 className="text-3xl font-bold text-center mb-4">Todo App</h1>
      <AddTodo addTodo={addTodo} />
      <TodoList
        todos={todos}
        toggleTodo={toggleTodo}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
      />
      <button
        onClick={handleLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
      >Logout</button>
    </div>
  );
}

export default App;
