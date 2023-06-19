import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [friends, setFriends] = useState([...initialFriends]);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
  }

  function handleSelectFriend(id) {
    setSelectedFriend(friends.filter((friend) => friend.id === id)[0]);
  }

  function handleSplitBill(id, newBalance) {
    setFriends((friends) => {
      return friends.map((f) => {
        if (f.id !== id) return f;
        return { ...f, balance: newBalance };
      });
    });
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelect={handleSelectFriend}
        />
        <AddFriend onAddFriend={handleAddFriend} />
      </div>
      <div className="sidebar">
        <SplitBillForm
          friend={selectedFriend}
          onSplitBill={handleSplitBill}
          key={selectedFriend?.id}
        />
      </div>
    </div>
  );
}

function FriendList({ friends, selectedFriend, onSelect }) {
  return (
    <ul>
      {friends.map((f) => (
        <Friend
          key={f.id}
          friendObj={f}
          selectedFriend={selectedFriend}
          onSelect={onSelect}
        />
      ))}
    </ul>
  );
}

function Friend({ friendObj, selectedFriend, onSelect }) {
  let msg;
  let color;
  const { id, name, image, balance } = friendObj;
  if (balance === 0) {
    msg = `You and ${name} are even.`;
    color = "black";
  }
  if (balance > 0) {
    msg = `${name} owes you ${Math.abs(balance)}$`;
    color = "green";
  }
  if (balance < 0) {
    msg = `You owe ${name} ${Math.abs(balance)}$`;
    color = "red";
  }

  return (
    <li>
      <img src={image} alt={name}></img>
      <h3>{name}</h3>
      <p className={color}>{msg}</p>
      <button
        className="button"
        onClick={() => {
          selectedFriend?.id === id ? onSelect(null) : onSelect(id);
        }}
      >
        {selectedFriend?.id === id ? "Close" : "Selected"}
      </button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [collapsed, setCollapsed] = useState(true);
  function handleFormSubmit(friend) {
    onAddFriend(friend);
    setCollapsed(true);
  }
  return (
    <>
      <AddFriendForm onSubmit={handleFormSubmit} collapsed={collapsed} />
      <button
        className="button"
        onClick={() => setCollapsed((collapsed) => !collapsed)}
      >
        {collapsed ? "Add friend" : "Close"}
      </button>
    </>
  );
}

function AddFriendForm({ onSubmit, collapsed }) {
  const defaultUrl = "https://i.pravatar.cc/48?u=";
  const [name, setName] = useState("");
  const [url, setUrl] = useState(defaultUrl);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (!name || !url) return;
    const id = crypto.randomUUID();
    onSubmit({
      id: id,
      name: name,
      image: url !== defaultUrl ? url : url + id,
      balance: 0,
    });
    setName("");
    setUrl(defaultUrl);
  }

  if (collapsed) return;

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label htmlFor="name">👭 Friend name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="url">🎆 Image URL</label>
      <input
        id="url"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button className="button">ADD</button>
    </form>
  );
}

function SplitBillForm({ friend, onSplitBill }) {
  const [total, setTotal] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isPaying, setIsPaying] = useState(true);
  const friendExpense = total - expense;

  function handleSubmit(e) {
    e.preventDefault();
    if (!total) return;
    const newBalance = isPaying
      ? friend.balance + friendExpense
      : friend.balance - expense;
    onSplitBill(friend.id, newBalance);
  }

  if (!friend) return;

  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split bill with {friend.name}</h2>
        <label htmlFor="total-amount">💰 Bill value</label>
        <input
          id="total-amount"
          type="number"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
        />
        <label htmlFor="own-expense">🧍 Your expense</label>
        <input
          id="friend-expense"
          type="number"
          value={expense}
          onChange={(e) =>
            setExpense(
              Number(e.target.value) > total ? expense : Number(e.target.value)
            )
          }
          disabled={total ? false : true}
        />
        <label htmlFor="own-expense">👭 {`${friend.name}'s' expense`}</label>
        <input
          id="friend-expense"
          type="number"
          value={friendExpense}
          disabled
        />
        <label htmlFor="payer">🤑 Who is paying the bill?</label>
        <select
          id="payer"
          value={Number(isPaying)}
          onChange={() => setIsPaying(!isPaying)}
        >
          <option value="1">You</option>
          <option value="0">{friend.name}</option>
        </select>
        <button className="button">Split bill</button>
      </form>
    </>
  );
}

export default App;
