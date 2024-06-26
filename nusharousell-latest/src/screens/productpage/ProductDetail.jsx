import React, {useEffect, useState, useContext} from "react";
import{useParams, Link, useNavigate} from 'react-router-dom';
import {db,auth} from '../../config/firebase';
import "../styles/ProductDetail.css";
import { FaRegHeart } from "react-icons/fa";
import { ChatContext } from '../chats/ChatContext';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import '../styles/ProductDetail.css';
import { useUser } from '../GLOBAL/contexts/UserContext'; // Import useUser from context


export default function ProductDetail() {
  const { productID } = useParams();
  const [product, setProduct] = useState(null);
  const {checkChatroom} = useContext(ChatContext);
  
  const navigate = useNavigate();
  const { user } = useUser(); // Use user from context
  const [userIsSeller, setUserIsSeller] = useState(false); // State to track if user is the seller

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'Products', productID);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists) {
          const productData = docSnapshot.data();
          setProduct(productData);
          // Check if the current user is the seller
          if (user && productData.sellerID === user.userID) {
            setUserIsSeller(true);
          } else {
            setUserIsSeller(false);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    
    fetchProduct();
  }, [productID, user]); // Depend on user to handle updates

  const handleChatClick = async (otherUserId) => {
    try {
      const currentUser = auth.currentUser; 
      if (!currentUser) {
        throw new Error("User is not logged in.");
      }
  
      const currentUseruid = currentUser.uid;
      const chatroomId = await checkChatroom(currentUseruid, otherUserId); 
      navigate(`/chat/${chatroomId}`);
    } catch (error) {
      console.error("Error handling chat click:", error);
    }
  };

  const handleMarkAsReserved = async () => {
    try {
      const productRef = doc(db, 'Products', productID);
      await updateDoc(productRef, {
        productStatus: 'Reserved',
      });
      console.log('Product marked as Reserved successfully!');
      window.location.reload();
      // Update local state if needed
    } catch (error) {
      console.error('Error marking product as Reserved:', error);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      const productRef = doc(db, 'Products', productID);
      await updateDoc(productRef, {
        productStatus: 'Sold',
      });
      console.log('Product marked as Sold successfully!');
      window.location.reload();
      // Update local state if needed
    } catch (error) {
      console.error('Error marking product as Sold:', error);
    }
  };

  const handleDeleteListing = async () => {
    try {
      const productRef = doc(db, 'Products', productID);
      await deleteDoc(productRef);
      console.log('Product deleted successfully!');
      // Navigate back to profile page
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <br />
      <div className='product-info'>
        <img src={product.productImage} alt={`${product.productName}`} />
        <div className='product-details'>
          <h4>Item</h4>
          <p>{product.productName}</p>
          <br />
          <h4>Condition</h4>
          <p>{product.productCondition}</p>
          <br />
          <h4>Price</h4>
          <p>{product.productPrice}</p>
          <br />
          <h4>Description</h4>
          <p>{product.productDescription}</p>
          <br />
          <h4>Meet-Up Location</h4>
          <p>{product.productLocation}</p>
          <br />
          <h4>Seller</h4>
          <p>{product.sellerUserName}</p>
          <br />
          <div>
            <h4>Item Status</h4>
            <p>{product.productStatus}</p>
          </div>
          <div className='action-container'>
            {/* Conditional rendering based on userIsSeller */}
            {userIsSeller ? (
              <>
                <Link to={`/chats/${productID}`} className='bold-link'>
                  View Chats
                </Link>
                <Link to={`/edit/${productID}`} className='action-link'>
                  Edit Listing
                </Link>
                <button className='action-button' onClick={handleMarkAsReserved}>
                  Mark as Reserved
                </button>
                <button className='action-button' onClick={handleMarkAsSold}>
                  Mark as Sold
                </button>
                <button className='action-button' onClick={handleDeleteListing}>
                  Delete Listing
                </button>
              </>
            ) : (
              <>
                <Link to={`/chats/${productID}`} className='bold-link'>
                  Chat with Seller
                </Link>
                <Link to={`/like/${productID}`} className='action-link'>
                  Like
                </Link>
              </>
            )}
          </div>
        </div>
        {/* Display SOLD or RESERVED banner based on productStatus */}
        {product.productStatus === 'Sold' && <div className='status-banner sold-banner'>SOLD</div>}
        {product.productStatus === 'Reserved' && <div className='status-banner reserved-banner'>RESERVED</div>}
      </div>
    </>
  );
}
//<button onClick={() => handleChatClick(product.sellerId)}>Chat with seller</button>