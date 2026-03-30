const HOST = import.meta.env.VITE_BACKEND_HOST || "localhost"
export const CONTEXT_PATH="/"
export const BACKEND_PORT= import.meta.env.VITE_BACKEND_PORT || "8001"
export const HOST_URL = import.meta.env.VITE_BACKEND_URL || ("http://" + HOST + ":" + BACKEND_PORT)
//export const SOCKET_URL = "http://" + HOST + ":8090"
export const PATH_PREFIX= ""
export const STATIC_PATH="/static/"
