const krishna = "Hare Krishna";
const one = "one";
const two = "two";

export const genRandom = () => {
    return Math.floor(Math.random() * 100);
    // <=>
    // return ~~(Math.random() * 100);
}

// module.exports = krishna;
export default krishna;
export {one ,two};