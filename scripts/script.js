const choices = document.querySelectorAll('.model, .neck, .material');
const submitOrder =  document.querySelector('.submit');
const input = document.querySelector('.input-url');
const order = {};
const imageFormats = ['jpeg', 'gif', 'png', 'jpg', 'bmp', 'tiff', 'svg', 'webp'];

order['author'] = prompt('Enter your name:');


choices.forEach((choice) => {
    choice.addEventListener('click', () => {
        const userChoice = choice.getAttribute('class').split(' ');
        order[userChoice[0]] =  userChoice[1];

        select();    
        getReadyOrder();       
    })
})

input.addEventListener('keyup', () => {
    order['image'] = input.value;
    getReadyOrder(); 
})

submitOrder.addEventListener('click', () => postShirts())

const getReadyOrder = () => {
    if(Object.keys(order).length == 5 && urlValidator(order['image']) && imageValidator()){  
            submitOrder.classList.add('abled')
    }
}

const urlValidator = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (e) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

const imageValidator = () => {
    let image = (order['image']).split('').reverse().join('');
    image = image.split('.', 1);

    let format = image[0].split('').reverse().join('');

    const testImage = imageFormats.filter( extension => {
        return format == extension
    })
    
    if(testImage.length == 0) {
        alert('Name a valid image URL')
    }

    return testImage.length == 1 ? true : false;
}

const select = () => {
    choices.forEach( element => {
        const identifier = (element.getAttribute('class').split(' '))[1];

        if( identifier == order['model'] || identifier == order['neck'] || identifier == order['material'] ) {
            element.classList.add('selected');
        }else {
            element.classList.remove('selected');
        }
    })        
}

const renderShirts = (shirts) => {
    const container = document.querySelector('.last-orders')

    for(let i = 0; i < 9; i++) {
        const element = `<article>
                            <div class='card-tshirt'>
                                <img src=${shirts[i].image}>
                                <h5><span>Criador:</span> ${shirts[i].owner}</h5>
                            </div>  
                        </article>`
        container.innerHTML += element;
    }
}

const getShirts = () => {
    axios.get('https://mock-api.driven.com.br/api/v4/shirts-api/shirts')
        .then(response => renderShirts(response.data))
        .catch(err => console.error(err))
}


const postShirts = () => {
    order['owner'] = order['author'];
    axios.post('https://mock-api.driven.com.br/api/v4/shirts-api/shirts', order )
        .then(response => console.log(response))
        .catch(err => console.log(err))
}

getShirts();
