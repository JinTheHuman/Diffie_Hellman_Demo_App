import React from 'react'
import { useState } from 'react'
import "./Message.css"
import CryptoJS from 'crypto-js'
import key from "../key.png"

const Message = ( {theMessage, isMyMessage, secretKey} ) => {
  // console.log("inside msg", theMessage.message);
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [decryptedMessage, setDecryptedMessage] = useState("poop");
  const [text, setText] = useState('');

  // if (theMessage.message !== "Sample Message") {
  //   decryptedMessage = CryptoJS.AES.decrypt(theMessage.message, secretKey.toString()).toString(CryptoJS.enc.Utf8);
  // }
  const handleOnclick = (e) => {
    console.log(e.target);
    setShowDecrypted(!showDecrypted);
    setDecryptedMessage(CryptoJS.AES.decrypt(theMessage.message, text).toString(CryptoJS.enc.Utf8));
    setText("");
  }
  
  const stop = (e)=> {
    e.stopPropagation();
  }

  const handleChange = (e) => {
    console.log(e.target.value);
    setText(e.target.value)
  }
	return (
    <div className='message-container'>
      <div className='sender-name'>{isMyMessage ? "You" : theMessage.from}</div>
      <div className='bubble' style={isMyMessage ? {"flex-direction": "row-reverse"} : {"flex-direction": "row"}}>
        <div className='message-text' style={isMyMessage ? {background: "#efe81b"} : {background: "#30d95d"}}>
          {showDecrypted ? decryptedMessage : theMessage.message}
        </div>
        <div className='KeyButton' onClick={(e)=>handleOnclick(e)}>
          <img src={key} alt="" className='key-img'/>
          {!showDecrypted && <input placeholder={"Enter Key"} value={text} className='EnterKey' onClick={(e)=>stop(e)} onChange={(e)=>handleChange(e)}></input>}
        </div>
      </div>
    </div>
  )
}

export default Message