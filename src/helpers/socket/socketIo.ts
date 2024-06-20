import { io } from 'socket.io-client'

const connectSocketIo = () => {
  const socket = io('http://localhost:3001')

  return socket
}

export default connectSocketIo
