const generateID = () => Math.random().toString().substring(2) + Date.now().toString(32) 

export {
    generateID
}