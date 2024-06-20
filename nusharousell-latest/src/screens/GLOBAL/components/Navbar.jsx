import React, { useState } from 'react';
import { auth } from '../../../config/firebase';
import '../../styles/Navbar.css';
import Profile from '../../profile/Profile';
import logo from '../assets/logos/logo-horizontal.png';
import { FaSearch, FaRegHeart } from 'react-icons/fa';
import { MdChatBubbleOutline } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';

export default function Navbar({ user, setUser, defaultSearch }) {
	const [search, setSearch] = useState('');
	const handleSearch = (e) => {
		e.preventDefault();
	};

  async function handleLogout() {
    try {
      await auth.signOut();
      setUser(null);
      // console.log("User logged out successfully!");
    } catch (error) {
      // console.error("Error logging out:", error.message);
    }
  }

	return (
		<div className='header'>
			<div className='top-header'>
				<div className='leftside-header'>
					<a href='/'>
						<img
							src={logo}
							alt='logo'
						/>
          </a>
        </div>
        {user ? (
          <div className='rightside-header'>
            <div className='dropdown'>
              <a className='dropbtn'>Hello, {user.username} <CgProfile /></a>
              <div className='dropdown-content'>
                <a onClick={() => window.location.href ='/profile'}>Profile </a>
                <a href='#'>Manage Listings</a>
                <a href='#'>Settings</a>
                <a onClick={() => {
                  handleLogout();
                  window.location.href = '/';
                  }}>Logout</a>
              </div>
            </div>
            <a href='/'><FaRegHeart /></a>
            <a onClick={() => window.location.href = '/chats'}><MdChatBubbleOutline /></a>
            <a onClick={() => window.location.href = '/addproduct'}>Sell</a>
          </div>
        ) : (
          <div className='rightside-header'>
            <a onClick={() => window.location.href = '/login'}>Login</a>      
            <a onClick={() => window.location.href = '/signup'}>Register</a>
          </div>
        )}
      </div>       
			<div className='bottom-header'>
				<div className='search_box'>
					<input
						type='text'
						value={search}
						placeholder='Search'
						onChange={(e) => setSearch(e.target.value)}></input>
					<button onClick={handleSearch}>
						<FaSearch />{' '}
					</button>
				</div>
			</div>
		</div>
  );
}


