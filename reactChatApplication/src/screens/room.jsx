import React,{useState} from 'react'
import { useNavigate } from 'react-router'

function Room() {
    const [name,setName]=useState('');
    const [roomId,setRoomId]=useState('');
    const navigate = useNavigate();
    const handleJoinRoom = (e) => {
        e.preventDefault();
        navigate('/chat',{state:{name,roomId}});
      };

  return (
<div class="max-w-md mx-auto relative overflow-hidden z-10 bg-white p-8 rounded-lg">
  <h2 class="text-2xl text-gray-600 font-bold mb-6">Join Room</h2>

  <form onSubmit={handleJoinRoom}>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600" for="name">Full Name</label>
      <input value={name} class="mt-1 p-2 w-full border rounded-md outline-none" type="text" onChange={(e)=>setName(e.target.value)} />
    </div>

    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-600" for="room_id">Room ID.</label>
      <input value={roomId} class="mt-1 p-2 w-full border rounded-md outline-none" type="text" onChange={(e)=>setRoomId(e.target.value)} />
    </div>

    <div class="flex justify-end">
      <button
        class=" bg-gray-600 text-white px-4 py-2 font-bold rounded-md hover:bg-slate-400 transition-colors ease-linear duration-150"
        type="submit"
      >
        Update Profile
      </button>
    </div>
  </form>
</div>

  )
}

export default Room