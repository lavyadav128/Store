// const server ="http://localhost:3000"

// export default server;


let IS_PROD = true;
const server = IS_PROD ?
    // "https://notenove.onrender.com" :
    "https://storeb-gqvy.onrender.com":
    "http://localhost:3000"

  
export default server;