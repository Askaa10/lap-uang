export function generateToken() {
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let token = '';
for (let i = 0; i < 6; i++) {
token += alphabet[Math.floor(Math.random() * alphabet.length)];
}
return token;
}