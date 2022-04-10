import { useState } from 'react';
import "./EnterMessages.css";

const EnterMessages = ( {addMessage} ) => {
  const [text, setText] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(text);
    if (text !== "") {
      addMessage(text);
    }
    
    setText('');
  }
  
  return (
    <div className='EnterMessages'>
      <form onSubmit={(e) => {handleSubmit(e)}}>
        <input 
          className='inputBox' 
          type="text" 
          onChange={(e) => setText(e.target.value)} 
          value={text}
          placeholder={"Aa"}
        />
      </form>
    </div>
  )
}

export default EnterMessages