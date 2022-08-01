import './style.css';
import kenshin from './kenshin.jpg';

const p = document.querySelector('p');

p.textContent = 'Build successful!';

const div = document.createElement('div');
document.body.appendChild(div);

const kenshinImage = new Image();
kenshinImage.src = kenshin;
div.appendChild(kenshinImage);