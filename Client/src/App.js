import { useState, useEffect } from 'react';
import './App.css';
import EnterMessages from './Components/EnterMessages';
import Messages from './Components/Messages';
import { io } from 'socket.io-client';
import SocketContext, { socket } from "./socket";
import CryptoJS from 'crypto-js';
/* global BigInt */

//const socket = io(`http://${window.location.hostname}:5000`);

function App() {
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   console.log("creating socket");
  //   const newSocket = io(`http://${window.location.hostname}:5000`);
  //   setSocket(newSocket);
  //   return () => newSocket.close();
  // }, [setSocket])

  const [messages, setMessages] = useState([
    {
      id: 0,
      from: "Alice",
      message: "Sample Message",
    }
  ]);
  const [nextID, setNextID] = useState(1);
  const [name, setName] = useState("No-Name");
  const [secretKey, setSecretKey] = useState(0);
  const [g, setG] = useState(-1);
  const [n, setN] = useState(-1);
  const [a, setA] = useState(-1);
  const [showA, setShowA] = useState(false);
  const [showADiffie, setShowADiffie] = useState(false);
  const [showBDiffie, setShowBDiffie] = useState(false);
  const [sent, setSent] = useState(false);

  const handleAclick = () => {
    setShowA(true);
    if (name == "Alice") {
      setShowADiffie(true); 
    } else if (name == "Bob") {
      setShowBDiffie(true);
    }
  }
  
  const sendDiffie = () => {
    if (name == "Alice") {
      socket.emit("send-Diffie-A");
      setSent(true);
    } else if (name == "Bob") {
      socket.emit("send-Diffie-B");
      setSent(true);
    }
  }

  const [theDiffies, setTheDiffies] = useState({
    Alice: 0,
    Bob: 0
  });
  const [myDiffie, setMyDiffie] = useState(-1);

  const calculateMyDiffie = () => {
    console.log("calculating diffie");

    console.log("g:", g);
    console.log("a:", a);
    let poop = g**a % n;
    setMyDiffie(poop.toString());
    socket.emit("sendDiffie", [poop.toString(), name]);
    console.log("My Diffie", poop);

    if (name === "Alice") {
      setTheDiffies(
        {
          ...theDiffies,
          Alice: poop
        }
      )
    } else if (name === "Bob") {
      setTheDiffies(
        {
          ...theDiffies,
          Alice: poop
        }
      )
    }
  }
  
  //if (socket) {
    socket.on("receive-message", (receivedMessages) => {
      console.log("receieved messages");
      setMessages(receivedMessages);
      // updateMessage(receivedMessages.message);
    });

    socket.on("receive-name", (name) => {
      setName(name);
    })

    socket.on("receive-diffie-hellman", (numbers)=>{
      setG(BigInt(numbers[0]));
      setN(BigInt(numbers[1]));
      let Randa = (BigInt(Math.floor(Math.random() * 100000))) % BigInt(numbers[1])
      setA(Randa);      
      console.log("I received", numbers);
    })

    //socket.off('calculateMyDiffie', calculateMyDiffie).on('calculateMyDiffie', calculateMyDiffie);
    socket.on("calculateMyDiffie", (number)=>{
      console.log("calculating diffie", number);
      if (name !== "No-Name") {
        calculateMyDiffie();
      }
    })

    socket.on("receive-others-diffie", (diffies)=>{
      setTheDiffies(diffies);
      console.log("diffie")
      if (name == "Alice") {
        let key = (BigInt(diffies.Bob)*BigInt(g**a % n)) % BigInt(n);
        console.log("My key is", key)
        setSecretKey(key);
      } else if (name === "Bob") {
        let key = (BigInt(diffies.Alice)*BigInt(g**a % n)) % BigInt(n);
        console.log("My key is", key)
        setSecretKey(key);
      }
    })

    socket.on("showA", ()=>{
      setShowADiffie(true);
    })

    socket.on("showB", ()=>{
      setShowBDiffie(true);
    })
  //}

  


  const updateMessage = (text) => {
    var newMessage = {
      id: nextID,
      from: name,
      message: text
    }
    setNextID(nextID + 1);
    setMessages([...messages, newMessage]);
  }

  const addMessage = (text) => {
    let encryptedText = CryptoJS.AES.encrypt(text, secretKey.toString()).toString();
    var newMessage = {
      id: nextID,
      from: name,
      message: encryptedText
    }
    socket.emit("send-message", newMessage);
    setNextID(nextID + 1);    
    setMessages([...messages, newMessage]);
  }

  if (name === "No-Name") {
    return (
    <>
      <h1 className='name'>Charlie</h1>
      <div className="App container">
        <div className='Message-Display'>
          <Messages className="Messages" messages={messages} myName={name} secretKey={secretKey}/>
          {/* <EnterMessages className="EnterMessages" addMessage={addMessage}/> */}
        </div>
        <div className='key-info'>
          <h1 className='title'>What Charlie Knows</h1>
          <div className='valueBox'>g: <p className='value'>{g.toString()}</p></div>
          <div className='valueBox'>n: <p className='value'>{n.toString()}</p></div>
          <div className='valueBox'>g^a mod n: <p className='value diffie'>{showADiffie ? theDiffies.Alice.toString() : "Unknown"}</p></div>
          <div className='valueBox'>g^b mod n: <p className='value diffie'>{showBDiffie ? theDiffies.Bob.toString() : "Unknown"}</p></div>
          <div className='valueBox'>Secret Key: <p className='value'>Unknown</p></div>
        </div>
      </div>
    </>
    )
  }
  return (
    <>
      <h1 className='name'>{name}</h1>
      <div className="App container">
        <div className='Message-Display'>
          <Messages className="Messages" messages={messages} myName={name} secretKey={secretKey}/>
          <EnterMessages className="EnterMessages" addMessage={addMessage}/>
        </div>
        <div className='key-info'>
          <h1 className='title'>KeyINFO</h1>
          <div className='valueBox'>g: <p className='value'>{g.toString()}</p></div>
          <div className='valueBox'>n: <p className='value'>{n.toString()}</p></div>
          <div className='valueBox'>{name == "Alice" ? "a: " : "b: "} {showA ? <p className='value A'>{a.toString()}</p> :  <div className="createSecret" onClick={handleAclick}>Create My Secret Key</div> }</div>
          <div className='valueBox'>g^a mod n: <p className='value diffie'>{showADiffie ? theDiffies.Alice.toString() : "Unknown"}</p></div>
          {(name === "Alice" && showA && !sent) && <div className="sendButton" onClick={sendDiffie}>Send g^a mod n</div>}
          {(name === "Alice" && showA && sent) && <div className="sendButton" onClick={sendDiffie}>Send Again</div>}
          <div className='valueBox'>g^b mod n: <p className='value diffie'>{showBDiffie ? theDiffies.Bob.toString() : "Unknown"}</p></div>
          {(name === "Bob" && showA && !sent) && <div className="sendButton" onClick={sendDiffie}>Send g^a mod n</div>}
          {(name === "Bob" && showA && sent) && <div className="sendButton" onClick={sendDiffie}>Send Again</div>}
          {(showADiffie && showBDiffie) ?
            <div className='valueBox'>Secret Key: <p className='value key'>{secretKey.toString()}</p></div>
            :
            <div className='valueBox'>Secret Key: <p className='value'>Unknown</p></div>
          }
        </div>
      </div>
    </>
  );
}

export default App;
