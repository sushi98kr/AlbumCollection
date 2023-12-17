import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [albums, setAlbums] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [editingAlbumId, setEditingAlbumId] = useState(null);
  const [updatedAlbumTitle, setUpdatedAlbumTitle] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      } else {
        console.error('Fetch failed:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // ... addAlbum, updateAlbum, deleteAlbum functions ... 
  const addAlbum = async () => {
    if (!newAlbumTitle) {
      return;
    }

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newAlbumTitle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAlbums([...albums, data]);
        setNewAlbumTitle('');
      } else {
        console.error('Add album failed:', response.statusText);
      }
    } catch (error) {
      console.error('Add album error:', error);
    }
  };

  const updateAlbum = async (id, updatedTitle) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedTitle,
        }),
      });

      if (response.ok) {
        const updatedAlbums = albums.map((album) =>
          album.id === id ? { ...album, title: updatedTitle } : album
        );
        setAlbums(updatedAlbums);
      } else {
        console.error('Update album failed:', response.statusText);
      }
    } catch (error) {
      console.error('Update album error:', error);
    }
  };

  const deleteAlbum = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/albums/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedAlbums = albums.filter((album) => album.id !== id);
        setAlbums(updatedAlbums);
      } else {
        console.error('Delete album failed:', response.statusText);
      }
    } catch (error) {
      console.error('Delete album error:', error);
    }
  };

  const handleUpdateSubmit = async (e, id) => {
    e.preventDefault();

    try {
      await updateAlbum(id, updatedAlbumTitle);
      setEditingAlbumId(null);
      setUpdatedAlbumTitle('');
    } catch (error) {
      console.error('Update album error:', error);
    }
  };

  const cancelUpdate = (id) => {
    setEditingAlbumId(null);
    setUpdatedAlbumTitle('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <div className="navbar-brand">Albums Collection</div>
          <ul className="navbar-menu">
          </ul>
        </nav>
      </header>
      <main>
        <div className="album-form">
          <input
            type="text"
            className="album-input"
            placeholder="Enter album title"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
          />
          <button className="add-album-button" onClick={addAlbum}>
            Add Album
          </button>
        </div>
        <ul className="album-list">
          {albums.map((album) => (
            <li key={album.id}>
              {editingAlbumId === album.id ? (
                <form onSubmit={(e) => handleUpdateSubmit(e, album.id)}>
                <input
                  type="text"
                  value={updatedAlbumTitle}
                  onChange={(e) => setUpdatedAlbumTitle(e.target.value)}
                />
                <button type="submit" className="save-update-album-button">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => cancelUpdate(album.id)}
                  className="cancel-update-button"
                >
                  Cancel
                </button>
              </form>
              ) : (
                <>
                  {album.title}
                  <div className="update-delete-buttons">
                    <button
                      className="update-album-button"
                      onClick={() => {
                        setEditingAlbumId(album.id);
                        setUpdatedAlbumTitle(album.title);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="delete-album-button"
                      onClick={() => {
                        const confirmDelete = window.confirm('Are you sure you want to delete this album?');
                        if (confirmDelete) {
                          deleteAlbum(album.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;