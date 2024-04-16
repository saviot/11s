import profilEdit from '../images/profile_edit.svg';
import iconEdit from '../images/icon_edit.svg';
import iconAdd from '../images/icon_add.svg';
import EditProfileModal from './EditProfileModal';
import {useEffect, useState} from 'react';
import CreateCardModal from './CreateCardModal';
import UpdateAvatarModal from './UpdateAvatarModal';
import Api from '../utils/api';
import Card from './Card';

function Main() {
  const [userData, setUserData] = useState({
    nama: '',
    title: '',
    avatar: '',
  });
  const [cardData, setCardData] = useState([]);

  const user = new Api().getUserInfo();
  const cards = new Api().getAllCards();

  useEffect(() => {
    user.then((res) => {
      setUserData({
        nama: res.name,
        title: res.about,
        avatar: res.avatar,
      });

      document.body.id = res._id;
    });

    cards.then((res) => {
      setCardData(res);
    });
  }, []); // eslint-disable-line

  return (
    <main>
      <section className='profile'>
        <div className='profile__container'>
          <HandleChangeAvatarClick
            avatar={userData.avatar ? userData.avatar : '#'}
            setUserData={setUserData}
          />
          <div className='profile__info'>
            <div className='profile__name-container'>
              <h1 className='profile__name'>
                {userData.nama ? userData.nama : '....'}
              </h1>
              <HandleEditProfileClick
                nama={userData.nama}
                title={userData.title}
                setUserData={setUserData}
              />
            </div>
            <p className='profile__title'>
              {userData.title ? userData.title : '....'}
            </p>
          </div>
          <HandleCreateNewCardClick setCardData={setCardData} />
        </div>
      </section>
      <section className='card'>
        <div className='card__container'>
          {/* loop */}
          {cardData.map((card) => (
            <Card
              key={card._id}
              link={card.link}
              name={card.name}
              likes={card.likes}
              card_id={card._id}
              owner_id={card.owner._id}
              setCardData={setCardData}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function HandleEditProfileClick({nama, title, setUserData}) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className='profile__icon' onClick={openModal}>
        <img src={iconEdit} alt='edit akun' />
      </button>
      <EditProfileModal
        isOpen={modalOpen}
        onClose={closeModal}
        nama={nama}
        title={title}
        setUserData={setUserData}
      />
    </>
  );
}

function HandleCreateNewCardClick({setCardData}) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className='profile__button' onClick={openModal}>
        <img src={iconAdd} alt='tambah' />
      </button>
      <CreateCardModal
        isOpen={modalOpen}
        onClose={closeModal}
        setCardData={setCardData}
      />
    </>
  );
}

function HandleChangeAvatarClick({avatar, setUserData}) {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className='profile__image'>
      <img className='profile__image-src' src={avatar} alt='profile' />
      <div className='edit-icon'>
        <button className='profile__icon' onClick={openModal}>
          <img src={profilEdit} alt='edit' />
        </button>
      </div>
      <UpdateAvatarModal
        isOpen={modalOpen}
        onClose={closeModal}
        setUserData={setUserData}
      />
    </div>
  );
}

export default Main;
