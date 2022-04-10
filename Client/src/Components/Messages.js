import Message from "./Message"
import "./Messages.css"
import React, { useCallback } from 'react'


const Messages = ( {messages, myName, secretKey} ) => {

  const setRef = useCallback(node => {
    if (node) {
      node.scrollIntoView({ smooth: true })
    }
  }, []);


  return (

    <div className="Messages-list" id="ML">
      {messages.map((messageDict, index) => {
        const lastMessage = messages.length - 1 === index
        return (
            <div 
              className={(messageDict.from === myName) ? "MyMessage" : "TheirMessage"} 
              key={index} ref={lastMessage ? setRef : null} 
            >
              <Message
                theMessage={messageDict}
                isMyMessage={(messageDict.from === myName)}
                secretKey={secretKey}
              />
            </div>
        )}
      )}
    </div>
  )
}

export default Messages