import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import {CurrentUserContext} from '../contexts/CurrentUserContext'
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import PopupWithConfirmation from './PopupWithConfirmation';
import Loader from '../UI/Loader';

function App() {
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isRemoveCardPopupOpen, setRemoveCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedCardForRemove, setSelectedCardForRemove] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');
  

  useEffect(() => {
    setLoadingPage(true)
    api.getInitialCards()
      .then((cards) => {setCards(cards);setLoadingPage(false)})
      .catch((err) => {console.log(err)})
    api.getInitialUser()
      .then((promis) => {setCurrentUser(promis)})
      .catch((err) => {console.log(err)})
  },[selectedFilter])

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  };

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(true);
  };

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  };

  function handleRemoveCardClick(card) {
    setRemoveCardPopupOpen(true);
    setSelectedCardForRemove(card);
  };

  function handleCardClick(card) {
    setSelectedCard(card);
  } 

  function closeAllPopups() {
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setRemoveCardPopupOpen(false);
    setSelectedCard({});
  }

  function handleUpdateUser(currentUser) {
    setLoading(true);
    api.setUserInfo(currentUser)
    .then((promis) => {
      setCurrentUser(promis);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    })
  }

  function handleUpdateAvatar(currentUser) {
    setLoading(true);
    api.updateAvatar(currentUser)
    .then((promis) => {
      setCurrentUser(promis);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    })
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);    
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {setCards((state) => state.map((c) => c._id === card._id ? newCard : c))})
      .catch((err) => {console.log(`Ошибка: ${err}`)});  
  }

    function handleCardDelete(card) {
      api.removeCard(card._id)
        .then(() => {
          setCards((state) => state.filter((item) => item !== card));
          closeAllPopups();
        })
        .catch((err) => {console.log(`Ошибка: ${err}`)});     
    }

    function handleAddPlaceSubmit(card) {
      setLoading(true);
      api.addCard(card.name, card.link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      })
    }

  return (
    <CurrentUserContext.Provider value={currentUser}> 
  <div className="page">
    <div className="container">
      <Header />
      {loadingPage 
      ? <div style={{display: "flex", alignItems:"center", marginTop:"20px", minHeight: "70vh", flexDirection:"column"}}><Loader/></div>
      : <Main 
      onEditProfile={handleEditProfileClick} 
      onAddPlace={handleAddPlaceClick}  
      onEditAvatar={handleEditAvatarClick} 
      onCardClick={handleCardClick} 
      cards={cards} 
      onCardLike={handleCardLike}
      onCardDelete={handleRemoveCardClick}  
      selectedFilter={selectedFilter}    
      setSelectedFilter={setSelectedFilter}        
      />
      }      
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={loading}/>
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={loading}/>
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={loading}/>
      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
      <PopupWithConfirmation isOpen={isRemoveCardPopupOpen} onClose={closeAllPopups} card={selectedCardForRemove} onDeleteCard={handleCardDelete}/>
      <Footer />
    </div>    
    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
