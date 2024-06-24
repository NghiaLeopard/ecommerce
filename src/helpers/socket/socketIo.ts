import { io } from 'socket.io-client'

const connectSocketIo = () => {
  const socket = io(process.env.NEXT_PUBLIC_API_HOST as string)

  return socket
}

export default connectSocketIo
